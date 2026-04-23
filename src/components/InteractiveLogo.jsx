import React from 'react';
import { motion } from 'framer-motion';

const InteractiveLogo = ({ size = 40 }) => {
  return (
    <motion.div 
      className="relative flex items-center justify-center cursor-pointer"
      whileHover={{ scale: 1.1 }}
    >
      {/* Heart Shape */}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#ef4444" // Red color
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Pulse Line */}
        <motion.path
          d="M2 12h3l2-5 3 10 2-5h3"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
};

export default InteractiveLogo;