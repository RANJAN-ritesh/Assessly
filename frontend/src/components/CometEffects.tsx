import React from 'react';
import { motion } from 'framer-motion';

const CometEffects: React.FC = () => {
  const comets = [
    { delay: 0, duration: 6, startX: window.innerWidth, startY: 0, endX: 0, endY: window.innerHeight },
    { delay: 1, duration: 7, startX: window.innerWidth + 100, startY: -50, endX: 100, endY: window.innerHeight - 50 },
    { delay: 2, duration: 5, startX: window.innerWidth - 50, startY: 50, endX: -50, endY: window.innerHeight + 50 },
    { delay: 3, duration: 8, startX: window.innerWidth + 50, startY: -100, endX: 50, endY: window.innerHeight },
    { delay: 4, duration: 6.5, startX: window.innerWidth + 150, startY: 0, endX: 150, endY: window.innerHeight },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
      {comets.map((comet, index) => (
        <motion.div
          key={index}
          initial={{ 
            x: comet.startX,
            y: comet.startY,
            opacity: 0
          }}
          animate={{ 
            x: comet.endX,
            y: comet.endY,
            opacity: [0, 0.7, 0]
          }}
          transition={{
            x: {
              duration: comet.duration,
              repeat: Infinity,
              delay: comet.delay,
              ease: "linear"
            },
            y: {
              duration: comet.duration,
              repeat: Infinity,
              delay: comet.delay,
              ease: "linear"
            },
            opacity: {
              duration: comet.duration,
              repeat: Infinity,
              delay: comet.delay,
              times: [0, 0.2, 1],
              ease: "easeInOut"
            }
          }}
          style={{
            position: 'absolute',
            width: '1px',
            height: '80px',
            background: 'linear-gradient(to bottom, transparent, rgba(144, 202, 249, 0.8), rgba(206, 147, 216, 0.4), transparent)',
            transform: 'rotate(-45deg)',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 6px 1px rgba(144, 202, 249, 0.4)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, transparent, rgba(144, 202, 249, 0.3), transparent)',
              transform: 'rotate(45deg)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CometEffects; 