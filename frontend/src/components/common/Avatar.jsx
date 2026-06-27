import React, { useState } from 'react';

const Avatar = ({ name, url, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  const fullUrl = url && url.startsWith('/') 
    ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089/api/v1'}${url}`
    : url;

  if (fullUrl && !imageError) {
    return (
      <img
        src={fullUrl}
        alt={name || 'User avatar'}
        className={`rounded-full object-cover shadow-sm ${sizes[size]} ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shadow-sm ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
