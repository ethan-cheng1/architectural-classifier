import { useState } from 'react'
import { Card, CardHeader, CardBody, Button, Progress, Chip } from '@heroui/react'
import ImageUpload from './components/ImageUpload'
import ClassificationResult from './components/ClassificationResult'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleImageSelect = (file) => {
    setSelectedImage(file)
    setResults(null)
    setError(null)
  }

  const classifyImage = async () => {
    if (!selectedImage) return

    setIsClassifying(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedImage)

      const response = await fetch('http://localhost:8001/classify', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(`Classification failed: ${err.message}`)
      console.error('Classification error:', err)
    } finally {
      setIsClassifying(false)
    }
  }

  const resetApp = () => {
    setSelectedImage(null)
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏛️ Architectural Style Classifier
          </h1>
          <p className="text-gray-600 text-lg">
            Upload an image of a building to identify its architectural style
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold">Upload Image</h2>
            </CardHeader>
            <CardBody>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
              
              {selectedImage && (
                <div className="mt-4 flex gap-3">
                  <Button
                    color="primary"
                    size="lg"
                    onClick={classifyImage}
                    isLoading={isClassifying}
                    disabled={!selectedImage}
                  >
                    {isClassifying ? 'Analyzing...' : 'Classify Architecture'}
                  </Button>
                  
                  <Button
                    variant="bordered"
                    size="lg"
                    onClick={resetApp}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardBody>
                <div className="text-red-700">
                  <h3 className="font-semibold mb-1">Error</h3>
                  <p>{error}</p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Results Section */}
          {results && (
            <ClassificationResult results={results} />
          )}

          {/* Loading State */}
          {isClassifying && (
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <Progress
                    size="md"
                    isIndeterminate
                    color="primary"
                    className="mb-4"
                  />
                  <p className="text-gray-600">
                    Analyzing architectural features...
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with React, FastAPI, and Machine Learning</p>
        </div>
      </div>
    </div>
  )
}

export default App