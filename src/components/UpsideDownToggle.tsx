import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpsideDownToggleProps {
  onToggle: (isUpsideDown: boolean) => void;
  isUpsideDown: boolean;
}

export function UpsideDownToggle({ onToggle, isUpsideDown }: UpsideDownToggleProps) {
  return (
    <Button
      variant="terminal"
      size="sm"
      onClick={() => onToggle(!isUpsideDown)}
      className={`relative overflow-hidden ${isUpsideDown ? 'telekinesis-glow' : ''}`}
    >
      <motion.div
        animate={{ rotate: isUpsideDown ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Zap className="h-4 w-4 mr-2" />
      </motion.div>
      <span className="font-mono text-xs">
        {isUpsideDown ? 'EXIT_VOID' : 'FLIP'}
      </span>
    </Button>
  );
}