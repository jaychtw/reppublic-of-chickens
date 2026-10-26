export type Language = 'en' | 'zh-TW';
export const practicalHalls = ['mess', 'social', 'residential', 'welfare'] as const;
export type PracticalHall = (typeof practicalHalls)[number];
export type Hall = 'town' | PracticalHall;
export const halls: Hall[] = ['town', ...practicalHalls];
export const SAVE_KEY = 'republic-of-chickens.v1';
export const DEBATE_LENGTH = 42;
export type Score = { latest: number | null; best: number; checked: boolean };
export type Save = {
  version: 1;
  language: Language;
  muted: boolean;
  reducedMotion: boolean;
  scores: Record<PracticalHall, Score>;
  town: { position: number; completed: boolean };
  residential: { fixed: boolean[]; round: number };
  ending: { choice: 'keep' | 'road' | null; seen: boolean };
};

export function newSave(reducedMotion = false): Save {
  return {
    version: 1,
    language: 'en',
    muted: true,
    reducedMotion,
    scores: Object.fromEntries(
      practicalHalls.map((h) => [h, { latest: null, best: 0, checked: false }]),
    ) as Save['scores'],
    town: { position: 0, completed: false },
    residential: { fixed: Array(10).fill(false), round: 0 },
    ending: { choice: null, seen: false },
  };
}

export function recordScore(save: Save, hall: PracticalHall, score: number): Save {
  if (!Number.isInteger(score) || score < 0 || score > 100) throw new Error('Invalid score');
  const previous = save.scores[hall];
  return {
    ...save,
    scores: {
      ...save.scores,
      [hall]: {
        latest: score,
        best: Math.max(previous.best, score),
        checked: previous.checked || score >= 80,
      },
    },
  };
}

export function repairIssue(save: Save, index: number): Save {
  if (!Number.isInteger(index) || index < 0 || index >= 10) throw new Error('Invalid repair');
  const fixed = save.residential.fixed.map((value, i) => value || i === index);
  const next = { ...save, residential: { ...save.residential, fixed } };
  const count = fixed.filter(Boolean).length;
  return count >= 8 ? recordScore(next, 'residential', count * 10) : next;
}

export function satisfaction(save: Save): number {
  return Math.round(practicalHalls.reduce((n, h) => n + (save.scores[h].latest ?? 0), 0) / 4);
}
export function checks(save: Save): number {
  return Number(save.town.completed) + practicalHalls.filter((h) => save.scores[h].checked).length;
}
export function unlocked(save: Save): boolean {
  return checks(save) === 5;
}
export function socialScore(attempts: number): number {
  if (!Number.isInteger(attempts) || attempts < 8) throw new Error('Incomplete memory round');
  return attempts <= 10
    ? 100
    : attempts <= 13
      ? 90
      : attempts <= 16
        ? 80
        : attempts <= 20
          ? 70
          : 60;
}
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function makeDeck(): number[] {
  return shuffle([...Array(8).keys(), ...Array(8).keys()]);
}

export const FOOD_FULLNESS = [2, 1, 3] as const;
export const MEALS = [
  {
    targets: [4, 5, 9],
    wants: [0, 1, 2],
    needs: [2, 2, 2],
    solution: [
      [2, 0, 0],
      [0, 2, 1],
      [1, 1, 2],
    ],
  },
  {
    targets: [5, 6, 7],
    wants: [1, 2, 0],
    needs: [2, 1, 2],
    solution: [
      [0, 2, 1],
      [1, 1, 1],
      [2, 0, 1],
    ],
  },
  {
    targets: [7, 4, 7],
    wants: [2, 0, 1],
    needs: [2, 2, 2],
    solution: [
      [0, 1, 2],
      [2, 0, 0],
      [1, 2, 1],
    ],
  },
] as const;
export const emptyMeal = (): number[][] => Array.from({ length: 3 }, () => [0, 0, 0]);
export function fullness(row: readonly number[]): number {
  return row.reduce((total, n, i) => total + n * FOOD_FULLNESS[i], 0);
}
export function scoreMeal(
  allocation: readonly (readonly number[])[],
  round: number,
): { score: number; full: number; nutrition: number } {
  const meal = MEALS[round % MEALS.length];
  if (
    allocation.length !== 3 ||
    allocation.some(
      (r) => r.length !== 3 || r.some((n) => !Number.isInteger(n) || n < 0 || n > 3),
    ) ||
    [0, 1, 2].some((f) => allocation.reduce((n, r) => n + r[f], 0) > 3)
  )
    throw new Error('Invalid food allocation');
  const full =
    (allocation.reduce((n, row, i) => n + Math.min(1, fullness(row) / meal.targets[i]), 0) / 3) *
    60;
  const nutrition =
    (allocation.reduce((n, row, i) => n + Math.min(1, row[meal.wants[i]] / meal.needs[i]), 0) / 3) *
    40;
  return {
    score: Math.round(full + nutrition),
    full: Math.round(full),
    nutrition: Math.round(nutrition),
  };
}

type UnknownRecord = Record<string, unknown>;
function object(x: unknown): UnknownRecord {
  if (!x || typeof x !== 'object' || Array.isArray(x)) throw new Error('Invalid save');
  return x as UnknownRecord;
}
function bool(x: unknown): boolean {
  if (typeof x !== 'boolean') throw new Error('Invalid save');
  return x;
}
function integer(x: unknown, min: number, max: number): number {
  if (typeof x !== 'number' || !Number.isInteger(x) || x < min || x > max)
    throw new Error('Invalid save');
  return x;
}
export function decodeSave(text: string): Save {
  if (text.length > 100_000) throw new Error('Save too large');
  const x = object(JSON.parse(text));
  if (x.version !== 1 || !['en', 'zh-TW'].includes(String(x.language)))
    throw new Error('Unsupported save');
  const scores = object(x.scores);
  const result = newSave();
  result.language = x.language as Language;
  result.muted = bool(x.muted);
  result.reducedMotion = bool(x.reducedMotion);
  for (const hall of practicalHalls) {
    const score = object(scores[hall]);
    const latest = score.latest === null ? null : integer(score.latest, 0, 100);
    const best = integer(score.best, 0, 100);
    const checked = bool(score.checked);
    if (best < (latest ?? 0) || checked !== best >= 80) throw new Error('Inconsistent score');
    result.scores[hall] = { latest, best, checked };
  }
  const town = object(x.town),
    residence = object(x.residential),
    ending = object(x.ending);
  result.town = {
    position: integer(town.position, 0, DEBATE_LENGTH - 1),
    completed: bool(town.completed),
  };
  if (
    !Array.isArray(residence.fixed) ||
    residence.fixed.length !== 10 ||
    residence.fixed.some((v) => typeof v !== 'boolean')
  )
    throw new Error('Invalid repairs');
  result.residential = {
    fixed: [...residence.fixed],
    round: integer(residence.round, 0, 1_000_000),
  };
  if (ending.choice !== null && ending.choice !== 'keep' && ending.choice !== 'road')
    throw new Error('Invalid ending');
  result.ending = { choice: ending.choice, seen: bool(ending.seen) };
  if ((result.ending.choice !== null || result.ending.seen) && !unlocked(result))
    throw new Error('Ending requires five checks');
  if (result.ending.seen !== (result.ending.choice !== null))
    throw new Error('Inconsistent ending');
  return result;
}

export function loadSave(
  storage: Pick<Storage, 'getItem'>,
  reducedMotion = false,
): { save: Save; warning: boolean } {
  try {
    const raw = storage.getItem(SAVE_KEY);
    return { save: raw ? decodeSave(raw) : newSave(reducedMotion), warning: false };
  } catch {
    return { save: newSave(reducedMotion), warning: true };
  }
}
