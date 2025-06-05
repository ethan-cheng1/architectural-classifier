import { Card, CardHeader, CardBody, Progress, Chip } from '@heroui/react'

function ClassificationResult({ results }) {
  if (!results || !results.predictions) {
    return null
  }

  const { predictions, top_prediction, filename, image_size } = results

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.7) return 'success'
    if (confidence > 0.4) return 'warning'
    return 'default'
  }

  const formatConfidence = (confidence) => {
    return `${(confidence * 100).toFixed(1)}%`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Classification Results</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>📁 {filename}</span>
            <span>📐 {image_size.width} × {image_size.height}px</span>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-blue-800">
              Most Likely Style
            </h3>
            <Chip
              color={getConfidenceColor(top_prediction.confidence)}
              variant="flat"
              size="lg"
            >
              {formatConfidence(top_prediction.confidence)}
            </Chip>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {top_prediction.style}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">All Predictions</h3>
          <div className="space-y-3">
            {predictions.map((prediction, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index === 0
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </span>
                  <span className={`font-medium ${
                    index === 0 ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {prediction.style}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-32">
                    <Progress
                      value={prediction.confidence * 100}
                      color={getConfidenceColor(prediction.confidence)}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                  <Chip
                    color={getConfidenceColor(prediction.confidence)}
                    variant="flat"
                    size="sm"
                  >
                    {formatConfidence(prediction.confidence)}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            📝 <strong>Note:</strong> These are currently dummy predictions for testing. 
            The actual ML model will be integrated in the next phase.
          </p>
        </div>
      </CardBody>
    </Card>
  )
}

export default ClassificationResult