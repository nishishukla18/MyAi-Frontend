import React, { useState } from 'react';
import { FileText, Search } from 'lucide-react';

function ReviewResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!resumeFile) return;

    // Placeholder: Simulate AI analysis
    console.log('Reviewing resume:', resumeFile.name);
    setAnalysisResult(
      `Analysis of ${resumeFile.name}: Strong experience in frontend development. Recommended to highlight soft skills and quantify achievements.`
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Resume Review Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Search className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Resume Review</h1>
          </div>
          <p className="text-gray-600">
            Upload your resume to receive feedback and improvement suggestions.
          </p>

          {/* File Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Resume File</label>
            <input
              onChange={(e) => setResumeFile(e.target.files[0])}
              type="file"
              required
              accept=".pdf,.doc,.docx"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
          >
            <Search className="w-4 h-4" />
            Analyze Resume
          </button>
        </form>
      </div>

      {/* ===== Analysis Result ===== */}
      {analysisResult && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md border border-purple-200">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Resume Feedback</h2>
          </div>
          <p className="text-gray-800">{analysisResult}</p>
        </div>
      )}
    </div>
  );
}

export default ReviewResume;
