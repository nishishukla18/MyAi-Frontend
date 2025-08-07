// src/data/AiToolsData.js
import { House, Pen, Hash, Image, Search, FileText, Users ,Eraser} from 'lucide-react';

export const AiToolsData = [
  {
    title: 'Write Article',
    description: 'Use AI to generate articles instantly with just a few prompts.',
    buttonText: 'Write Now',
    path: '/ai/write-article',
    Icon: Pen,
  },
  {
    title: 'Blog Titles',
    description: 'Get engaging blog titles using AI suggestions.',
    buttonText: 'Generate Titles',
    path: '/ai/blog-titles',
    Icon: Hash,
  },
  {
    title: 'Generate Images',
    description: 'Create stunning images using text prompts.',
    buttonText: 'Generate',
    path: '/ai/generate-images',
    Icon: Image,
  },
  {
    title: 'Remove Background',
    description: 'Upload images and remove backgrounds automatically.',
    buttonText: 'Upload Image',
    path: '/ai/remove-background',
    Icon: Eraser,
  },
  {
    title: 'Review Resume',
    description: 'Let AI review and improve your resume for better chances.',
    buttonText: 'Upload Resume',
    path: '/ai/review-resume',
    Icon: FileText,
  }
];
