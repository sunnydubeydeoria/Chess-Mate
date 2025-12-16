import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChessBoard } from './ChessBoard';
import { GameInfo } from './GameInfo';
import { MoveHistory } from './MoveHistory';
import { GameControls } from './GameControls';
import { PlayerNameInput } from './PlayerNameInput';
import { useChessGame } from '@/hooks/useChessGame';
import { useChessSounds } from '@/hooks/useChessSounds';

export const ChessGame: React.FC = () => {
  const gameHook = useChessGame();
  const { playGameOverSound } = useChessSounds();
  const [playerNames, setPlayerNames] = useState<{ white: string; black: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (names: { white: string; black: string }) => {
    setPlayerNames(names);
    setGameStarted(true);
  };

  const handleNewGame = () => {
    gameHook.newGame();
  };

  const handleRestart = () => {
    setGameStarted(false);
    setPlayerNames(null);
    gameHook.newGame();
  };

  // Play game over sound
  React.useEffect(() => {
    if (gameHook.gameState.isGameOver && soundEnabled) {
      playGameOverSound();
    }
  }, [gameHook.gameState.isGameOver, soundEnabled, playGameOverSound]);

  if (!gameStarted || !playerNames) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <PlayerNameInput onStart={handleStartGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
            Chess
          </h1>
          <p className="text-muted-foreground">Classic strategy game</p>
        </motion.header>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          {/* Chess board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[600px] mx-auto lg:mx-0"
          >
            <ChessBoard gameHook={gameHook} />
          </motion.div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-80 space-y-4"
          >
            <GameInfo gameState={gameHook.gameState} playerNames={playerNames} />
            <MoveHistory moves={gameHook.gameState.moveHistory} />
            <GameControls
              onNewGame={handleNewGame}
              onUndo={gameHook.undoMove}
              canUndo={gameHook.canUndo}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
            
            {/* Change players button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestart}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Change Players
            </motion.button>
          </motion.div>
        </div>

        {/* Copyright Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-muted-foreground text-sm"
        >
          <p className="mt-1">Made with ❤️ by Sunny Kumar Dubey</p>
          <p>© {new Date().getFullYear()} Chess Game. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
};
