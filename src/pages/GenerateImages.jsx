import React from 'react';
import { ImagePlus, Sparkles } from 'lucide-react';

function GenerateImages() {
  const imageCategories = ['Nature', 'Technology', 'Food', 'People', 'Travel', 'Abstract', 'Animals'];

  const [selectedCategory, setSelectedCategory] = React.useState('Nature');
  const [input, setInput] = React.useState('');
  const [publish, setPublish] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Simulate generated image with a placeholder
    const placeholderImage = `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(input + ' - ' + selectedCategory)}`;
    setGeneratedImage(placeholderImage);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Image Generator Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">AI Image Generator</h1>
          </div>

          {/* Keyword Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Image Keyword</label>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              rows="4"
              placeholder="Describe what you want to see in the image..."
              value={input}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {imageCategories.map((cat, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Toggle for Public Image */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${publish ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    publish ? 'translate-x-5' : ''
                  }`}
                ></div>
              </div>
              <span className="text-gray-700 font-medium">Make the image public</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 cursor-pointer rounded shadow"
          >
            <ImagePlus className="w-4 h-4" />
            Generate Image
          </button>
        </form>
      </div>

      {/* ===== Generated Image Section ===== */}
      {generatedImage && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md border border-purple-200">
          <div className="flex items-center gap-2 mb-4 text-secondary">
            <ImagePlus className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Generated Image</h2>
          </div>
          <img
            src={generatedImage}
            alt="Generated"
            className="rounded-lg w-full object-cover shadow"
          />
          {publish && <p className="text-sm text-green-600 mt-2">This image will be public.</p>}
        </div>
      )}
    </div>
  );
}

export default GenerateImages;
