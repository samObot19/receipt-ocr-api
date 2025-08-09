import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Receipt as ReceiptIcon, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react'
import { GET_RECEIPTS } from '../graphql/queries'
import type { Receipt } from '../types/graphql'

interface GetReceiptsData {
  receipts: Receipt[]
}

const ReceiptsPage = () => {
  const { data, loading, error, refetch } = useQuery<GetReceiptsData>(GET_RECEIPTS)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Failed to load receipts</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const receipts = data?.receipts || []

  if (receipts.length === 0) {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
          <ReceiptIcon className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">No receipts yet</h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Start by uploading your first receipt. Our OCR technology will automatically 
            extract all the important details for you.
          </p>
          <Link to="/upload" className="btn-primary mt-4 inline-block">
            Upload First Receipt
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Receipts</h1>
          <p className="text-gray-600 mt-2">
            {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link to="/upload" className="btn-primary mt-4 sm:mt-0">
          Upload New Receipt
        </Link>
      </div>

      {/* Receipts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {receipts.map((receipt) => (
          <Link
            key={receipt.id}
            to={`/receipts/${receipt.id}`}
            className="card hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {/* Receipt Image */}
            <div className="relative mb-4">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={receipt.imageUrl}
                  alt={`Receipt from ${receipt.storeName}`}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgc3Ryb2tlPSIjOTM5MzlhIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIGZpbGw9IiM5MzkzOWEiLz4KPHBhdGggZD0ibTIxIDEyLTUtNUwxMSA3bC01IDUtNyA3IiBzdHJva2U9IiM5MzkzOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
                  }}
                />
              </div>
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                <ReceiptIcon className="h-4 w-4 text-gray-600" />
              </div>
            </div>

            {/* Receipt Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {receipt.storeName}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(receipt.purchaseDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {receipt.totalAmount.toFixed(2)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-1" />
                  {receipt.items.length} item{receipt.items.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Items Preview */}
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Items:</p>
                <div className="space-y-1">
                  {receipt.items.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate">
                        {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}
                        {item.name}
                      </span>
                      <span className="text-gray-900 font-medium ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {receipt.items.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{receipt.items.length - 3} more item{receipt.items.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ReceiptsPage
