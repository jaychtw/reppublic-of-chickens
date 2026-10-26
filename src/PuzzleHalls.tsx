import { useEffect, useRef, useState } from 'react';
import {
  emptyMeal,
  FOOD_FULLNESS,
  fullness,
  makeDeck,
  MEALS,
  recordScore,
  shuffle,
  socialScore,
} from './core';
import { scoreMeal } from './core';
import { useGame } from './game';
import { citizenNames, local, patientData, treatments } from './i18n';
import { HallHeading, Icon, Portrait, Result } from './ui';

const foodKeys = ['grain', 'vegetables', 'protein'] as const;
export function Mess() {
  const { t, setSave, chime } = useGame();
  const [round, setRound] = useState(0);
  const [allocation, setAllocation] = useState(emptyMeal);
  const [food, setFood] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof scoreMeal> | null>(null);
  const meal = MEALS[round % MEALS.length];
  const stock = foodKeys.map((_, i) => 3 - allocation.reduce((n, row) => n + row[i], 0));
  const change = (group: number, food: number, by: number) => {
    if (result || (by > 0 && stock[food] < 1) || (by < 0 && allocation[group][food] < 1)) return;
    setAllocation((current) =>
      current.map((row, i) => (i === group ? row.map((n, j) => (j === food ? n + by : n)) : row)),
    );
  };
  return (
    <article className="hall mess-hall">
      <HallHeading hall="mess" intro={t('messIntro')} instructions={t('messInstructions')} />
      <section className="food-shelf paper" aria-label={t('selectFood')}>
        {foodKeys.map((key, i) => (
          <button
            className={`food-token ${food === i ? 'selected' : ''}`}
            key={key}
            aria-pressed={food === i}
            onClick={() => setFood(i)}
            disabled={!!result}
          >
            <Icon name={key} />
            <strong>{t(key)}</strong>
            <span>
              {t('stock')}: <b>{stock[i]}</b>/3
            </span>
            <small>
              {FOOD_FULLNESS[i]} {t('tokenUnit')}
            </small>
          </button>
        ))}
      </section>
      <div className="tray-grid">
        {allocation.map((row, group) => (
          <section className="meal-tray paper" key={group} data-testid={`tray-${group}`}>
            <div className="tray-heading">
              <Portrait citizen={group === 0 ? 3 : group === 1 ? 1 : 2} />
              <div>
                <h2>{t((['group0', 'group1', 'group2'] as const)[group])}</h2>
                <span>
                  {t('fullness')}:{' '}
                  <strong>
                    {fullness(row)}/{meal.targets[group]}
                  </strong>
                </span>
              </div>
            </div>
            <progress
              max={meal.targets[group]}
              value={Math.min(meal.targets[group], fullness(row))}
              aria-label={`${t('fullness')} ${group + 1}`}
            />
            <p className="dietary-need">
              <Icon name={foodKeys[meal.wants[group]]} />
              {t('foodNeed')}: {meal.needs[group]} × {t(foodKeys[meal.wants[group]])}
            </p>
            <div className="allocation">
              {row.map((n, i) => (
                <div className="allocation-row" key={i}>
                  <span>
                    <Icon name={foodKeys[i]} />
                    {t(foodKeys[i])}
                  </span>
                  <span className="quantity">
                    <button
                      disabled={!!result || n === 0}
                      aria-label={`${t('remove')} ${t(foodKeys[i])} · ${t((['group0', 'group1', 'group2'] as const)[group])}`}
                      onClick={() => change(group, i, -1)}
                    >
                      −
                    </button>
                    <b data-testid={`amount-${group}-${i}`}>{n}</b>
                    <button
                      disabled={!!result || stock[i] === 0}
                      aria-label={`${t('add')} ${t(foodKeys[i])} · ${t((['group0', 'group1', 'group2'] as const)[group])}`}
                      onClick={() => change(group, i, 1)}
                    >
                      +
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <button
              className="add-food"
              disabled={!!result || stock[food] === 0}
              onClick={() => change(group, food, 1)}
            >
              <Icon name={foodKeys[food]} />
              {t('add')} {t(foodKeys[food])}
            </button>
          </section>
        ))}
      </div>
      <p className="caption">{t('mealMath')}</p>
      {result ? (
        <>
          <Result score={result.score} title={t('mealResult')} />
          <p className="score-breakdown">
            {t('fullness')}: {result.full}/60 · {t('nutrition')}: {result.nutrition}/40
          </p>
          <div className="button-row">
            <button
              className="primary"
              onClick={() => {
                setAllocation(emptyMeal());
                setResult(null);
              }}
            >
              {t('retry')}
            </button>
            <button
              onClick={() => {
                setRound((n) => n + 1);
                setAllocation(emptyMeal());
                setResult(null);
              }}
            >
              {t('newRound')}
            </button>
          </div>
        </>
      ) : (
        <div className="button-row">
          <button
            className="primary"
            onClick={() => {
              const score = scoreMeal(allocation, round);
              setResult(score);
              setSave((s) => recordScore(s, 'mess', score.score));
              chime();
            }}
          >
            {t('serve')}
          </button>
          <button onClick={() => setAllocation(emptyMeal())}>{t('resetAllocation')}</button>
        </div>
      )}
      <p className="ambient-quote">{t('messFlavor')}</p>
    </article>
  );
}

type Phase = 'ready' | 'preview' | 'play' | 'mismatch' | 'done';
export function Social() {
  const { save, setSave, t, chime } = useGame();
  const [deck, setDeck] = useState(makeDeck);
  const [phase, setPhase] = useState<Phase>('ready');
  const [paused, setPaused] = useState(false);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const remaining = useRef(3000);
  useEffect(() => {
    if (paused || !['preview', 'mismatch'].includes(phase)) return;
    const start = performance.now();
    const timer = setTimeout(() => {
      if (phase === 'mismatch') setOpened([]);
      setPhase('play');
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [phase, paused]);
  useEffect(() => {
    const pause = () => setPaused(true);
    const visibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('republic-pause', pause);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('republic-pause', pause);
    };
  }, []);
  const flip = (index: number) => {
    if (phase !== 'play' || paused || matched.includes(deck[index]) || opened.includes(index))
      return;
    if (opened.length === 0) {
      setOpened([index]);
      return;
    }
    setAttempts((a) => a + 1);
    const first = opened[0];
    if (deck[first] === deck[index]) {
      const next = [...matched, deck[index]];
      setMatched(next);
      setOpened([]);
      chime();
      if (next.length === 8) {
        setPhase('done');
        setSave((s) => recordScore(s, 'social', socialScore(attempts + 1)));
      }
    } else {
      setOpened([first, index]);
      remaining.current = 900;
      setPhase('mismatch');
    }
  };
  const reset = () => {
    setDeck(makeDeck());
    setPhase('ready');
    setPaused(false);
    setOpened([]);
    setMatched([]);
    setAttempts(0);
    remaining.current = 3000;
  };
  const revealing = !paused && phase === 'preview';
  return (
    <article className="hall social-hall">
      <HallHeading hall="social" intro={t('socialIntro')} instructions={t('socialInstructions')} />
      <div className="memory-status paper">
        <span>
          {t('matched')}: <b>{matched.length}/8</b>
        </span>
        <strong role="status">
          {t(
            paused && phase !== 'ready' && phase !== 'done'
              ? 'paused'
              : phase === 'preview'
                ? 'preview'
                : 'playing',
          )}
        </strong>
        <span>
          {t('attempts')}: <b data-testid="attempt-count">{attempts}</b>
        </span>
      </div>
      <div className="memory-table">
        <div className="memory-grid" role="group" aria-label={t('social')}>
          {deck.map((citizen, index) => {
            const isMatched = matched.includes(citizen);
            const visible = isMatched || (!paused && (revealing || opened.includes(index)));
            return (
              <button
                className={`memory-card ${visible ? 'face-up' : ''} ${isMatched ? 'matched' : ''}`}
                key={index}
                disabled={phase !== 'play' || paused || isMatched || opened.includes(index)}
                onClick={() => flip(index)}
                data-testid={`card-${index}`}
                data-citizen={visible ? citizen : undefined}
                aria-label={`${t('card')} ${index + 1}: ${visible ? local(citizenNames[citizen], save.language) : t('hiddenCard')}${isMatched ? ` · ${t('matchedCard')}` : ''}`}
              >
                {visible ? (
                  <>
                    <Portrait citizen={citizen} />
                    <span className="card-name">{local(citizenNames[citizen], save.language)}</span>
                    {isMatched && (
                      <span className="match-seal">
                        <Icon name="check" />
                      </span>
                    )}
                  </>
                ) : (
                  <span className="card-back">
                    <Icon name="feather" />
                    <span>{index + 1}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="button-row">
        {phase === 'ready' ? (
          <button
            className="primary"
            onClick={() => {
              remaining.current = 3000;
              setPaused(false);
              setPhase('preview');
            }}
          >
            {t('start')}
          </button>
        ) : phase !== 'done' ? (
          <button className="primary" onClick={() => setPaused((p) => !p)}>
            {t(paused ? 'resumeGame' : 'pause')}
          </button>
        ) : null}
        {phase !== 'ready' && <button onClick={reset}>{t('newRound')}</button>}
      </div>
      {phase === 'done' && <Result score={socialScore(attempts)} title={t('memoryDone')} />}
      <p className="caption">{t('socialScoring')}</p>
    </article>
  );
}

export function Welfare() {
  const { save, setSave, t, chime } = useGame();
  const [order, setOrder] = useState(() => shuffle([0, 1, 2, 3, 4]));
  const [stations, setStations] = useState(() => shuffle([0, 1, 2, 3, 4]));
  const [selected, setSelected] = useState<number | null>(null);
  const [tried, setTried] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [firstTry, setFirstTry] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const assign = (treatment: number, patient = selected) => {
    if (patient === null || done.includes(patient) || patient < 0 || patient >= patientData.length)
      return;
    const first = !tried.includes(patient);
    setTried((x) => [...new Set([...x, patient])]);
    if (patientData[patient].treatment !== treatment) {
      setSelected(patient);
      setFeedback('wrong');
      return;
    }
    const next = [...done, patient],
      points = firstTry + Number(first);
    setDone(next);
    setFirstTry(points);
    setFeedback('correct');
    setSelected(null);
    chime();
    if (next.length === 5) setSave((s) => recordScore(s, 'welfare', points * 20));
  };
  const reset = () => {
    setOrder(shuffle([0, 1, 2, 3, 4]));
    setStations(shuffle([0, 1, 2, 3, 4]));
    setSelected(null);
    setTried([]);
    setDone([]);
    setFirstTry(0);
    setFeedback(null);
  };
  return (
    <article className="hall welfare-hall">
      <HallHeading
        hall="welfare"
        intro={t('welfareIntro')}
        instructions={t('welfareInstructions')}
      />
      <div className="care-status paper">
        <span>
          {t('caredFor')}: <b>{done.length}/5</b>
        </span>
        <span>
          {t('firstTry')}: <b>{firstTry}/5</b>
        </span>
        <p className={feedback === 'wrong' ? 'care-feedback wrong' : 'care-feedback'} role="status">
          {feedback
            ? t(feedback)
            : selected === null
              ? t('selectPatient')
              : `${t('selectedPatient')}: ${local(citizenNames[patientData[selected].citizen], save.language)}`}
          {feedback === 'wrong' &&
            selected !== null &&
            ` ${local(treatments[patientData[selected].treatment].detail, save.language)}`}
        </p>
      </div>
      <div className="care-layout">
        <section>
          <h2>{t('patients')}</h2>
          <div className="patient-grid">
            {order.map((i) => (
              <button
                className={`patient paper ${selected === i ? 'selected' : ''} ${done.includes(i) ? 'cared' : ''}`}
                key={i}
                data-testid={`patient-${i}`}
                aria-pressed={selected === i}
                disabled={done.includes(i)}
                draggable={!done.includes(i)}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(i));
                  e.dataTransfer.effectAllowed = 'move';
                  setSelected(i);
                }}
                onClick={() => {
                  setSelected(i);
                  setFeedback(null);
                }}
              >
                <Portrait citizen={patientData[i].citizen} />
                <span>
                  <strong>
                    {local(citizenNames[patientData[i].citizen], save.language)}{' '}
                    {done.includes(i) && '✓'}
                  </strong>
                  <span>{local(patientData[i].clue, save.language)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="care-stations">
          <h2>{t('treatments')}</h2>
          {stations.map((i) => (
            <button
              className="treatment paper"
              key={i}
              data-testid={`treatment-${i}`}
              aria-disabled={selected === null}
              onClick={() => assign(i)}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const payload = e.dataTransfer.getData('text/plain');
                if (/^[0-4]$/.test(payload)) assign(i, Number(payload));
              }}
            >
              <Icon name={treatments[i].icon} />
              <span>
                <strong>{local(treatments[i].title, save.language)}</strong>
                <small>{local(treatments[i].detail, save.language)}</small>
              </span>
            </button>
          ))}
        </section>
      </div>
      {done.length === 5 && (
        <>
          <Result score={firstTry * 20} title={t('careDone')} />
          <button className="primary" onClick={reset}>
            {t('newRound')}
          </button>
        </>
      )}
      <p className="caption">{t('careNote')}</p>
    </article>
  );
}
