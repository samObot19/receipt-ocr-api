import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch: (uri, options) => {
    const { body } = options!
    // Handle file uploads
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body)
        if (parsed.variables && hasFileUpload(parsed.variables)) {
          const formData = new FormData()
          const map: Record<string, string[]> = {}
          const files: File[] = []
          extractFiles(parsed.variables, files, map, 'variables')
          const operations = {
            query: parsed.query,
            variables: replaceFilesWithNull(parsed.variables),
          }
          formData.append('operations', JSON.stringify(operations))
          formData.append('map', JSON.stringify(map))
          files.forEach((file, index) => {
            formData.append(index.toString(), file, file.name)
          })
          const newHeaders = { ...options!.headers }
          delete (newHeaders as any)['content-type']
          delete (newHeaders as any)['Content-Type']
          return fetch(uri, {
            ...options,
            headers: newHeaders,
            body: formData,
          })
        }
      } catch (e) {
        console.log('Error parsing body:', e)
      }
    }
    return fetch(uri, options)
  },
})

function hasFileUpload(obj: any): boolean {
  if (obj instanceof File) return true
  if (Array.isArray(obj)) return obj.some(hasFileUpload)
  if (obj && typeof obj === 'object') {
    return Object.values(obj).some(hasFileUpload)
  }
  return false
}

function replaceFilesWithNull(obj: any): any {
  if (obj instanceof File) return null
  if (Array.isArray(obj)) return obj.map(replaceFilesWithNull)
  if (obj && typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceFilesWithNull(value)
    }
    return result
  }
  return obj
}

function extractFiles(
  obj: any,
  files: File[],
  map: Record<string, string[]>,
  path: string
): void {
  if (obj instanceof File) {
    const index = files.length
    files.push(obj)
    map[index.toString()] = [path]
    return
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      extractFiles(item, files, map, `${path}.${index}`)
    })
    return
  }
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      extractFiles(value, files, map, `${path}.${key}`)
    }
  }
}

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})
