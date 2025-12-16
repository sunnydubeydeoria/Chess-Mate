import React from 'react';
import { motion } from 'framer-motion';
import { Square } from 'chess.js';
import { getPieceComponent } from '@/lib/chessPieces';
import { cn } from '@/lib/utils';

interface ChessSquareProps {
  square: Square;
  piece: { type: string; color: 'w' | 'b' } | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: () => void;
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isLastMove,
  isCheck,
  onClick,
}) => {
  const getSquareClass = () => {
    if (isCheck) return 'chess-square-check';
    if (isSelected) return 'chess-square-selected';
    if (isLastMove) return 'chess-square-last-move';
    return isLight ? 'chess-square-light' : 'chess-square-dark';
  };

  return (
    <motion.div
      className={cn(
        'relative aspect-square cursor-pointer transition-colors duration-150',
        getSquareClass()
      )}
      onClick={onClick}
      whileHover={{ scale: piece || isLegalMove ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Legal move indicator */}
      {isLegalMove && !piece && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-1/3 h-1/3 rounded-full bg-board-highlight/50" />
        </motion.div>
      )}
      
      {/* Capture indicator */}
      {isLegalMove && piece && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 border-4 border-board-highlight/60 rounded-sm"
        />
      )}
      
      {/* Chess piece */}
      {piece && (
        <motion.div
          key={`${square}-${piece.type}-${piece.color}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute inset-1 flex items-center justify-center"
        >
          {getPieceComponent(piece.type, piece.color)}
        </motion.div>
      )}
      
      {/* Coordinate labels */}
      {square[1] === '1' && (
        <span className={cn(
          'absolute bottom-0.5 right-1 text-xs font-medium opacity-60',
          isLight ? 'text-board-dark' : 'text-board-light'
        )}>
          {square[0]}
        </span>
      )}
      {square[0] === 'a' && (
        <span className={cn(
          'absolute top-0.5 left-1 text-xs font-medium opacity-60',
          isLight ? 'text-board-dark' : 'text-board-light'
        )}>
          {square[1]}
        </span>
      )}
    </motion.div>
  );
};
