import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle.jsx'
import BlogTitles from './pages/BlogTitles.jsx'
import GenerateImages from './pages/GenerateImages.jsx'
import RemoveBackground from './pages/RemoveBackground.jsx'
import Community from './pages/Community.jsx'
import ReviewResume from './pages/ReviewResume.jsx'
import RemoveObject from './pages/RemoveObject.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
        <Route index element={<Dashboard/>}/>
        <Route path="write-article" element={<WriteArticle />} />
        <Route path="blog-titles" element={<BlogTitles />} />
        <Route path="generate-images" element={<  GenerateImages />} />
        <Route path="remove-background" element={<RemoveBackground />} />
        <Route path="remove-object" element={<RemoveObject />} />
        <Route path="community" element={<Community />} />
        <Route path="review-resume" element={<ReviewResume />} />
        </Route>

        {/* <Route path="/community" element={<Community />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/review-resume" element={<ReviewResume />} />
        <Route path="/remove-object" element={<RemoveObject />} />   */}
      </Routes>
    </div>
  )
}

export default App