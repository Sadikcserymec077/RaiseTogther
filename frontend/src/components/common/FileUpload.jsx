import React, { useCallback, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const FileUpload = ({ onFileSelect, accept = 'image/*', label = 'Upload Image', preview = null, multiple = false }) => {
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState(preview);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setLocalPreview(URL.createObjectURL(file));
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {localPreview && (
        <div className="relative mb-3 inline-block">
          <img src={localPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
          <button type="button" onClick={() => { setLocalPreview(null); onFileSelect(null); }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <X size={12} />
          </button>
        </div>
      )}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all ${dragOver ? 'border-primary bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-indigo-50 hover:border-primary'}`}>
        <Upload size={24} className="text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xs text-gray-400 mt-1">Drag & drop or click to browse</p>
        <input type="file" className="hidden" accept={accept} multiple={multiple} onChange={handleChange} />
      </label>
    </div>
  );
};

export default FileUpload;
