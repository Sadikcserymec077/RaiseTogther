import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const ConfettiWrapper = ({ trigger = true }) => {
  const fired = useRef(false);

  useEffect(() => {
    if (trigger && !fired.current) {
      fired.current = true;
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [trigger]);

  return null; // Renders nothing — just triggers the animation
};

export default ConfettiWrapper;
