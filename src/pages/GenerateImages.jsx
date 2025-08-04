import React from 'react';
import { ImagePlus, Sparkles, Eye, Download, Share2, Heart, Copy } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function GenerateImages() {
  const imageCategories = ['Nature', 'Technology', 'Food', 'People', 'Travel', 'Abstract', 'Animals'];

  const [selectedCategory, setSelectedCategory] = React.useState('Nature');
  const [input, setInput] = React.useState('');
  const [publish, setPublish] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const { getToken } = useAuth();

  // Debug function to check state
  React.useEffect(() => {
    console.log('Generated Image State:', generatedImage);
    console.log('Has Image:', generatedImage ? 'Yes' : 'No');
  }, [generatedImage]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!input || input.trim().length === 0) {
      setError('Please enter an image description');
      toast.error('Please enter an image description');
      return;
    }

    if (input.trim().length < 3) {
      setError('Image description must be at least 3 characters long');
      toast.error('Image description must be at least 3 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(''); // Clear previous errors
      setGeneratedImage(''); // Clear previous image
      
      console.log('=== FRONTEND: Starting image generation ===');
      console.log('Input:', input);
      console.log('Category:', selectedCategory);
      console.log('Publish:', publish);
      
      const prompt = `Generate an image of ${input.trim()} in the category ${selectedCategory}.`;
      console.log('Final prompt:', prompt);

      // Get auth token
      const authToken = await getToken();
      console.log('Auth token obtained:', authToken ? 'Yes' : 'No');

      console.log('Sending request to backend...');
      const { data } = await axios.post('/api/ai/generate-image', { 
        prompt: prompt.trim(), 
        publish 
      }, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout
      });

      console.log('=== BACKEND RESPONSE ===');
      console.log('Full response:', data);
      console.log('Success:', data.success);
      console.log('Message:', data.message);

      if (data.success) {
        // Try multiple possible properties for the image URL
        const imageUrl = data.image || data.imageUrl || data.url || data.content || data.data?.imageUrl;
        
        console.log('Extracted image URL:', imageUrl);
        console.log('Image URL type:', typeof imageUrl);
        console.log('Image URL length:', imageUrl ? imageUrl.length : 0);
        
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
          // Validate that it's a proper URL
          try {
            new URL(imageUrl);
            setGeneratedImage(imageUrl.trim());
            console.log('✅ Image URL set successfully:', imageUrl);
            toast.success('Image generated successfully!');
          } catch (urlError) {
            console.error('❌ Invalid URL format:', imageUrl);
            throw new Error('Invalid image URL format received from server');
          }
        } else {
          console.error('❌ No valid image URL found in response');
          console.error('Available properties:', Object.keys(data));
          throw new Error('No valid image URL received from server');
        }
      } else {
        const errorMessage = data.message || data.error || 'Failed to generate image';
        console.error('❌ Backend returned error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('=== FRONTEND ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to generate image';
      
      if (error.response) {
        // Server responded with error
        const serverError = error.response.data;
        errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
        
        if (error.response.status === 403) {
          errorMessage = 'This feature is only available for premium users. Please upgrade your plan.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.response.status === 408) {
          errorMessage = 'Request timed out. Please try again with a simpler description.';
        }
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== REQUEST COMPLETED ===');
    }
  };

  // Test function to set sample content for debugging
  const testWithSampleImage = () => {
    const sampleImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    setGeneratedImage(sampleImage);
    setInput('Sample mountain landscape');
    console.log('✅ Sample image loaded for testing');
    toast.success('Sample image loaded for testing!');
  };

  const downloadImage = async () => {
    if (!generatedImage) {
      toast.error('No image to download');
      return;
    }

    try {
      console.log('Downloading image:', generatedImage);
      const response = await fetch(generatedImage);
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image. Please try right-clicking and saving the image.');
    }
  };

  const shareImage = async () => {
    if (!generatedImage) {
      toast.error('No image to share');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this AI-generated image!',
          text: `AI-generated image: ${input}`,
          url: generatedImage
        });
        toast.success('Image shared successfully!');
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(generatedImage);
        toast.success('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(generatedImage);
        toast.success('Image URL copied to clipboard!');
      } catch (copyError) {
        toast.error('Failed to share image');
      }
    }
  };

  const copyImageUrl = async () => {
    if (!generatedImage) {
      toast.error('No image URL to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedImage);
      toast.success('Image URL copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy image URL');
    }
  };

  const clearGeneration = () => {
    setGeneratedImage('');
    setError('');
    setInput('');
    setSelectedCategory('Nature');
    setPublish(false);
    toast.success('Cleared for new generation');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Image Generator Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <h1 className="text-xl font-semibold">AI Image Generator</h1>
            </div>
            
            {/* Debug button - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={testWithSampleImage}
                className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
              >
                Load Sample
              </button>
            )}
          </div>

          {/* Keyword Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Image Description *
            </label>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              rows="4"
              placeholder="Describe what you want to see in the image... Be specific for better results!"
              value={input}
              required
              minLength="3"
              maxLength="500"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="text-sm text-gray-500 mt-1">
              <div>Examples: "A serene mountain landscape at sunset", "A futuristic city skyline with flying cars"</div>
              <div className="mt-1">Characters: {input.length}/500</div>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {imageCategories.map((cat, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-full border cursor-pointer transition ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Toggle for Public Image */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${publish ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    publish ? 'translate-x-6' : ''
                  }`}
                ></div>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Make image public</span>
                <div className="text-sm text-gray-500">Allow others to see and use this image</div>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !input.trim() || input.trim().length < 3}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded shadow transition-colors"
            >
              <ImagePlus className="w-4 h-4" />
              {loading ? 'Generating Image...' : 'Generate Image'}
            </button>

            {(generatedImage || error) && (
              <button
                type="button"
                onClick={clearGeneration}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded shadow transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-start gap-2">
              <strong className="flex-shrink-0">Error:</strong>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200 text-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your masterpiece...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
          <div className="mt-4 text-xs text-gray-400">
            Please don't refresh the page
          </div>
        </div>
      )}

      {/* ALWAYS VISIBLE IMAGE SECTION */}
      <div className="bg-white rounded-lg shadow-md border border-purple-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-3 border-b border-purple-200">
          <div className="flex items-center gap-2 text-purple-600">
            <Eye className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Generated Image</h2>
          </div>
          {generatedImage && (
            <div className="flex gap-2">
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                title="Download image"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={shareImage}
                className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                title="Share image"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={copyImageUrl}
                className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                title="Copy image URL"
              >
                <Copy className="w-4 h-4" />
                Copy URL
              </button>
            </div>
          )}
        </div>

        {/* Content Display */}
        {generatedImage ? (
          <div className="p-6 space-y-6">
            {/* Main Image Display */}
            <div className="relative group">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={generatedImage}
                  alt="AI Generated Image"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error('❌ Image failed to load:', generatedImage);
                    console.error('Image element:', e.target);
                    setError('Failed to load generated image. The image URL may be invalid or expired.');
                    toast.error('Failed to load image');
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded successfully:', generatedImage);
                  }}
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-3">
                  <button
                    onClick={downloadImage}
                    className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    title="Download image"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareImage}
                    className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    title="Share image"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      // Add to favorites functionality
                      toast.success('Added to favorites!');
                    }}
                    className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    title="Add to favorites"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Details */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Description</div>
                  <div className="font-medium text-gray-800 break-words">{input}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="font-medium text-purple-600">{selectedCategory}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Visibility</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${publish ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="font-medium text-gray-800">{publish ? 'Public' : 'Private'}</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Generated</div>
                  <div className="font-medium text-gray-800">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Image URL Display for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Debug - Image URL:</div>
                <div className="text-xs text-gray-500 break-all font-mono bg-white p-2 rounded">
                  {generatedImage}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download HD
                </button>
                <button
                  onClick={clearGeneration}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ImagePlus className="w-4 h-4" />
                  Generate New
                </button>
                <button
                  onClick={() => {
                    const tweetText = `Check out this amazing AI-generated image! Created with: "${input}" #AIart #GenerativeAI`;
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(generatedImage)}`;
                    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share on Twitter
                </button>
                <button
                  onClick={copyImageUrl}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            {/* Empty State Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mx-auto flex items-center justify-center">
                <ImagePlus className="w-16 h-16 text-purple-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Create Visual Magic?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Describe your vision and watch our AI bring it to life. From realistic photos to artistic masterpieces, the possibilities are endless.
            </p>
            
            {/* Quick start suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div 
                className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => setInput('A majestic mountain landscape at golden hour with snow-capped peaks')}
              >
                <div className="text-sm font-medium text-gray-800">Nature Scene</div>
                <div className="text-xs text-gray-500 mt-1">Mountain landscape</div>
              </div>
              <div 
                className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => setInput('A futuristic cityscape with flying cars and neon lights at night')}
              >
                <div className="text-sm font-medium text-gray-800">Sci-Fi City</div>
                <div className="text-xs text-gray-500 mt-1">Futuristic cityscape</div>
              </div>
              <div 
                className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => setInput('A cute golden retriever puppy playing in a field of flowers')}
              >
                <div className="text-sm font-medium text-gray-800">Cute Animal</div>
                <div className="text-xs text-gray-500 mt-1">Adorable puppy</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateImages;