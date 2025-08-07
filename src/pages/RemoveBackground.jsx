import { Eraser, Sparkles } from 'lucide-react';
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
    setInput(file);
    
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
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', input);

      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        setProcessedImage(data.content);
        setError('');
      } else {
        toast.error(data.message || 'Failed to remove background');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing background');
      setError('Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Background Removal Form ===== */}
      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Background Removal</h1>
          </div>
          <p className="text-gray-600">Upload image</p>

          {/* File Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Image File</label>
            <input
              onChange={handleFileChange}
              type="file"
              required
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-sm text-gray-500">Supports JPG, PNG, and other image formats.</p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !input}
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eraser className="w-4 h-4" />
            {loading ? 'Processing...' : 'Remove Background'}
          </button>
        </form>
      </div>

      {/* ===== Image Comparison Section ===== */}
      {(originalImagePreview || processedImage) && (
        <div className="mt-10 bg-white p-6 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Eraser className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Image Comparison</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    className="w-full h-auto rounded border border-gray-200 max-h-96 object-contain mx-auto"
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
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-auto rounded border border-gray-200 max-h-96 object-contain mx-auto"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  {loading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-gray-500">Processing image...</p>
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
            <div className="mt-6 flex justify-center">
              <a
                href={processedImage}
                download="background-removed.png"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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