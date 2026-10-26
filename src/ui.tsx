import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useGame } from './game';
import { citizenNames, local } from './i18n';

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    feather: (
      <>
        <path d="M5 21 19 5M9 17C-1 2 21-2 21 3c0 12-4 15-12 14Z" />
        <path d="m11 10 5 1m-8 3 5 1" />
      </>
    ),
    check: <path d="m5 12 5 5L20 6" />,
    arrow: (
      <>
        <path d="M20 12H4m7-7-7 7 7 7" />
      </>
    ),
    sound: (
      <>
        <path d="m4 9 5 0 6-5v16l-6-5H4Z" />
        <path d="M19 8q6 4 0 8" />
      </>
    ),
    quiet: (
      <>
        <path d="m4 9 5 0 6-5v16l-6-5H4Z" />
        <path d="m19 10 4 4m0-4-4 4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 8a3 3 0 1 1 5 3c-2 1-2 2-2 3m0 3v.1" />
      </>
    ),
    save: (
      <>
        <path d="M5 3h12l4 4v14H3V3Zm2 0v7h10V3M7 21v-7h10v7" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2" />
      </>
    ),
    town: (
      <>
        <path d="M3 21h18M5 21V10h14v11M3 10l9-7 9 7M9 21v-7h6v7M12 3V1" />
      </>
    ),
    mess: (
      <>
        <path d="M3 12h18c0 10-18 10-18 0ZM2 11h20M8 2q-3 3 0 6m5-6q-3 3 0 6m5-6q-3 3 0 6" />
      </>
    ),
    social: (
      <>
        <path d="M12 21S0 13 3 6c3-5 8-1 9 1 1-2 6-6 9-1 3 7-9 15-9 15Z" />
      </>
    ),
    residential: (
      <>
        <path d="m2 11 10-9 10 9M5 9v12h14V9m-10 12v-7h6v7" />
      </>
    ),
    welfare: (
      <>
        <path d="M12 22V9m0 4C0 14 1 0 3 2c8 0 9 4 9 11Zm0 5C23 20 24 5 22 6c-8 1-10 4-10 12Z" />
      </>
    ),
    grain: (
      <>
        <path d="M12 22V3m0 4C2 8 4 0 4 2c6 0 8 2 8 5Zm0 6c-10 1-9-7-9-5 6 0 9 2 9 5Zm0 5c10 1 9-7 9-5-6 0-9 2-9 5Zm0-9c9 1 8-7 8-5-6 0-8 2-8 5Z" />
      </>
    ),
    vegetables: (
      <>
        <path d="M4 20C-4 5 10-3 20 3c6 12-2 19-16 17Zm0 0L17 6M9 14V6m0 8 8 1" />
      </>
    ),
    protein: (
      <>
        <path d="M7 3h10l4 17H3ZM8 3l-2-2m9 2 3-2" />
        <circle cx="9" cy="14" r="2" />
        <circle cx="15" cy="11" r="2" />
      </>
    ),
    bandage: (
      <>
        <path d="m3 15 12-12q3-3 6 0t0 6L9 21q-3 3-6 0t0-6Z" />
        <path d="m9 9 6 6m-3-9 6 6M8 16h.1M16 8h.1" />
      </>
    ),
    care: (
      <>
        <path d="M5 2v7a5 5 0 0 0 10 0V2M3 2h4m6 0h4m-7 12v3a5 5 0 0 0 10 0v-3" />
        <circle cx="20" cy="11" r="3" />
      </>
    ),
    water: (
      <>
        <path d="M5 8h14l-2 14H7ZM12 1C4 8 18 8 12 1Z" />
        <path d="M6 13h12" />
      </>
    ),
    observe: (
      <>
        <path d="M2 21h20M4 21V8l8-6 8 6v13M8 10h8v7H8Z" />
        <path d="m10 13 2 2 3-3" />
      </>
    ),
  };
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.feather}
    </svg>
  );
}

export function Portrait({
  citizen,
  className = '',
  labelled = false,
}: {
  citizen: number;
  className?: string;
  labelled?: boolean;
}) {
  const { save } = useGame();
  return (
    <div
      className={`portrait ${className}`}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? local(citizenNames[citizen], save.language) : undefined}
      aria-hidden={labelled ? undefined : true}
      style={
        {
          '--portrait-x': `${((citizen % 4) * 100) / 3}%`,
          '--portrait-y': citizen < 4 ? '0%' : '100%',
        } as CSSProperties
      }
    />
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const { t } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new Event('republic-pause'));
    const root = ref.current!;
    root.focus();
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close.current();
      }
      if (event.key !== 'Tab') return;
      const items = [
        ...root.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0],
        last = items.at(-1)!;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === root)) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && (document.activeElement === last || document.activeElement === root)) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener('keydown', listener);
    return () => {
      document.body.style.overflow = bodyOverflow;
      root.removeEventListener('keydown', listener);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal paper"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button onClick={onClose} aria-label={t('close')}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Result({ score, title }: { score: number; title: string }) {
  const { t } = useGame();
  return (
    <section
      className={`result ${score >= 80 ? 'success' : ''}`}
      role="status"
      data-testid="round-result"
    >
      <div className="score-seal">
        {score}
        <small>%</small>
      </div>
      <div>
        <h2>{title}</h2>
        <p>{t(score >= 80 ? 'resultGood' : 'resultRetry')}</p>
      </div>
    </section>
  );
}

export function HallHeading({
  hall,
  intro,
  instructions,
}: {
  hall: 'town' | 'mess' | 'social' | 'residential' | 'welfare';
  intro: string;
  instructions: string;
}) {
  const { t } = useGame();
  return (
    <div className="hall-heading">
      <div className="eyebrow">
        <Icon name={hall} /> {t(hall)}
      </div>
      <h1 tabIndex={-1}>{intro}</h1>
      <p>{instructions}</p>
      <span className="caption">{t(hall === 'town' ? 'townCheck' : 'hallCheck')}</span>
    </div>
  );
}
