import React from 'react'

function BlogTitles() {
    const blogCategories = ['General', 'Technology', 'Health', 'Lifestyle', 'Travel', 'Education','Food'];
    const [selectedCategory, setSelectedCategory] = React.useState('General');
    const [input, setInput] = React.useState('');
    const [generatedArticle, setGeneratedArticle] = React.useState('');
  
    const onSubmitHandler = async (e) => {
      e.preventDefault();
      // Simulate article generation
      setGeneratedArticle(`📝 Article on "${input}"\n\nLorem ipsum content here... (${selectedLength} words approx.)`);
    };
  return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Configuration Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">AI title Generator</h1>
            <p>Keyword</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Article Topic</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="The future of artificial intelligence is..."
              value={input}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Article Length</label>
            <div className="flex flex-wrap gap-2">
              {articleLength.map((item, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedLength(item.length)}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition ${
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
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
          >
            <Edit className="w-4 h-4" />
            Generate Article
          </button>
        </form>
      </div>

      {/* ===== Generated Article Section ===== */}
      {generatedArticle && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md border border-purple-200">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <Edit className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Generated Article</h2>
          </div>
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">
            {generatedArticle}
          </p>
        </div>
      )}
    </div>
  )
}

export default BlogTitles