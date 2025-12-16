import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceComponent } from '@/lib/chessPieces';

interface PromotionDialogProps {
  isOpen: boolean;
  color: 'w' | 'b';
  onSelect: (piece: string) => void;
  onClose: () => void;
}

const PROMOTION_PIECES = ['q', 'r', 'b', 'n'];

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  onSelect,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h3 className="font-serif text-xl font-semibold text-center mb-4 text-card-foreground">
                Promote Pawn
              </h3>
              <div className="flex gap-3">
                {PROMOTION_PIECES.map((piece) => (
                  <motion.button
                    key={piece}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(piece)}
                    className="w-16 h-16 rounded-lg bg-secondary hover:bg-accent transition-colors flex items-center justify-center"
                  >
                    {getPieceComponent(piece, color)}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
