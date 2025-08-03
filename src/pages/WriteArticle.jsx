import { Edit, Sparkles, Eye, Copy } from 'lucide-react';
import React from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function WriteArticle() {
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ];

  const [selectedLength, setSelectedLength] = React.useState(articleLength[0].length);
  const [input, setInput] = React.useState('');
  const [generatedArticle, setGeneratedArticle] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const { getToken } = useAuth();

  // Debug function to check state
  React.useEffect(() => {
    console.log('Generated Article State:', generatedArticle);
    console.log('Generated Article Length:', generatedArticle ? generatedArticle.length : 0);
  }, [generatedArticle]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      setGeneratedArticle(''); // Clear previous article
      
      console.log('Starting article generation...');
      
      const selectedLengthObj = articleLength.find(item => item.length === selectedLength);
      const prompt = `Write an article about ${input} with a length of ${selectedLengthObj.text}.`;
      
      console.log('Sending request with prompt:', prompt);
      
      const { data } = await axios.post('/api/ai/generate-article', {
        prompt, 
        length: selectedLength
      }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      console.log('API Response:', data);
      console.log('Full API Response Structure:', JSON.stringify(data, null, 2));

      if (data.success) {
        // Check multiple possible properties for the article content
        const articleContent = data.article || data.content || data.result || data.text || data.data;
        console.log('Article received:', articleContent);
        console.log('Article type:', typeof articleContent);
        
        if (articleContent && typeof articleContent === 'string') {
          setGeneratedArticle(articleContent);
          console.log('Article set successfully!');
        } else {
          console.error('Article content is not a valid string:', articleContent);
          setError('Invalid article content received from server');
        }
      } else {
        const errorMessage = data.message || 'Failed to generate article';
        setError(errorMessage);
        console.error('API Error:', errorMessage);
      }
    } catch (error) {
      console.error('Error generating article:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate article';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedArticle);
    alert('Article copied to clipboard!');
  };

  // Test function to set sample content
  const testWithSampleContent = () => {
    const sampleArticle = `# Sample Article About Finance

## Introduction

This is a sample article to test the display functionality. Financial planning is crucial for securing your future and achieving your goals.

## Key Points

- **Budgeting**: Create a monthly budget to track income and expenses
- **Saving**: Aim to save at least 20% of your income
- **Investing**: Diversify your portfolio for long-term growth

## Conclusion

By following these basic principles, you can build a strong financial foundation for your future.`;
    
    setGeneratedArticle(sampleArticle);
    console.log('Sample content set:', sampleArticle);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Configuration Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Article Configuration</h1>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Article Topic</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="The future of artificial intelligence is..."
              value={input}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Article Length</label>
            <div className="flex flex-wrap gap-2">
              {articleLength.map((item, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedLength(item.length)}
                  className={`px-3 py-2 rounded-full border cursor-pointer transition ${
                    selectedLength === item.length
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded shadow transition-colors"
          >
            <Edit className="w-4 h-4" />
            {loading ? 'Generating Article...' : 'Generate Article'}
          </button>

        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your article...</p>
        </div>
      )}

      {/* ALWAYS VISIBLE ARTICLE SECTION */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-purple-200">
          <div className="flex items-center gap-2 text-purple-600">
            <Eye className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Generated Article</h2>
          </div>
          {generatedArticle && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )}
        </div>

        {/* Content Display */}
        {generatedArticle ? (
          <div className="space-y-4">
            

            {/* Formatted content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-8 first:mt-0 border-b-2 border-purple-200 pb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-6 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-5 first:mt-0">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside my-4 space-y-2 text-gray-700 ml-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside my-4 space-y-2 text-gray-700 ml-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-800">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-600">{children}</em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-300 pl-4 py-2 my-4 italic text-gray-600 bg-purple-50 rounded-r">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {generatedArticle}
              </ReactMarkdown>
            </div>

            {/* Article Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
              <span>Word count: ~{generatedArticle ? generatedArticle.split(' ').length : 0} words</span>
              <span>Character count: {generatedArticle ? generatedArticle.length : 0} characters</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No Article Generated Yet</h3>
            <p className="text-gray-400">
              Fill in the topic above and click "Generate Article" to see your content here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WriteArticle;