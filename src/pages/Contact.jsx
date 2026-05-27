import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll be in touch within 24 hours.');
    setForm({ name: '', email: '', company: '', message: '' });
    setSending(false);
  };

  const INFO = [
    { icon: Mail,   label: 'Email',    value: 'hello@blinkus.io' },
    { icon: Phone,  label: 'Phone',    value: '+1 (415) 555-0198' },
    { icon: MapPin, label: 'HQ',       value: 'San Francisco, CA' },
  ];

  return (
    <div className="pt-24">
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mt-4 mb-4">Contact Us</h1>
          <p className="text-black/50 text-lg max-w-md mx-auto">
            Have a question or ready to scale your trade operations? Let's talk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="space-y-6 mb-12">
              {INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black/40 uppercase tracking-wider">{label}</div>
                    <div className="font-semibold mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card bg-black text-white border-0">
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Enterprise Sales</div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Looking for custom integrations, volume pricing, or a dedicated trade intelligence team?
              </p>
              <button className="text-accent text-sm font-bold flex items-center gap-2 hover:underline">
                Book a Demo <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card space-y-5">
            {[
              { name: 'name',    label: 'Full Name *',   type: 'text',  placeholder: 'John Smith'        },
              { name: 'email',   label: 'Email *',        type: 'email', placeholder: 'you@company.com'   },
              { name: 'company', label: 'Company',        type: 'text',  placeholder: 'Your company name' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1.5">{label}</label>
                <input
                  type={type} name={name} value={form[name]} onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold mb-1.5">Message *</label>
              <textarea
                name="message" value={form.message} onChange={handleChange} rows={5}
                placeholder="Tell us about your trade operations and what you're looking for..."
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none"
              />
            </div>
            <button
              type="submit" disabled={sending}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Send Message <ArrowRight size={18} /></>
              }
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
