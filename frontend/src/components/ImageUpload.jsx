import { useState, useRef } from 'react'
import { Button, Image } from '@heroui/react'

function ImageUpload({ onImageSelect, selectedImage }) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB')
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onImageSelect(file)
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setPreviewUrl(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {!selectedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-6xl">🏛️</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Upload an architectural image
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <Button
                color="primary"
                variant="bordered"
                onClick={onButtonClick}
              >
                Choose Image
              </Button>
            </div>
            <div className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF, WebP (max 10MB)
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Selected architecture"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              <strong>File:</strong> {selectedImage.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button
                color="primary"
                variant="bordered"
                onClick={onButtonClick}
                size="sm"
              >
                Change Image
              </Button>
              <Button
                color="danger"
                variant="light"
                onClick={removeImage}
                size="sm"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload