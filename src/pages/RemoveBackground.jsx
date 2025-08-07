import { Eraser, Sparkles, Download, Upload, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function RemoveBackground() {
  const [input, setInput] = useState(null);
  const [originalImagePreview, setOriginalImagePreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file size (10MB limit)
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    // Validate file type
    if (file && !file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/i)) {
      toast.error('Only image files (JPG, PNG, GIF, WebP) are allowed');
      return;
    }
    
    setInput(file);
    setError('');
    
    // Create preview URL for the original image
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImagePreview(null);
    }
    
    // Reset processed image when new file is selected
    setProcessedImage(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input) {
      toast.error('Please select an image first');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', input);

      const token = await getToken();
      
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }

      console.log('Sending request to:', '/api/ai/remove-image-background');

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout
        }
      );

      if (data.success) {
        setProcessedImage(data.content);
        toast.success(data.message || 'Background removed successfully!');
        setError('');
      } else {
        const errorMsg = data.message || 'Failed to remove background';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error removing background:', error);
      
      let errorMessage = 'Error removing background';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.statusText;
        
        if (status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (status === 403) {
          errorMessage = serverMessage || 'This feature is only available for premium users.';
        } else if (status === 400) {
          errorMessage = serverMessage || 'Invalid request. Please check your image file.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = serverMessage || `Error: ${status}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = 'Request timeout. The image might be too large or server is busy.';
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInput(null);
    setOriginalImagePreview(null);
    setProcessedImage(null);
    setError('');
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Background Removal Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <h1 className="text-xl font-semibold">Background Removal</h1>
            </div>
            {(originalImagePreview || processedImage) && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Reset
              </button>
            )}
          </div>
          
          <p className="text-gray-600">Upload an image to automatically remove its background</p>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* File Input */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Image File</label>
            <div className="relative">
              <input
                onChange={handleFileChange}
                type="file"
                required
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPG, PNG, GIF, and WebP formats. Maximum file size: 10MB
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !input}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:cursor-not-allowed"
          >
            <Eraser className="w-4 h-4" />
            {loading ? 'Processing...' : 'Remove Background'}
          </button>
        </form>
      </div>

      {/* ===== Image Comparison Section ===== */}
      {(originalImagePreview || processedImage) && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-purple-600">
            <Eraser className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Results</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Image */}
            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Original Image
              </h3>
              {originalImagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <img
                    src={originalImagePreview}
                    alt="Original"
                    className="w-full h-auto rounded border border-gray-200 max-h-96 object-contain mx-auto shadow-sm"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <p className="text-gray-500">No image selected</p>
                </div>
              )}
            </div>

            {/* Processed Image */}
            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Background Removed
              </h3>
              {processedImage ? (
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-auto rounded border border-gray-200 max-h-96 object-contain mx-auto shadow-sm"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="text-gray-600">Processing image...</p>
                      <p className="text-sm text-gray-500">This may take a few moments</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Click <strong>"Remove Background"</strong> to process the image
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Download Button */}
          {processedImage && (
            <div className="mt-8 flex justify-center">
              <a
                href={processedImage}
                download="background-removed.png"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Result
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RemoveBackground;