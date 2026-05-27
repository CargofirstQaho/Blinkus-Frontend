import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { cn } from '../../../lib/utils';

/**
 * Reusable sidebar group wrapper.
 * Supports optional visible label, optional collapsible accordion, and
 * badge / icon on the section header.
 *
 * Usage (scalable — add any nav items as children):
 *   <SidebarSection label="Analytics" collapsible>
 *     <NavItem ... />
 *   </SidebarSection>
 */
export default function SidebarSection({
  label,
  collapsible = false,
  defaultOpen = true,
  className,
  children,
}) {
  const { isCollapsed, isMobile } = useSidebar();
  const [open, setOpen] = useState(defaultOpen);
  const showText = !isCollapsed || isMobile;

  return (
    <div className={cn('mt-1', className)}>
      {label && showText && (
        <button
          type="button"
          onClick={() => collapsible && setOpen((o) => !o)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-1 text-[10px] font-bold text-black/25 uppercase tracking-[0.1em] select-none',
            collapsible ? 'hover:text-black/50 cursor-pointer transition-colors' : 'cursor-default'
          )}
        >
          <span className="flex-1 text-left">{label}</span>
          {collapsible && (
            <ChevronDown
              size={10}
              className={cn('transition-transform duration-200', open && 'rotate-180')}
            />
          )}
        </button>
      )}

      {collapsible ? (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="section-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5 py-0.5">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="space-y-0.5 py-0.5">{children}</div>
      )}
    </div>
  );
}
