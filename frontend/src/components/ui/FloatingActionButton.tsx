'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  tooltip?: string;
}

export default function FloatingActionButton({
  onClick,
  icon,
  tooltip
}: FloatingActionButtonProps) {
  return (
    <motion.button
      className="glass-button fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] shadow-xl z-50"
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      aria-label={tooltip || "Floating action button"}
    >
      {icon || <Plus className="h-6 w-6 text-white" />}
    </motion.button>
  );
}