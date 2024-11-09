import confetti from 'canvas-confetti';
import React, { useEffect, useRef } from 'react';

type Props = {
  showConfetti: boolean;
};

export const Confetti: React.FC<Props> = ({ showConfetti }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (showConfetti && canvasRef.current) {
      const _confetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });

      _confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
      });
    }
  }, [showConfetti]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    />
  );
};
