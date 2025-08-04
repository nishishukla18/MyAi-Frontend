import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';


function RemoveBackground() {
  const [input, setInput] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!input) return;

    const fakeImageUrl = URL.createObjectURL(input);
    setProcessedImage(fakeImageUrl);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Background Removal Form ===== */}
      <div className="bg-white p-6 rounded-lg ">
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
              onChange={(e) => setInput(e.target.files[0])}
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
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded "
          >
            <Eraser className="w-4 h-4" />
            Remove Background
          </button>
        </form>
      </div>

      {/* ===== Processed Image Preview ===== */}
      <div className="mt-10 bg-white p-6 rounded-lg  border border-purple-200">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Eraser className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Processed Image</h2>
        </div>

        {processedImage ? (
          <img
            src={processedImage}
            alt="Processed"
            className="w-full h-auto rounded border border-gray-200"
          />
        ) : (
          <p className="text-gray-500">
            Upload an image and click <strong>"Remove Background"</strong> to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default RemoveBackground;
