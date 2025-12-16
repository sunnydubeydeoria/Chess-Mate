import React, { useEffect, useRef } from 'react';
import { Move } from 'chess.js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MoveHistoryProps {
  moves: Move[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  const movePairs: Array<{ number: number; white?: Move; black?: Move }> = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  const formatMove = (move: Move) => {
    return move.san;
  };

  return (
    <div className="bg-card rounded-xl card-shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-serif text-lg font-semibold text-card-foreground">Move History</h3>
      </div>
      <ScrollArea className="h-[200px]" ref={scrollRef}>
        <div className="p-2">
          {movePairs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No moves yet</p>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair, idx) => (
                <div
                  key={pair.number}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded text-sm',
                    idx === movePairs.length - 1 && 'bg-primary/10'
                  )}
                >
                  <span className="w-8 text-muted-foreground font-mono">{pair.number}.</span>
                  <span className="w-16 font-medium text-foreground">
                    {pair.white ? formatMove(pair.white) : '...'}
                  </span>
                  <span className="w-16 font-medium text-foreground">
                    {pair.black ? formatMove(pair.black) : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
