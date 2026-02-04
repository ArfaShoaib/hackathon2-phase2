import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showAction?: boolean;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  title = "No tasks yet",
  subtitle = "Create your first task to get started",
  showAction = true,
  actionText = "Create Task",
  onActionClick
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-12 text-center"
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(25,30,70,0.1)] flex items-center justify-center mb-6">
        <Layers className="h-8 w-8 text-[hsl(0,0%,72%)]" />
      </div>
      <h3 className="text-xl font-medium text-[hsl(0,0%,98.5%)] mb-2">{title}</h3>
      <p className="text-[hsl(0,0%,72%)] mb-6">{subtitle}</p>
      {showAction && (
        <Button
          onClick={onActionClick}
          className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}