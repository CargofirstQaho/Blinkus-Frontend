import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Sparkles, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

const MODELS = [
  {
    id: 'v1',
    label: 'Blinkus Agent V1',
    desc: 'Fast, reliable answers for everyday trade queries.',
    status: 'default',
  },
  {
    id: 'v2',
    label: 'Blinkus Agent V2',
    desc: 'Deeper reasoning and broader trade context.',
    status: 'coming-soon',
  },
];

export default function ModelSelectDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('v1');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = MODELS.find((m) => m.id === selected);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select AI model"
        className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 rounded-lg border border-black/10 bg-white hover:bg-black/3 transition-colors text-xs font-semibold text-black/70 shrink-0"
      >
        <Sparkles size={14} className="text-accent shrink-0 sm:w-3 sm:h-3" />
        <span className="hidden sm:inline truncate">{current.label}</span>
        <ChevronDown
          size={12}
          className={cn('text-black/40 transition-transform duration-200 shrink-0', open && 'rotate-180')}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          role="listbox"
          className="absolute right-0 bottom-full mb-2 w-[260px] sm:w-72 bg-white rounded-2xl border border-black/5 shadow-xl shadow-black/8 py-1.5 z-50"
        >
          {MODELS.map((model) => {
            const isSelected = model.id === selected;
            const isComingSoon = model.status === 'coming-soon';

            return (
              <button
                key={model.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={isComingSoon}
                onClick={() => {
                  if (isComingSoon) return;
                  setSelected(model.id);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors',
                  isComingSoon ? 'cursor-not-allowed opacity-60' : 'hover:bg-black/3'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
                    isSelected ? 'border-accent' : 'border-black/20'
                  )}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-accent" />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-black/80">{model.label}</span>
                    {isComingSoon && (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
                        <Lock size={8} />
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-black/40 mt-0.5 leading-snug">{model.desc}</p>
                </div>
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
