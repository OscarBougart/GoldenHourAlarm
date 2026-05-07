import { useState, useEffect } from 'react';
import type { SunTimes, LightWindow } from '@/utils/types';
import { getNextWindow } from '@/utils/sunCalc';

export interface CountdownState {
  key:      LightWindow | null;
  msLeft:   number;
  isActive: boolean;
}

export function useCountdown(sunTimes: SunTimes | null): CountdownState {
  const [state, setState] = useState<CountdownState>({
    key:      null,
    msLeft:   0,
    isActive: false,
  });

  useEffect(() => {
    if (!sunTimes) return;

    const tick = () => {
      const next = getNextWindow(sunTimes);
      if (!next) {
        setState({ key: null, msLeft: 0, isActive: false });
        return;
      }
      const now   = Date.now();
      const msLeft = next.isActive
        ? next.end.getTime() - now
        : next.start.getTime() - now;

      setState({ key: next.key, msLeft: Math.max(0, msLeft), isActive: next.isActive });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sunTimes]);

  return state;
}
