import React from 'react';

const STATUS_STYLES = {
  PENDING:       { label: 'Pending Review', class: 'bg-yellow-100 text-yellow-700' },
  APPROVED:      { label: 'Active', class: 'bg-green-100 text-green-700' },
  REJECTED:      { label: 'Rejected', class: 'bg-red-100 text-red-700' },
  COMPLETED:     { label: 'Completed', class: 'bg-indigo-100 text-indigo-700' },
  EXPIRED:       { label: 'Expired', class: 'bg-gray-100 text-gray-500' },
  PAUSED:        { label: 'Paused', class: 'bg-gray-100 text-gray-600' },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || { label: status, class: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.class}`}>
      {style.label}
    </span>
  );
};

export default StatusBadge;
