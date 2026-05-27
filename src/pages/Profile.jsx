import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { User, Mail, Phone, Building, Save, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { selectUser, setUser } from '../redux/slices/authSlice';
import { apiFetch, SessionExpiredError } from '../lib/apiFetch';
import { cn } from '../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Profile() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);

  const [form, setForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    mobile:  user?.mobile  || '',
    company: user?.company || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Full name is required'); return; }

    setSaving(true);
    try {
      const response = await apiFetch(`${BACKEND_URL}/api/user`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    form.name.trim(),
          mobile:  form.mobile.trim(),
          company: form.company.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      dispatch(setUser({ user: data.data.user, token: localStorage.getItem('blinkus_token') }));
      toast.success('Profile updated');
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      if (err.name === 'TypeError') {
        toast.error('Cannot connect to server. Please try again.');
      } else {
        toast.error(err.message || 'Something went wrong');
      }
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'name',    label: 'Full Name',     icon: User,     type: 'text',  readOnly: false },
    { name: 'email',   label: 'Email Address', icon: Mail,     type: 'email', readOnly: true  },
    { name: 'mobile',  label: 'Mobile Number', icon: Phone,    type: 'tel',   readOnly: false },
    { name: 'company', label: 'Company',       icon: Building, type: 'text',  readOnly: false },
  ];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold mb-1">Profile</h1>
        <p className="text-black/50 text-sm mb-8">Manage your personal information</p>

        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-black/10 rounded-lg flex items-center justify-center shadow-sm hover:border-accent/30 transition-colors">
                <Camera size={13} />
              </button>
            </div>
            <div>
              <div className="font-bold text-lg">{user?.name || 'Your Name'}</div>
              <div className="text-sm text-black/40">{user?.email}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Account
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {fields.map(({ name, label, icon: Icon, type, readOnly }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={readOnly ? undefined : handleChange}
                    readOnly={readOnly}
                    disabled={saving}
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 outline-none transition-all text-sm',
                      readOnly
                        ? 'bg-black/3 text-black/40 cursor-not-allowed'
                        : 'bg-black/3 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60'
                    )}
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Save size={16} /> Save Changes</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
