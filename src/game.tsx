import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { Save, Hall } from './core';
import { translate, type Key } from './i18n';
export type Route = Hall | 'overview' | 'ending';
export type Game = {
  save: Save;
  setSave: Dispatch<SetStateAction<Save>>;
  t: (key: Key) => string;
  navigate: (route: Route) => void;
  chime: () => void;
};
export const GameContext = createContext<Game | null>(null);
export function useGame(): Game {
  const context = useContext(GameContext);
  if (!context) throw new Error('Missing game context');
  return context;
}
export { translate };
