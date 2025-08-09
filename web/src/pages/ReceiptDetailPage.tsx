import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Trash2, 
  Plus,
  Calendar,
  Store,
  DollarSign,
  Package
} from 'lucide-react'
import { GET_RECEIPT, GET_RECEIPTS } from '../graphql/queries'
import { UPDATE_RECEIPT, DELETE_RECEIPT, UPDATE_ITEM, DELETE_ITEM } from '../graphql/mutations'
import type { Receipt, Item, ReceiptInput, ItemInput } from '../types/graphql'

interface GetReceiptData {
  receipt: Receipt
}

interface GetReceiptVars {
  id: string
}

const ReceiptDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editedReceipt, setEditedReceipt] = useState<Partial<Receipt>>({})
  const [editedItem, setEditedItem] = useState<Partial<Item>>({})

  const { data, loading, error } = useQuery<GetReceiptData, GetReceiptVars>(
    GET_RECEIPT,
    { 
      variables: { id: id! },
      skip: !id 
    }
  )

  const [updateReceipt, { loading: updateLoading }] = useMutation(UPDATE_RECEIPT, {
    onCompleted: () => {
      toast.success('Receipt updated successfully!')
      setIsEditing(false)
      setEditedReceipt({})
    },
    onError: (error) => {
      toast.error(`Failed to update receipt: ${error.message}`)
    }
  })

  const [deleteReceipt, { loading: deleteLoading }] = useMutation(DELETE_RECEIPT, {
    refetchQueries: [{ query: GET_RECEIPTS }],
    onCompleted: () => {
      toast.success('Receipt deleted successfully!')
      navigate('/receipts')
    },
    onError: (error) => {
      toast.error(`Failed to delete receipt: ${error.message}`)
    }
  })

  const [updateItem] = useMutation(UPDATE_ITEM, {
    onCompleted: () => {
      toast.success('Item updated successfully!')
      setEditingItemId(null)
      setEditedItem({})
    },
    onError: (error) => {
      toast.error(`Failed to update item: ${error.message}`)
    }
  })

  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: [{ query: GET_RECEIPT, variables: { id: id! } }],
    onCompleted: () => {
      toast.success('Item deleted successfully!')
    },
    onError: (error) => {
      toast.error(`Failed to delete item: ${error.message}`)
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !data?.receipt) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Receipt not found</h2>
        <p className="text-gray-600">The receipt you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/receipts')} className="btn-primary">
          Back to Receipts
        </button>
      </div>
    )
  }

  const receipt = data.receipt
  const currentReceipt = { ...receipt, ...editedReceipt }

  const handleSaveReceipt = async () => {
    const input: ReceiptInput = {
      storeName: currentReceipt.storeName,
      purchaseDate: currentReceipt.purchaseDate,
      totalAmount: currentReceipt.totalAmount,
      imageUrl: currentReceipt.imageUrl,
      items: currentReceipt.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    }

    await updateReceipt({
      variables: { id: receipt.id, input }
    })
  }

  const handleDeleteReceipt = async () => {
    if (window.confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) {
      await deleteReceipt({ variables: { id: receipt.id } })
    }
  }

  const handleSaveItem = async (item: Item) => {
    const input: ItemInput = {
      name: editedItem.name || item.name,
      quantity: editedItem.quantity !== undefined ? editedItem.quantity : item.quantity,
      price: editedItem.price !== undefined ? editedItem.price : item.price
    }

    await updateItem({
      variables: { id: item.id, input }
    })
  }

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem({ variables: { id: itemId } })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/receipts')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Receipts
        </button>
        
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Receipt
              </button>
              <button
                onClick={handleDeleteReceipt}
                disabled={deleteLoading}
                className="btn-danger flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveReceipt}
                disabled={updateLoading}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedReceipt({})
                }}
                className="btn-secondary flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Receipt Image */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Receipt Image</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src={receipt.imageUrl}
              alt={`Receipt from ${receipt.storeName}`}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgc3Ryb2tlPSIjOTM5MzlhIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIGZpbGw9IiM5MzkzOWEiLz4KPHBhdGggZD0ibTIxIDEyLTUtNUwxMSA3bC01IDUtNyA3IiBzdHJva2U9IiM5MzkzOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
              }}
            />
          </div>
        </div>

        {/* Receipt Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Receipt Details</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Store Name */}
            <div className="flex items-center space-x-3">
              <Store className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentReceipt.storeName}
                    onChange={(e) => setEditedReceipt({ ...editedReceipt, storeName: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{currentReceipt.storeName}</p>
                )}
              </div>
            </div>

            {/* Purchase Date */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={currentReceipt.purchaseDate?.split('T')[0] || ''}
                    onChange={(e) => setEditedReceipt({ ...editedReceipt, purchaseDate: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-lg text-gray-900">
                    {new Date(currentReceipt.purchaseDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={currentReceipt.totalAmount}
                    onChange={(e) => setEditedReceipt({ ...editedReceipt, totalAmount: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-bold">
                    ${currentReceipt.totalAmount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(receipt.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Items</h3>
          <span className="text-sm text-gray-600">
            {receipt.items.length} item{receipt.items.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {receipt.items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              {editingItemId === item.id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={editedItem.name !== undefined ? editedItem.name : item.name}
                      onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={editedItem.quantity !== undefined ? editedItem.quantity || '' : item.quantity || ''}
                      onChange={(e) => setEditedItem({ ...editedItem, quantity: e.target.value ? parseInt(e.target.value) : null })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editedItem.price !== undefined ? editedItem.price : item.price}
                      onChange={(e) => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => handleSaveItem(item)}
                      className="btn-primary px-3 py-1"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingItemId(null)
                        setEditedItem({})
                      }}
                      className="btn-secondary px-3 py-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <p className="font-medium text-gray-900">{item.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {item.quantity && (
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                      )}
                      <span className="font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingItemId(item.id)
                        setEditedItem({})
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReceiptDetailPage
