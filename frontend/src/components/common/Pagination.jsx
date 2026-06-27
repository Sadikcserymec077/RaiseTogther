import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={18} />
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === currentPage ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-gray-100 text-gray-700'}`}>
          {p + 1}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
