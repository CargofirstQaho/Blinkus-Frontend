import { motion } from 'motion/react';
import { Globe, Users, TrendingUp, Shield } from 'lucide-react';

const TEAM = [
  { name: 'Arjun Mehra',    role: 'CEO & Co-founder',     initial: 'A' },
  { name: 'Priya Sharma',   role: 'CTO & Co-founder',     initial: 'P' },
  { name: 'Marcus Chen',    role: 'Head of AI Research',  initial: 'M' },
  { name: 'Sofia Rossi',    role: 'VP of Trade Strategy', initial: 'S' },
];

const VALUES = [
  { icon: Globe,     label: 'Global First',    desc: 'Built for traders operating across borders, time zones, and jurisdictions.' },
  { icon: Users,     label: 'Trader-Centric',  desc: 'Every feature is designed based on feedback from real global trading desks.' },
  { icon: TrendingUp, label: 'Data Integrity', desc: 'Our AI is trained on verified customs, BL, and market data — not synthetic noise.' },
  { icon: Shield,    label: 'Trust by Design', desc: 'Security, compliance, and data sovereignty built into every layer.' },
];

export default function About() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mt-4 mb-8 leading-tight">
            Built for the <br /><span className="text-accent italic">Modern Trader.</span>
          </h1>
          <p className="text-xl text-black/60 max-w-2xl mx-auto leading-relaxed">
            Blinkus was founded by a group of ex-traders and AI engineers frustrated by fragmented,
            outdated tools in global trade. We set out to build the intelligence layer the industry deserved.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-black/3">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['2022', 'Founded'], ['1,200+', 'Trading Firms'], ['$4.2B', 'Trade Processed'], ['6', 'Global Offices']].map(([val, label]) => (
            <div key={label}>
              <div className="text-4xl font-display font-bold text-accent">{val}</div>
              <div className="text-sm text-black/50 mt-2 uppercase tracking-widest font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-4xl font-display font-bold text-center mb-16">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass-card flex gap-5">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{label}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-4xl font-display font-bold text-center mb-16">Leadership Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map(({ name, role, initial }) => (
            <div key={name} className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-3xl font-bold mx-auto mb-4">
                {initial}
              </div>
              <div className="font-bold text-sm">{name}</div>
              <div className="text-xs text-black/40 mt-1">{role}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
