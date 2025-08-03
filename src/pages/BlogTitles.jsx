import React from 'react';
import { Edit, Sparkles } from 'lucide-react';

function BlogTitles() {
  const blogCategories = ['General', 'Technology', 'Health', 'Lifestyle', 'Travel', 'Education', 'Food'];

  const [selectedCategory, setSelectedCategory] = React.useState('General');
  const [input, setInput] = React.useState('');
  const [generatedTitle, setGeneratedTitle] = React.useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Simulate blog title generation
    const dummyTitle = `🔥 "${input}" - A Deep Dive into ${selectedCategory}`;
    setGeneratedTitle(dummyTitle);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Blog Title Generator Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">AI Blog Title Generator</h1>
          </div>

          {/* Keyword Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Keyword</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="e.g. Artificial Intelligence, Mindfulness..."
              value={input}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((cat, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded shadow"
          >
            <Edit className="w-4 h-4" />
            Generate Title
          </button>
        </form>
      </div>

      {/* ===== Generated Title Section ===== */}
      {generatedTitle && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md border border-purple-200">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Edit className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Generated Blog Title</h2>
          </div>
          <p className="text-gray-800 text-xl font-medium">{generatedTitle}</p>
        </div>
      )}
    </div>
  );
}

export default BlogTitles;
