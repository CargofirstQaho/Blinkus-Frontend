import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe, TrendingUp, Shield } from 'lucide-react';
import { selectUser } from '../../../redux/slices/authSlice';

const METRICS = [
  { icon: Globe,      label: '180+ markets'          },
  { icon: TrendingUp, label: 'Live commodity pricing' },
  { icon: Shield,     label: 'Compliance intelligence' },
];

export default function HeroBanner() {
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const firstName = user?.name?.split(' ')[0] || 'Trader';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-black mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-72 h-72 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="relative z-10 p-6 md:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/25 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-semibold text-accent tracking-wide">Intelligence Active</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-lg">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-snug">
              {greeting}, {firstName}
            </h1>
            <p className="text-white/50 text-sm md:text-base leading-relaxed">
              Blinkus Intelligence is ready. Ask about commodity prices, HS codes,
              customs duties, freight rates, or supply chain risks — across 180+ global markets.
            </p>
            <div className="flex flex-wrap gap-5 mt-5">
              {METRICS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/35 text-xs font-medium">
                  <Icon size={13} className="text-accent/60" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/chat/new')}
              className="flex items-center gap-2.5 px-5 py-3 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-xl shadow-lg shadow-accent/30 whitespace-nowrap transition-colors"
            >
              <Sparkles size={16} />
              Chat with Blinkus Agent
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
