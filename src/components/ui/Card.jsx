import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', onClick, hover = false }) => {
  const isClickable = !!onClick;
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover && isClickable ? { y: -4 } : {}}
      className={`bg-white rounded-3xl border border-gray-100/80 shadow-sm ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
