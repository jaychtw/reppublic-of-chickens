import { useState } from 'react';
import { useGame } from './game';

export function Ending() {
  const { save, setSave, t, navigate } = useGame();
  const [selected, setSelected] = useState<'keep' | 'road' | null>(null);
  const choose = (choice: 'keep' | 'road') => {
    setSelected(choice);
    setSave((s) => ({ ...s, ending: { choice, seen: true } }));
  };
  return (
    <article className="ending-scene">
      <div className="ending-sky">
        <span className="eyebrow">{t('endingIntro')}</span>
        <h1 tabIndex={-1}>{t('prompt')}</h1>
      </div>
      <div className="ending-content">
        {selected === null ? (
          <>
            <div className="ending-choices">
              <button onClick={() => choose('keep')}>{t('keep')}</button>
              <button onClick={() => choose('road')}>{t('road')}</button>
            </div>
            {save.ending.seen && <p>{t('choiceSaved')}</p>}
          </>
        ) : (
          <section className="epilogue" aria-live="polite">
            <blockquote data-testid="governor-line">
              “{t(selected === 'keep' ? 'keepLine' : 'roadLine')}”
            </blockquote>
            <p>{t('epilogue')}</p>
            <button className="primary" onClick={() => navigate('overview')}>
              {t('continue')}
            </button>
          </section>
        )}
      </div>
    </article>
  );
}
