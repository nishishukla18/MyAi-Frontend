import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { AiToolsData } from '../data/AiToolsData';

function AiTools() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <section className="py-16 px-6 text-center" style={{ backgroundColor: '#f7e9e9' }}>
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful AI Tools</h2>
        <p className="text-lg text-gray-600">Everything you need to boost creativity and productivity with AI.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => user && navigate(tool.path)}
            className="tool-card cursor-pointer bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-all border border-gray-200"
          >
            <div className="mb-4 text-primary">
              <tool.Icon size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[#020024] mb-2">{tool.title}</h3>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = tool.path;
              }}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md text-sm transition"
            >
              {tool.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AiTools;
