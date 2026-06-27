import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ deadline }) => {
  const calculate = () => {
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      expired: false,
    };
  };

  const [time, setTime] = useState(calculate());

  useEffect(() => {
    const timer = setInterval(() => setTime(calculate()), 60000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (time.expired) {
    return <span className="text-red-500 font-semibold text-sm">Campaign Ended</span>;
  }

  return (
    <div className="flex gap-3">
      {[{ label: 'Days', val: time.days }, { label: 'Hrs', val: time.hours }, { label: 'Min', val: time.minutes }].map(({ label, val }) => (
        <div key={label} className="text-center">
          <div className="text-xl font-bold text-gray-900 leading-none">{val}</div>
          <div className="text-xs text-gray-400 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
