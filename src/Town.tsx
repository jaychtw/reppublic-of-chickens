import { useEffect, useRef, useState } from 'react';
import { debate } from './debate';
import { useGame } from './game';
import { citizenNames, local } from './i18n';
import { HallHeading, Portrait } from './ui';

export function Town() {
  const { save, setSave, t } = useGame();
  const [auto, setAuto] = useState(false);
  const [resumed, setResumed] = useState(save.town.position === 0);
  const [transcript, setTranscript] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const current = debate[save.town.position];
  const setPosition = (position: number) =>
    setSave((s) => ({
      ...s,
      town: { position, completed: s.town.completed || position === debate.length - 1 },
    }));
  useEffect(() => {
    const pause = () => setAuto(false);
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
  useEffect(() => {
    if (!auto || !resumed || transcript) return;
    if (save.town.position === debate.length - 1) {
      setAuto(false);
      return;
    }
    const delay = Math.max(
      4500,
      local(current.text, save.language).length * (save.language === 'en' ? 42 : 110),
    );
    const timer = setTimeout(() => setPosition(save.town.position + 1), delay);
    return () => clearTimeout(timer);
  }, [auto, resumed, transcript, save.town.position, save.language]);
  const replay = () => {
    setAuto(false);
    setPosition(0);
    setResumed(true);
    setTranscript(false);
  };
  const goEnd = () => {
    setAuto(false);
    setResumed(true);
    setTranscript(true);
    requestAnimationFrame(() => {
      if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
      setPosition(debate.length - 1);
    });
  };
  return (
    <article className="hall town-hall">
      <HallHeading hall="town" intro={t('townIntro')} instructions={t('townInstructions')} />
      <div className="town-stage" aria-hidden="true">
        {[0, 1, 2].map((citizen) => (
          <div className={`speaker ${current.speaker === citizen ? 'speaking' : ''}`} key={citizen}>
            <Portrait citizen={citizen} />
            <span>{local(citizenNames[citizen], save.language)}</span>
            <small>{t((['hopeful', 'skeptical', 'radical'] as const)[citizen])}</small>
          </div>
        ))}
        <div className="wooden-bench" />
      </div>
      <section className="dialogue paper" aria-label={t('town')}>
        <div className="dialogue-top">
          <strong>{local(citizenNames[current.speaker], save.language)}</strong>
          <span>
            {t('line')} {save.town.position + 1}/{debate.length}
          </span>
        </div>
        <blockquote data-testid="debate-line" aria-live={auto ? 'off' : 'polite'}>
          {local(current.text, save.language)}
        </blockquote>
        <progress max={debate.length} value={save.town.position + 1} aria-label={t('line')} />
        {!resumed ? (
          <div className="button-row">
            <button className="primary" onClick={() => setResumed(true)}>
              {t('resume')}
            </button>
            <button onClick={replay}>{t('replay')}</button>
          </div>
        ) : (
          <div className="button-row">
            <button
              disabled={save.town.position === 0}
              onClick={() => {
                setAuto(false);
                setPosition(save.town.position - 1);
              }}
            >
              {t('previous')}
            </button>
            <button
              className="primary"
              disabled={save.town.position === debate.length - 1}
              onClick={() => setPosition(save.town.position + 1)}
            >
              {t('next')}
            </button>
            <button
              aria-pressed={auto}
              disabled={save.town.position === debate.length - 1}
              onClick={() => setAuto((a) => !a)}
            >
              {t(auto ? 'pause' : 'auto')}
            </button>
            <button onClick={replay}>{t('replay')}</button>
          </div>
        )}
        {save.town.completed && <p className="completion-note">✓ {t('debateDone')}</p>}
        <div className="button-row secondary-controls">
          <button
            aria-expanded={transcript}
            onClick={() => {
              setTranscript((v) => !v);
              setAuto(false);
            }}
          >
            {t('transcript')}
          </button>
          <button onClick={goEnd}>{t('skip')}</button>
        </div>
      </section>
      {transcript && (
        <section className="transcript paper">
          <h2>{t('transcript')}</h2>
          <p>{t('fullTranscriptNote')}</p>
          <div
            className="transcript-scroll"
            ref={scroll}
            role="region"
            aria-label={t('transcript')}
            tabIndex={0}
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollHeight - el.scrollTop - el.clientHeight < 10)
                setPosition(debate.length - 1);
            }}
          >
            {debate.map((line, index) => (
              <p key={index}>
                <strong>{local(citizenNames[line.speaker], save.language)}.</strong>{' '}
                {local(line.text, save.language)}
              </p>
            ))}
            <p className="completion-note">{t('transcriptEnd')}</p>
          </div>
        </section>
      )}
    </article>
  );
}
