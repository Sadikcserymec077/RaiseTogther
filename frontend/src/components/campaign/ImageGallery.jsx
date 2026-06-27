import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ thumbnailImage, images = [], title }) => {
  const allImages = [thumbnailImage, ...images].filter(Boolean);
  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        <span className="text-6xl">🚀</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden h-80 bg-gray-100 mb-3">
        <img src={allImages[selected]} alt={title} className="w-full h-full object-cover" />
        {allImages.length > 1 && (
          <>
            <button onClick={() => setSelected(Math.max(0, selected - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setSelected(Math.min(allImages.length - 1, selected + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setSelected(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === selected ? 'bg-white w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selected ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
