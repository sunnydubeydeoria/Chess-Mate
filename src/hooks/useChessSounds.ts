import { useCallback, useRef } from 'react';

export const useChessSounds = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playMoveSound = useCallback(() => {
    playTone(600, 0.08, 'sine', 0.2);
  }, [playTone]);

  const playCaptureSound = useCallback(() => {
    playTone(400, 0.1, 'triangle', 0.3);
    setTimeout(() => playTone(300, 0.08, 'triangle', 0.2), 50);
  }, [playTone]);

  const playCheckSound = useCallback(() => {
    playTone(800, 0.15, 'square', 0.2);
    setTimeout(() => playTone(600, 0.1, 'square', 0.15), 100);
  }, [playTone]);

  const playGameOverSound = useCallback(() => {
    playTone(523, 0.2, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.2, 'sine', 0.3), 150);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.3), 300);
  }, [playTone]);

  const playIllegalMoveSound = useCallback(() => {
    playTone(200, 0.1, 'sawtooth', 0.15);
  }, [playTone]);

  return {
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playGameOverSound,
    playIllegalMoveSound,
  };
};
