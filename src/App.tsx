import { useEffect, useMemo, useRef, useState } from 'react';
import {
  checks,
  decodeSave,
  halls,
  loadSave,
  newSave,
  SAVE_KEY,
  satisfaction,
  unlocked,
  type Save,
} from './core';
import { GameContext, type Route } from './game';
import { translate } from './i18n';
import { Icon, Modal } from './ui';
import { Town, Mess, Social, Residence, Welfare, Ending } from './halls';

function getRoute(): Route {
  const route = location.hash.replace(/^#\/?/, '');
  return [...halls, 'ending'].includes(route) ? (route as Route) : 'overview';
}
function initialState() {
  try {
    return loadSave(
      window.localStorage,
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  } catch {
    return { save: newSave(true), warning: true };
  }
}
export default function App() {
  const [initial] = useState(initialState);
  const [save, setSave] = useState<Save>(initial.save);
  const [storageProtected, setStorageProtected] = useState(initial.warning);
  const [storageError, setStorageError] = useState(false);
  const [route, setRoute] = useState<Route>(getRoute);
  const [modal, setModal] = useState<'help' | 'backup' | null>(null);
  const [pendingImport, setPendingImport] = useState<Save | null>(null);
  const [backupMessage, setBackupMessage] = useState('');
  const [epoch, setEpoch] = useState(0);
  const audio = useRef<AudioContext | null>(null);
  const t = (key: Parameters<typeof translate>[1]) => translate(save.language, key);
  useEffect(() => {
    document.documentElement.lang = save.language;
    document.documentElement.dataset.motion = save.reducedMotion ? 'reduced' : 'full';
    document.title = `${t('title')} · ${save.language === 'en' ? '雞窩共和國' : 'Republic of Chickens'}`;
    if (storageProtected) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [save, storageProtected]);
  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }),
    );
  }, [route, epoch]);
  const navigate = (next: Route) => {
    setRoute(next);
    location.hash = next === 'overview' ? '/' : `/${next}`;
  };
  const chime = () => {
    if (save.muted) return;
    try {
      audio.current ??= new AudioContext();
      const ctx = audio.current;
      void ctx.resume();
      [523.25, 659.25, 783.99].forEach((frequency, i) => {
        const oscillator = ctx.createOscillator(),
          gain = ctx.createGain();
        const start = ctx.currentTime + i * 0.06;
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.035, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.3);
      });
    } catch {
      /* Sound is optional; gameplay remains available. */
    }
  };
  const game = { save, setSave, t, navigate, chime };
  const actualRoute = route === 'ending' && !unlocked(save) ? 'overview' : route;
  const exportSave = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'republic-of-chickens-v1.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStorageProtected(false);
  };
  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 100_000) throw new Error('Too large');
      setPendingImport(decodeSave(await file.text()));
      setBackupMessage('');
    } catch {
      setBackupMessage('importError');
    }
  };
  return (
    <GameContext.Provider value={game}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        {t('accessibility')}
      </a>
      <div className="app-shell">
        <header className="site-header">
          <button className="wordmark" onClick={() => navigate('overview')} aria-label={t('back')}>
            <span className="crest">
              <Icon name="feather" />
            </span>
            <span>
              {t('title')}
              <small>{save.language === 'en' ? '雞窩共和國' : 'Republic of Chickens'}</small>
            </span>
          </button>
          <nav className="toolbar" aria-label={t('accessibility')}>
            <button
              className="language"
              onClick={() =>
                setSave((s) => ({ ...s, language: s.language === 'en' ? 'zh-TW' : 'en' }))
              }
            >
              {save.language === 'en' ? '繁體中文' : 'English'}
            </button>
            <button
              aria-label={t(save.muted ? 'soundOff' : 'soundOn')}
              title={t(save.muted ? 'soundOff' : 'soundOn')}
              aria-pressed={!save.muted}
              onClick={() => {
                setSave((s) => ({ ...s, muted: !s.muted }));
              }}
            >
              <Icon name={save.muted ? 'quiet' : 'sound'} />
            </button>
            <button
              aria-label={t(save.reducedMotion ? 'motionOff' : 'motionOn')}
              title={t(save.reducedMotion ? 'motionOff' : 'motionOn')}
              aria-pressed={save.reducedMotion}
              onClick={() => setSave((s) => ({ ...s, reducedMotion: !s.reducedMotion }))}
            >
              <Icon name="sun" />
            </button>
            <button aria-label={t('help')} title={t('help')} onClick={() => setModal('help')}>
              <Icon name="help" />
            </button>
            <button
              aria-label={t('save')}
              title={t('save')}
              onClick={() => {
                setModal('backup');
                setBackupMessage('');
              }}
            >
              <Icon name="save" />
            </button>
          </nav>
        </header>
        {(storageError || storageProtected) && (
          <div role="alert" className="notice">
            <p>{t(storageProtected ? 'recovered' : 'saveError')}</p>
            <button onClick={() => setModal('backup')}>{t('save')}</button>
          </div>
        )}
        <main id="main-content" tabIndex={-1} key={epoch}>
          {actualRoute !== 'overview' && (
            <button className="back-button" onClick={() => navigate('overview')}>
              <Icon name="arrow" /> {t('back')}
            </button>
          )}
          {actualRoute === 'overview' ? (
            <Overview />
          ) : actualRoute === 'town' ? (
            <Town />
          ) : actualRoute === 'mess' ? (
            <Mess />
          ) : actualRoute === 'social' ? (
            <Social />
          ) : actualRoute === 'residential' ? (
            <Residence />
          ) : actualRoute === 'welfare' ? (
            <Welfare />
          ) : (
            <Ending />
          )}
        </main>
        <footer>
          <span>
            <Icon name="feather" /> {t('credits')}
          </span>
          <span>{t(storageError || storageProtected ? 'saveError' : 'saved')}</span>
        </footer>
      </div>
      {modal && (
        <Modal
          title={t(modal === 'help' ? 'helpTitle' : 'backupTitle')}
          onClose={() => {
            setModal(null);
            setPendingImport(null);
          }}
        >
          {modal === 'help' ? (
            <div className="help-copy">
              {(['helpBody', 'helpBody2', 'helpBody3', 'helpBody4'] as const).map((k) => (
                <p key={k}>{t(k)}</p>
              ))}
            </div>
          ) : (
            <>
              <p>{t('backupBody')}</p>
              <button className="primary" onClick={exportSave}>
                <Icon name="save" /> {t('export')}
              </button>
              <label className="file-label">
                {t('import')}
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    void importFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>
              <p className="caption">{t('importHint')}</p>
              {backupMessage && (
                <p role="status">{t(backupMessage as 'importError' | 'imported')}</p>
              )}
              {pendingImport && (
                <section className="import-confirm">
                  <h3>{t('confirmImport')}</h3>
                  <p>
                    {checks(pendingImport)}/5 · {satisfaction(pendingImport)}%
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setSave(pendingImport);
                      setStorageProtected(false);
                      setPendingImport(null);
                      setEpoch((n) => n + 1);
                      navigate('overview');
                      setBackupMessage('imported');
                    }}
                  >
                    {t('replace')}
                  </button>
                  <button onClick={() => setPendingImport(null)}>{t('cancel')}</button>
                </section>
              )}
            </>
          )}
        </Modal>
      )}
    </GameContext.Provider>
  );
}

import { useGame } from './game';
function Overview() {
  const { save, t, navigate } = useGame();
  const entries = useMemo(
    () => [
      { id: 'town' as const, x: 45, y: 30, number: '01' },
      { id: 'mess' as const, x: 17, y: 55, number: '02' },
      { id: 'social' as const, x: 68, y: 49, number: '03' },
      { id: 'residential' as const, x: 65, y: 80, number: '04' },
      { id: 'welfare' as const, x: 85, y: 29, number: '05' },
    ],
    [],
  );
  return (
    <>
      <section className="overview-intro">
        <div>
          <div className="eyebrow">{t('chapter')}</div>
          <h1 tabIndex={-1}>{t('subtitle')}</h1>
        </div>
        <div className="satisfaction">
          <span>
            {t('satisfaction')} <strong data-testid="satisfaction">{satisfaction(save)}%</strong>
          </span>
          <meter min="0" max="100" value={satisfaction(save)} aria-label={t('satisfaction')} />
          <details>
            <summary>{t('satisfaction')} ⓘ</summary>
            <p>{t('satisfactionNote')}</p>
          </details>
        </div>
      </section>
      <section className="world" aria-label={t('republic')}>
        {entries.map(({ id, x, y, number }) => {
          const checked = id === 'town' ? save.town.completed : save.scores[id].checked;
          return (
            <button
              key={id}
              className={`hall-marker ${checked ? 'earned' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => navigate(id)}
              data-testid={`enter-${id}`}
            >
              <span className="marker-number">
                {number} {checked && <Icon name="check" />}
              </span>
              <strong>{t(id)}</strong>
              <small>
                {id === 'town'
                  ? t(save.town.completed ? 'read' : 'unread')
                  : `${t('best')} ${save.scores[id].best}%`}
              </small>
              <span className="sr-only">{t(checked ? 'checked' : 'unchecked')}</span>
            </button>
          );
        })}
        <div className="world-corner">
          <Icon name="feather" />
          <span>{t('returnAnytime')}</span>
        </div>
      </section>
      <section className="republic-ledger paper">
        <div className="milestone">
          <span className="eyebrow">{t('permanent')}</span>
          <strong data-testid="hall-checks">
            {checks(save)}
            <small>/5</small>
          </strong>
          <div className="check-row">
            {halls.map((h) => (
              <span
                className={
                  (h === 'town' ? save.town.completed : save.scores[h].checked) ? 'done' : ''
                }
                key={h}
                title={t(h)}
                role="img"
                aria-label={`${t(h)}: ${t((h === 'town' ? save.town.completed : save.scores[h].checked) ? 'checked' : 'unchecked')}`}
              >
                <Icon
                  name={(h === 'town' ? save.town.completed : save.scores[h].checked) ? 'check' : h}
                />
              </span>
            ))}
          </div>
          <p>{t('progressNote')}</p>
        </div>
        <div className="crossroads-invite">
          <span className="eyebrow">{t('endingIntro')}</span>
          <h2>{t('moment')}</h2>
          <p>{t(unlocked(save) ? 'available' : 'locked')}</p>
          <button
            className="primary"
            disabled={!unlocked(save)}
            onClick={() => navigate('ending')}
            data-testid="enter-ending"
          >
            <Icon name={unlocked(save) ? 'feather' : 'lock'} />
            {t(save.ending.seen ? 'revisit' : 'moment')}
          </button>
        </div>
      </section>
    </>
  );
}
