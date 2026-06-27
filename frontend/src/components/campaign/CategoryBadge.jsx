import React from 'react';

const CATEGORY_STYLES = {
  MEDICAL: { label: 'Medical', class: 'bg-red-100 text-red-700' },
  EDUCATION: { label: 'Education', class: 'bg-blue-100 text-blue-700' },
  STARTUP: { label: 'Startup', class: 'bg-purple-100 text-purple-700' },
  DISASTER_RELIEF: { label: 'Disaster Relief', class: 'bg-orange-100 text-orange-700' },
  ANIMAL_WELFARE: { label: 'Animal Welfare', class: 'bg-green-100 text-green-700' },
  SOCIAL_CAUSE: { label: 'Social Cause', class: 'bg-pink-100 text-pink-700' },
};

const CategoryBadge = ({ category, size = 'sm' }) => {
  const style = CATEGORY_STYLES[category] || { label: category, class: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'} ${style.class}`}>
      {style.label}
    </span>
  );
};

export { CATEGORY_STYLES };
export default CategoryBadge;
