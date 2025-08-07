import React, { useState } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle, Copy, RotateCcw, Loader2, Star } from 'lucide-react';

function ReviewResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock functions - replace with your actual implementations
  const useAuth = () => ({
    getToken: () => Promise.resolve('mock-token')
  });
  
  const toast = {
    success: (message) => console.log('Success:', message),
    error: (message) => console.log('Error:', message)
  };

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Reset previous results
    setAnalysisResult('');
    setError('');
    setUploadProgress(0);
    
    if (!file) {
      setResumeFile(null);
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported. Please convert your resume to PDF format.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please choose a smaller file.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }

    setResumeFile(file);
    toast.success(`Resume selected: ${file.name}`);
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      toast.error('Please select a resume file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setUploadProgress(0);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('resume', resumeFile);

      // Get authentication token
      const token = await getToken();

      console.log('Sending resume for analysis...');

      // Mock API call - replace with your actual axios implementation
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Mock response after 2 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Mock response with asterisks formatting (replace this with your actual API response)
        const mockResponse = {
          success: true,
          content: `**COMPREHENSIVE RESUME ANALYSIS REPORT**

**EXECUTIVE SUMMARY**
Your resume demonstrates **solid professional experience** and relevant skills, but there are several areas where strategic improvements could significantly enhance your marketability and interview potential.

**1. OVERALL ASSESSMENT**
Your resume shows **strong potential** but needs refinement in presentation and content optimization. The document contains valuable experience but lacks the impact needed to stand out in today's competitive job market.

**Score: 7.2/10**

**2. CONTENT ANALYSIS**

**A. Professional Summary**
• Current summary is **too generic** and lacks quantifiable impact
• Missing **key value propositions** that differentiate you from other candidates  
• Recommendations: Include specific achievements, metrics, and unique skills
• Consider adding **2-3 quantifiable accomplishments** in the summary

**B. Work Experience Section**
• **Strengths**: Clear job progression and relevant industry experience
• **Weaknesses**: Descriptions are task-focused rather than achievement-focused
• Missing **quantifiable results** and business impact metrics
• Action verbs could be more **dynamic and varied**

**C. Skills and Competencies**
• Technical skills are **well-organized** and relevant
• Consider grouping skills by **proficiency level** (Expert, Intermediate, Basic)
• Remove **outdated technologies** that may date your resume
• Add **emerging technologies** relevant to your field

**3. FORMATTING AND DESIGN**

**Current Issues:**
• Inconsistent bullet point formatting
• **Poor visual hierarchy** - difficult to scan quickly
• **Excessive text density** in some sections
• Missing **strategic use of white space**

**Recommendations:**
• Implement **consistent formatting** throughout
• Use **bold text strategically** for key achievements
• Improve **section spacing** for better readability
• Consider a more **modern, ATS-friendly template**

**4. KEYWORD OPTIMIZATION**
• **Missing industry-specific keywords** that ATS systems scan for
• Research job postings in your target role for **relevant terminology**
• Incorporate **technical competencies** more naturally into descriptions
• Add **soft skills** that are valued in your industry

**5. SPECIFIC IMPROVEMENT RECOMMENDATIONS**

**Immediate Actions:**
• Quantify **at least 70%** of your achievements with numbers, percentages, or dollar amounts
• Replace **passive language** with strong action verbs
• Add **2-3 key accomplishments** to each role
• **Proofread carefully** - found minor formatting inconsistencies

**Medium-term Improvements:**
• Consider **professional resume design** update
• Add **relevant certifications** or ongoing education
• Include **volunteer work** or side projects if relevant
• **Optimize LinkedIn profile** to match resume keywords

**6. INDUSTRY-SPECIFIC FEEDBACK**
Based on your field, consider emphasizing:
• **Leadership experience** and team management capabilities
• **Process improvement** initiatives and results
• **Technology adoption** and digital transformation experience
• **Cross-functional collaboration** and stakeholder management

**FINAL RECOMMENDATIONS**
With targeted improvements, your resume has **excellent potential** to generate significantly more interview opportunities. Focus on quantifying achievements and improving visual presentation for maximum impact.

**Next Steps:**
1. **Revise** work experience bullets to include metrics
2. **Update** formatting for consistency and visual appeal  
3. **Research** and incorporate relevant industry keywords
4. **Review** and edit for grammar and clarity
5. **Test** with ATS-friendly format checkers`
        };

        if (mockResponse.success) {
          setAnalysisResult(mockResponse.content);
          toast.success('Resume analyzed successfully!');
        } else {
          throw new Error('Failed to analyze resume');
        }
        
        setLoading(false);
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Error analyzing resume:', error);
      let errorMessage = 'Error analyzing resume';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again with a smaller file.';
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large. Please use a file smaller than 5MB.';
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || 'Usage limit exceeded. Please upgrade to premium.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(analysisResult);
      toast.success('Analysis copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const resetForm = () => {
    setAnalysisResult('');
    setResumeFile(null);
    setError('');
    setUploadProgress(0);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // Function to parse and format the analysis result
  const formatAnalysisResult = (text) => {
    const lines = text.split('\n');
    const elements = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (trimmedLine === '') {
        elements.push(<div key={index} className="h-4"></div>);
        return;
      }
      
      // Check for main headings (surrounded by ** or starting with **)
      if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
        const heading = trimmedLine.replace(/\*\*/g, '');
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-blue-700 mt-8 mb-4 first:mt-0 border-b-2 border-blue-200 pb-2">
            {heading}
          </h2>
        );
        return;
      }
      
      // Check for numbered sections (1., 2., etc.)
      if (trimmedLine.match(/^\d+\.\s+/)) {
        const heading = trimmedLine.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '');
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-blue-600 mt-6 mb-3 first:mt-0">
            {heading}
          </h3>
        );
        return;
      }
      
      // Check for sub-headings (letters A., B., etc.)
      if (trimmedLine.match(/^[A-Z]\.\s+/)) {
        const heading = trimmedLine.replace(/^[A-Z]\.\s+/, '').replace(/\*\*/g, '');
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-purple-600 mt-5 mb-3">
            {heading}
          </h4>
        );
        return;
      }
      
      // Check for bullet points
      if (trimmedLine.startsWith('•')) {
        const content = trimmedLine.replace(/^•\s*/, '');
        const formattedContent = formatInlineText(content);
        elements.push(
          <div key={index} className="flex items-start mb-2 ml-4">
            <span className="text-blue-500 mr-3 mt-1 text-lg font-bold">•</span>
            <div className="text-gray-700 leading-relaxed">{formattedContent}</div>
          </div>
        );
        return;
      }
      
      // Regular paragraphs
      const formattedContent = formatInlineText(trimmedLine);
      elements.push(
        <p key={index} className="mb-3 text-gray-700 leading-relaxed">
          {formattedContent}
        </p>
      );
    });
    
    return elements;
  };

  // Function to format inline text (handle bold text within paragraphs)
  const formatInlineText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.replace(/\*\*/g, '');
        return (
          <span key={index} className="font-semibold text-gray-900">
            {boldText}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Resume Review
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get professional feedback on your resume with AI-powered analysis. Improve your chances of landing interviews.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-gray-700 mb-3 font-semibold text-lg">
              Upload Your Resume
            </label>
            <div className="relative">
              <input
                onChange={handleFileChange}
                type="file"
                accept=".pdf"
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
              <Upload className="absolute right-4 top-4 w-6 h-6 text-gray-400" />
            </div>
            
            {resumeFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700 font-medium">
                    Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-2">Requirements:</p>
              <ul className="space-y-1">
                <li>• PDF format only</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Text-based resume (not image-only)</li>
                <li>• Clear, readable content</li>
              </ul>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !resumeFile}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg shadow-lg transition-all duration-200 font-semibold text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Star className="w-5 h-5" />
                Analyze My Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <p className="text-gray-700 text-lg font-medium">
                {uploadProgress < 100 ? 'Uploading resume...' : 'AI is analyzing your resume...'}
              </p>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full max-w-md">
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">{uploadProgress}% uploaded</p>
              </div>
            )}
            
            <div className="text-center text-gray-600">
              <p className="text-sm">This may take up to 2 minutes...</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && !loading && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Resume Analysis Complete</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                title="Copy analysis to clipboard"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                title="Analyze another resume"
              >
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </button>
            </div>
          </div>
          
          {/* Enhanced Formatted Analysis Result */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-100">
            <div className="prose max-w-none">
              {formatAnalysisResult(analysisResult)}
            </div>
          </div>

          {/* Success message */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="text-green-700">
                <p className="font-semibold">Analysis Complete!</p>
                <p className="text-sm">Use this feedback to improve your resume and increase your interview opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewResume;