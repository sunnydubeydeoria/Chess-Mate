import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '@/hooks/useChessGame';
import { getPieceComponent } from '@/lib/chessPieces';
import { cn } from '@/lib/utils';

interface GameInfoProps {
  gameState: GameState;
  playerNames: { white: string; black: string };
}

export const GameInfo: React.FC<GameInfoProps> = ({ gameState, playerNames }) => {
  const { turn, isCheck, isCheckmate, isStalemate, isDraw, capturedPieces } = gameState;

  const getStatusText = () => {
    if (isCheckmate) {
      return `Checkmate! ${turn === 'w' ? playerNames.black : playerNames.white} wins!`;
    }
    if (isStalemate) return 'Stalemate - Draw!';
    if (isDraw) return 'Draw!';
    if (isCheck) return 'Check!';
    return `${turn === 'w' ? playerNames.white : playerNames.black}'s turn`;
  };

  const renderCapturedPieces = (pieces: string[], color: 'w' | 'b') => {
    const pieceOrder = ['q', 'r', 'b', 'n', 'p'];
    const sorted = [...pieces].sort((a, b) => pieceOrder.indexOf(a) - pieceOrder.indexOf(b));
    
    return (
      <div className="flex flex-wrap gap-0.5">
        {sorted.map((piece, idx) => (
          <div key={idx} className="w-5 h-5 opacity-70">
            {getPieceComponent(piece, color)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl p-4 card-shadow">
      {/* Status */}
      <motion.div
        key={getStatusText()}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-center font-serif text-lg font-semibold mb-4 py-2 px-4 rounded-lg',
          isCheckmate && 'bg-accent text-accent-foreground',
          isCheck && !isCheckmate && 'bg-destructive/20 text-destructive',
          !isCheck && !isCheckmate && 'bg-secondary text-secondary-foreground'
        )}
      >
        {getStatusText()}
      </motion.div>

      {/* Players */}
      <div className="space-y-3">
        {/* Black player */}
        <div className={cn(
          'flex items-center justify-between p-3 rounded-lg transition-colors',
          turn === 'b' && !gameState.isGameOver ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-muted/50'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-bold">B</span>
            </div>
            <span className="font-medium text-foreground">{playerNames.black}</span>
          </div>
          <div className="min-h-[20px]">
            {renderCapturedPieces(capturedPieces.black, 'w')}
          </div>
        </div>

        {/* White player */}
        <div className={cn(
          'flex items-center justify-between p-3 rounded-lg transition-colors',
          turn === 'w' && !gameState.isGameOver ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-muted/50'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary border-2 border-foreground/20 flex items-center justify-center">
              <span className="text-secondary-foreground text-sm font-bold">W</span>
            </div>
            <span className="font-medium text-foreground">{playerNames.white}</span>
          </div>
          <div className="min-h-[20px]">
            {renderCapturedPieces(capturedPieces.white, 'b')}
          </div>
        </div>
      </div>
    </div>
  );
};
