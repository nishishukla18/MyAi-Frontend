import React from 'react';
import { Edit, Sparkles, Eye, Copy, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';


function BlogTitles() {
  const blogCategories = ['General', 'Technology', 'Health', 'Lifestyle', 'Travel', 'Education', 'Food'];
  const [selectedCategory, setSelectedCategory] = React.useState('General');
  const [input, setInput] = React.useState('');
  const [generatedTitle, setGeneratedTitle] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setGeneratedTitle('');

      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}.`;

      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      const titleContent = data.title || data.content || data.result || data.text || data.data;

      if (data.success && typeof titleContent === 'string') {
        setGeneratedTitle(titleContent);
        toast.success('Blog title generated successfully!');
      } else {
        throw new Error('Invalid title content received');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const testWithSampleTitle = () => {
    const sampleTitles = [
      `🔥 "${input || 'AI Tech'}" - Insights in ${selectedCategory}`,
      `💡 Guide to ${input || 'Innovation'} in ${selectedCategory}`,
      `🚀 How ${input || 'Solutions'} Are Transforming ${selectedCategory}`,
      `⭐ ${input || 'Strategies'}: ${selectedCategory} Handbook`
    ];
    const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    setGeneratedTitle(randomTitle);
    toast.success('Sample title generated!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTitle);
    toast.success('Title copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">AI Blog Title Generator</h1>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Keyword</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="e.g. Artificial Intelligence, Mindfulness..."
              value={input}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((cat, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-full border cursor-pointer ${
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded shadow"
            >
              <Edit className="w-4 h-4" />
              {loading ? 'Generating...' : 'Generate Title'}
            </button>

            <button
              type="button"
              onClick={testWithSampleTitle}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow"
            >
              <Lightbulb className="w-4 h-4" />
              Test Sample Title
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Output */}
      {generatedTitle && (
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Generated Blog Title
            </h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{generatedTitle}</h3>
        </div>
      )}

      {!generatedTitle && !loading && (
        <div className="text-center py-16 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          Enter a keyword and select a category to generate your title.
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-2"></div>
          Generating your blog title...
        </div>
      )}
    </div>
  );
}

export default BlogTitles;
