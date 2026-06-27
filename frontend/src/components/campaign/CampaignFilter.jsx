import React from 'react';
import { CATEGORY_STYLES } from './CategoryBadge';
import { SlidersHorizontal, X } from 'lucide-react';

const categories = ['ALL', 'MEDICAL', 'EDUCATION', 'STARTUP', 'DISASTER_RELIEF', 'ANIMAL_WELFARE', 'SOCIAL_CAUSE'];
const sortOptions = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'raisedAmount,desc', label: 'Most Funded' },
  { value: 'donorCount,desc', label: 'Most Popular' },
  { value: 'deadline,asc', label: 'Ending Soon' },
];

const CampaignFilter = ({ filters, onChange }) => {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="space-y-6">
      <div className="flex items-center gap-2 font-semibold text-gray-800">
        <SlidersHorizontal size={18} /> Filters
        <button className="ml-auto text-xs text-primary hover:underline"
          onClick={() => onChange({ category: 'ALL', sort: 'createdAt,desc', location: '', minGoal: '', maxGoal: '' })}>
          Reset
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Category</p>
        <div className="space-y-1.5">
          {categories.map(cat => {
            const style = CATEGORY_STYLES[cat];
            return (
              <button key={cat} onClick={() => update('category', cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                {cat === 'ALL' ? 'All Categories' : style?.label || cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Sort By</p>
        <select value={filters.sort} onChange={e => update('sort', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Location */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Location</p>
        <input type="text" placeholder="e.g. Mumbai" value={filters.location}
          onChange={e => update('location', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      {/* Goal Range */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Goal Amount (₹)</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minGoal}
            onChange={e => update('minGoal', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <input type="number" placeholder="Max" value={filters.maxGoal}
            onChange={e => update('maxGoal', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
    </aside>
  );
};

export default CampaignFilter;
