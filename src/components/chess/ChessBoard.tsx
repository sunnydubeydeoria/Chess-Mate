import React, { useCallback, useState } from 'react';
import { Square } from 'chess.js';
import { ChessSquare } from './ChessSquare';
import { PromotionDialog } from './PromotionDialog';
import { UseChessGameReturn } from '@/hooks/useChessGame';
import { useChessSounds } from '@/hooks/useChessSounds';

interface ChessBoardProps {
  gameHook: UseChessGameReturn;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const ChessBoard: React.FC<ChessBoardProps> = ({ gameHook }) => {
  const {
    gameState,
    selectedSquare,
    legalMoves,
    selectSquare,
    makeMove,
    getPieceAt,
  } = gameHook;

  const { playMoveSound, playCaptureSound, playCheckSound, playIllegalMoveSound } = useChessSounds();
  const [promotionMove, setPromotionMove] = useState<{ from: Square; to: Square } | null>(null);

  const isLightSquare = (file: string, rank: string): boolean => {
    const fileIndex = FILES.indexOf(file);
    const rankIndex = parseInt(rank);
    return (fileIndex + rankIndex) % 2 === 1;
  };

  const handleSquareClick = useCallback((square: Square) => {
    const piece = getPieceAt(square);
    
    // If we have a selected piece and this is a legal move
    if (selectedSquare && legalMoves.includes(square)) {
      const movingPiece = getPieceAt(selectedSquare);
      
      // Check for pawn promotion
      if (movingPiece?.type === 'p') {
        const isPromotionRank = 
          (movingPiece.color === 'w' && square[1] === '8') ||
          (movingPiece.color === 'b' && square[1] === '1');
        
        if (isPromotionRank) {
          setPromotionMove({ from: selectedSquare, to: square });
          return;
        }
      }
      
      const targetPiece = getPieceAt(square);
      const success = makeMove(selectedSquare, square);
      
      if (success) {
        if (targetPiece) {
          playCaptureSound();
        } else {
          playMoveSound();
        }
        
        // Check if the move resulted in check
        setTimeout(() => {
          if (gameHook.gameState.isCheck) {
            playCheckSound();
          }
        }, 100);
      }
      return;
    }
    
    // Otherwise, try to select the square
    const selected = selectSquare(square);
    if (!selected && piece && piece.color !== gameState.turn) {
      playIllegalMoveSound();
    }
  }, [
    selectedSquare,
    legalMoves,
    getPieceAt,
    selectSquare,
    makeMove,
    gameState.turn,
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playIllegalMoveSound,
    gameHook.gameState.isCheck,
  ]);

  const handlePromotion = (piece: string) => {
    if (promotionMove) {
      const targetPiece = getPieceAt(promotionMove.to);
      makeMove(promotionMove.from, promotionMove.to, piece);
      if (targetPiece) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
      setPromotionMove(null);
    }
  };

  const getKingSquare = (): Square | null => {
    for (const file of FILES) {
      for (const rank of RANKS) {
        const square = `${file}${rank}` as Square;
        const piece = getPieceAt(square);
        if (piece?.type === 'k' && piece.color === gameState.turn) {
          return square;
        }
      }
    }
    return null;
  };

  const kingSquare = gameState.isCheck ? getKingSquare() : null;

  return (
    <>
      <div className="relative board-shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 w-full max-w-[600px] aspect-square">
          {RANKS.map((rank) =>
            FILES.map((file) => {
              const square = `${file}${rank}` as Square;
              const piece = getPieceAt(square);
              const isLight = isLightSquare(file, rank);
              const isSelected = selectedSquare === square;
              const isLegalMove = legalMoves.includes(square);
              const isLastMove = gameState.lastMove?.from === square || gameState.lastMove?.to === square;
              const isCheck = kingSquare === square;

              return (
                <ChessSquare
                  key={square}
                  square={square}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  isLegalMove={isLegalMove}
                  isLastMove={isLastMove}
                  isCheck={isCheck}
                  onClick={() => handleSquareClick(square)}
                />
              );
            })
          )}
        </div>
      </div>

      <PromotionDialog
        isOpen={promotionMove !== null}
        color={gameState.turn}
        onSelect={handlePromotion}
        onClose={() => setPromotionMove(null)}
      />
    </>
  );
};
