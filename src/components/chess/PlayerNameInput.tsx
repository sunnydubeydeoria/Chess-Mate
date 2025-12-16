import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PlayerNameInputProps {
  onStart: (names: { white: string; black: string }) => void;
}

export const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onStart }) => {
  const [whiteName, setWhiteName] = useState('');
  const [blackName, setBlackName] = useState('');

  const handleStart = () => {
    onStart({
      white: whiteName.trim() || 'White',
      black: blackName.trim() || 'Black',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl p-8 card-shadow max-w-md w-full mx-auto"
    >
      <h2 className="font-serif text-3xl font-bold text-center mb-6 text-card-foreground">
        Enter Player Names
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="white-name" className="flex items-center gap-2 text-card-foreground">
            <span className="w-4 h-4 rounded-full bg-secondary border-2 border-foreground/20" />
            White Player
          </Label>
          <Input
            id="white-name"
            value={whiteName}
            onChange={(e) => setWhiteName(e.target.value)}
            placeholder="Enter name..."
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="black-name" className="flex items-center gap-2 text-card-foreground">
            <span className="w-4 h-4 rounded-full bg-foreground" />
            Black Player
          </Label>
          <Input
            id="black-name"
            value={blackName}
            onChange={(e) => setBlackName(e.target.value)}
            placeholder="Enter name..."
            className="bg-background"
          />
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleStart}
            className="w-full mt-4 button-shadow"
            size="lg"
          >
            Start Game
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
