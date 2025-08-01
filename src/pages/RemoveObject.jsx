import React, { useState } from 'react';
import { Eraser, Scissors, Sparkles } from 'lucide-react';

function RemoveObject() {
  const [input, setInput] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!input) return;

    // Placeholder for object removal processing logic
    console.log('Image submitted for object removal:', input);

    // Fake preview using uploaded image
    const fakeImageUrl = URL.createObjectURL(input);
    setProcessedImage(fakeImageUrl);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ===== Object Removal Form ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Object Removal</h1>
          </div>
          <p className="text-gray-600">Upload an image and we'll remove unwanted objects from it.</p>

          {/* File Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Image File</label>
            <input
              onChange={(e) => setInput(e.target.files[0])}
              type="file"
              required
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <p className="text-sm text-gray-500">Supported formats: JPG, PNG, and others.</p>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
          >
            <Scissors className="w-4 h-4" />
            Remove Object
          </button>
        </form>
      </div>

      {/* ===== Processed Image Preview ===== */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md border border-purple-200">
        <div className="flex items-center gap-2 mb-4 text-purple-600">
          <Scissors className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Processed Image</h2>
        </div>

        {processedImage ? (
          <img
            src={processedImage}
            alt="Processed with object removed"
            className="w-full h-auto rounded border border-gray-200"
          />
        ) : (
          <p className="text-gray-500">
            Upload an image and click <strong>"Remove Object"</strong> to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default RemoveObject;
