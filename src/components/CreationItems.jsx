import React from 'react';

function CreationItems({ item }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition mb-4 shadow"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{item.prompt}</h2>
          <p className="text-sm text-gray-500">{item.type} - {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded">{item.type}</button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          {item.type === 'image' ? (
            <img src={item.imageUrl} alt={item.prompt} className="w-full h-auto rounded-lg" />
          ) : (
            <div className="text-gray-700">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CreationItems;
