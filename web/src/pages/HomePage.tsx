import { Link } from 'react-router-dom'
import { Upload, Receipt, FileText, BarChart3 } from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Receipts',
      description: 'Easily upload receipt images with drag-and-drop functionality',
      action: 'Upload Now',
      path: '/upload',
      color: 'blue'
    },
    {
      icon: Receipt,
      title: 'View All Receipts',
      description: 'Browse through all your uploaded receipts in a clean grid layout',
      action: 'View Receipts',
      path: '/receipts',
      color: 'green'
    },
    {
      icon: FileText,
      title: 'OCR Processing',
      description: 'Automatic text extraction from receipt images using OCR technology',
      action: '',
      path: '',
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Smart Organization',
      description: 'Organize and edit receipt details with intuitive interface',
      action: '',
      path: '',
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Receipt OCR
          <span className="block text-blue-600">Made Simple</span>
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600">
          Upload your receipt images and let our OCR technology automatically extract store information, 
          items, prices, and more. Organize and manage your receipts with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/upload" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/receipts" className="btn-secondary text-lg px-8 py-3">
            View Receipts
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-${feature.color}-100`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                {feature.action && feature.path && (
                  <Link 
                    to={feature.path}
                    className={`inline-flex items-center text-${feature.color}-600 hover:text-${feature.color}-700 font-medium`}
                  >
                    {feature.action}
                    <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Powered by Advanced OCR Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;2s</div>
              <div className="text-gray-600">Processing Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
