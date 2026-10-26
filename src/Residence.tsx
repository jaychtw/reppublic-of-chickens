import { useRef, useState } from 'react';
import { recordScore, repairIssue } from './core';
import { useGame } from './game';
import { local, repairData } from './i18n';
import { HallHeading, Icon, Modal, Result } from './ui';

function RepairSprite({ kind, fixed }: { kind: string; fixed: boolean }) {
  const index = [
    'pipe',
    'perch',
    'fence',
    'nest',
    'feed',
    'lamp',
    'drain',
    'tile',
    'bucket',
    'hinge',
  ].indexOf(kind);
  const column = index % 5;
  const row = (index < 5 ? 0 : 2) + Number(fixed);
  return (
    <span
      className="repair-sprite"
      aria-hidden="true"
      style={{ backgroundPosition: `${column * 25}% ${(row * 100) / 3}%` }}
    />
  );
}

export function Residence() {
  const { save, setSave, t, navigate, chime } = useGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const fixed = save.residential.fixed;
  const count = fixed.filter(Boolean).length;
  const choose = (index: number) => {
    setSelected(index);
    setStep(0);
  };
  const act = () => {
    if (selected === null || fixed[selected]) return;
    if (step === 0) {
      setStep(1);
      return;
    }
    setSave((s) => repairIssue(s, selected));
    setSelected(null);
    setStep(0);
    setHint(null);
    chime();
  };
  return (
    <article className="hall residence-hall">
      <HallHeading
        hall="residential"
        intro={t('residenceIntro')}
        instructions={t('residenceInstructions')}
      />
      <div className="residence-toolbar paper">
        <strong>
          {t('condition')}: <span data-testid="condition-score">{count * 10}%</span>
        </strong>
        <span>
          {count}/10 {t('repaired')}
        </span>
        <button
          onClick={() => {
            const index = fixed.findIndex((value) => !value);
            setHint(index >= 0 ? index : null);
          }}
          disabled={count === 10}
        >
          {t('hint')}
        </button>
        <button aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
          {t(zoom ? 'unzoom' : 'zoom')}
        </button>
      </div>
      <div className="residence-scroll">
        <div
          className={`residence-scene ${zoom ? 'zoomed' : ''}`}
          aria-label={t('residential')}
          role="group"
        >
          {repairData.map((issue, index) => (
            <button
              key={issue.kind}
              className={`repair-target ${fixed[index] ? 'fixed' : ''} ${hint === index ? 'hinted' : ''} ${selected === index ? 'active' : ''}`}
              style={{
                left: `${issue.position[0] + (save.residential.round % 2 ? (index % 2 ? 1 : -1) : 0)}%`,
                top: `${issue.position[1]}%`,
              }}
              aria-label={`${local(issue.title, save.language)}${fixed[index] ? ` · ${t('repaired')}` : ''}`}
              disabled={fixed[index]}
              onClick={() => choose(index)}
              data-testid={`issue-${index}`}
            >
              <RepairSprite kind={issue.kind} fixed={fixed[index]} />
              {fixed[index] && (
                <span className="repair-check">
                  <Icon name="check" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="repair-panel paper" ref={panel} aria-live="polite">
        {selected === null ? (
          <p>{count === 10 ? t('repairsDone') : t('repairPrompt')}</p>
        ) : (
          <>
            <div>
              <strong>{local(repairData[selected].title, save.language)}</strong>
              <span>
                {t('repairStep')} {step + 1}/2
              </span>
            </div>
            <button className="primary" onClick={act} data-testid="repair-action">
              {local(repairData[selected].steps[step], save.language)}
            </button>
          </>
        )}
      </div>
      <details className="issue-list paper">
        <summary>
          {t('issues')} · {count}/10
        </summary>
        <div>
          {repairData.map((issue, index) => (
            <button
              key={index}
              disabled={fixed[index]}
              onClick={() => {
                choose(index);
                panel.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
              }}
              aria-label={`${local(issue.title, save.language)}${fixed[index] ? ` · ${t('repaired')}` : ''}`}
            >
              {fixed[index] ? '✓' : `${index + 1}.`} {local(issue.title, save.language)}
            </button>
          ))}
        </div>
      </details>
      {count === 10 && <Result score={100} title={t('repairsDone')} />}
      <div className="button-row">
        <button
          className="primary"
          onClick={() => {
            if (count > 0) setSave((s) => recordScore(s, 'residential', count * 10));
            navigate('overview');
          }}
        >
          {t('finishRound')}
        </button>
        <button onClick={() => setConfirm(true)}>{t('newRound')}</button>
      </div>
      {confirm && (
        <Modal title={t('newRound')} onClose={() => setConfirm(false)}>
          <p>{t('confirmNew')}</p>
          <div className="button-row">
            <button
              className="primary"
              onClick={() => {
                setSave((s) => ({
                  ...s,
                  residential: {
                    fixed: Array(10).fill(false),
                    round: (s.residential.round + 1) % 1_000_000,
                  },
                }));
                setSelected(null);
                setHint(null);
                setStep(0);
                setConfirm(false);
              }}
            >
              {t('yesNew')}
            </button>
            <button onClick={() => setConfirm(false)}>{t('cancel')}</button>
          </div>
        </Modal>
      )}
    </article>
  );
}
