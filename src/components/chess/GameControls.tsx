import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Undo2, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  canUndo,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onNewGame}
          variant="default"
          className="gap-2 button-shadow"
        >
          <RefreshCw className="w-4 h-4" />
          New Game
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="secondary"
          className={cn('gap-2', !canUndo && 'opacity-50 cursor-not-allowed')}
        >
          <Undo2 className="w-4 h-4" />
          Undo
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onToggleSound}
          variant="outline"
          size="icon"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};
