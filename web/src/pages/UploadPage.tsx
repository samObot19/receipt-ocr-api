import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react'
import type { Receipt } from '../types/graphql'



const UploadPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedReceipt, setUploadedReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadedFile(file)
    setUploadProgress(10)
    setLoading(true)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData();
      formData.append('operations', JSON.stringify({
        query: `mutation ($file: Upload!) { uploadReceipt(file: $file) { id storeName imageUrl totalAmount purchaseDate items { id name } } }`,
        variables: { file: null }
      }));
      formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
      formData.append('0', file);

      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (json.data && json.data.uploadReceipt) {
        setUploadedReceipt(json.data.uploadReceipt);
        toast.success('Receipt uploaded and processed successfully!');
      } else {
        throw new Error(json.errors?.[0]?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload receipt. Please try again.');
      setUploadProgress(0);
      setUploadedFile(null);
    } finally {
      setLoading(false);
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: loading
  })

  const resetUpload = () => {
    setUploadedFile(null)
    setUploadedReceipt(null)
    setUploadProgress(0)
  }

  const viewReceipt = () => {
    if (uploadedReceipt) {
      navigate(`/receipts/${uploadedReceipt.id}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Receipt</h1>
        <p className="text-lg text-gray-600">
          Upload your receipt images (PNG, JPG, PDF) and let our OCR extract the details
        </p>
      </div>

      {!uploadedReceipt ? (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 cursor-pointer
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
              ${loading ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <Upload className="mx-auto h-16 w-16 text-gray-400" />
              <div>
                <p className="text-xl font-medium text-gray-900">
                  {isDragActive ? 'Drop your receipt here' : 'Drop receipt here or click to browse'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Supports PNG, JPG, and PDF files
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadedFile && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <File className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {loading ? 'Processing...' : 'Complete'}
                  </span>
                  <span className="text-gray-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Upload Success */
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
            <p className="text-gray-600">
              Your receipt has been processed and the following details were extracted:
            </p>
          </div>

          {/* Extracted Details Preview */}
          <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Store Name</span>
                <p className="text-lg text-gray-900">{uploadedReceipt.storeName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Amount</span>
                <p className="text-lg text-gray-900 font-bold">
                  ${uploadedReceipt.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Purchase Date</span>
                <p className="text-lg text-gray-900">
                  {new Date(uploadedReceipt.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Items Count</span>
                <p className="text-lg text-gray-900">{uploadedReceipt.items.length} items</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={viewReceipt} className="btn-primary">
              View Full Details
            </button>
            <button onClick={resetUpload} className="btn-secondary">
              Upload Another Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadPage
