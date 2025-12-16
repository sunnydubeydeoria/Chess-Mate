import { useState, useCallback, useEffect } from 'react';
import { Chess, Move, Square } from 'chess.js';

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: Move[];
  capturedPieces: {
    white: string[];
    black: string[];
  };
  lastMove: { from: Square; to: Square } | null;
}

export interface UseChessGameReturn {
  game: Chess;
  gameState: GameState;
  selectedSquare: Square | null;
  legalMoves: Square[];
  selectSquare: (square: Square) => boolean;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  newGame: () => void;
  undoMove: () => void;
  canUndo: boolean;
  getPieceAt: (square: Square) => { type: string; color: 'w' | 'b' } | null;
}

export const useChessGame = (): UseChessGameReturn => {
  const [game] = useState(() => new Chess());
  const [gameState, setGameState] = useState<GameState>(() => getGameState(game));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  function getGameState(chess: Chess): GameState {
    const captured = getCapturedPieces(chess);
    return {
      fen: chess.fen(),
      turn: chess.turn(),
      isCheck: chess.isCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate(),
      isDraw: chess.isDraw(),
      isGameOver: chess.isGameOver(),
      moveHistory: chess.history({ verbose: true }),
      capturedPieces: captured,
      lastMove: null,
    };
  }

  function getCapturedPieces(chess: Chess): { white: string[]; black: string[] } {
    const history = chess.history({ verbose: true });
    const captured: { white: string[]; black: string[] } = { white: [], black: [] };
    
    history.forEach(move => {
      if (move.captured) {
        if (move.color === 'w') {
          captured.white.push(move.captured);
        } else {
          captured.black.push(move.captured);
        }
      }
    });
    
    return captured;
  }

  const updateGameState = useCallback(() => {
    const state = getGameState(game);
    state.lastMove = lastMove;
    setGameState(state);
    setMoveHistory(game.history({ verbose: true }));
  }, [game, lastMove]);

  const selectSquare = useCallback((square: Square): boolean => {
    const piece = game.get(square);
    
    // If clicking on own piece, select it
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to as Square));
      return true;
    }
    
    // If a piece is selected and clicking on a valid move
    if (selectedSquare && legalMoves.includes(square)) {
      return false; // Signal to make a move instead
    }
    
    // Clear selection
    setSelectedSquare(null);
    setLegalMoves([]);
    return false;
  }, [game, selectedSquare, legalMoves]);

  const makeMove = useCallback((from: Square, to: Square, promotion?: string): boolean => {
    try {
      const move = game.move({
        from,
        to,
        promotion: promotion || 'q',
      });
      
      if (move) {
        setLastMove({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        updateGameState();
        return true;
      }
    } catch {
      // Invalid move
    }
    return false;
  }, [game, updateGameState]);

  const newGame = useCallback(() => {
    game.reset();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    updateGameState();
  }, [game, updateGameState]);

  const undoMove = useCallback(() => {
    game.undo();
    const history = game.history({ verbose: true });
    const last = history[history.length - 1];
    setLastMove(last ? { from: last.from as Square, to: last.to as Square } : null);
    setSelectedSquare(null);
    setLegalMoves([]);
    updateGameState();
  }, [game, updateGameState]);

  const getPieceAt = useCallback((square: Square) => {
    const piece = game.get(square);
    return piece ? { type: piece.type, color: piece.color } : null;
  }, [game]);

  useEffect(() => {
    updateGameState();
  }, []);

  return {
    game,
    gameState: { ...gameState, lastMove },
    selectedSquare,
    legalMoves,
    selectSquare,
    makeMove,
    newGame,
    undoMove,
    canUndo: moveHistory.length > 0,
    getPieceAt,
  };
};
