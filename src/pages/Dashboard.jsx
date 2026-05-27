import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Zap, ArrowRight, BarChart3, Shield, Plus, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { setConversations, selectConversations } from '../redux/slices/chatSlice';
import { apiFetch, SessionExpiredError } from '../lib/apiFetch';
import HeroBanner from '../components/dashboard/banner/HeroBanner';
import Spinner from '../components/ui/Spinner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const QUICK_ACTIONS = [
  { label: 'Ask Trade Agent', icon: MessageSquare, href: '/chat/new', desc: 'Get AI-powered trade insights' },
  { label: 'Market Analysis', icon: BarChart3,     href: '/chat/new', desc: 'Analyze commodity benchmarks'  },
  { label: 'Risk Assessment', icon: Shield,        href: '/chat/new', desc: 'Check route and partner risk'  },
  { label: 'HS Code Lookup',  icon: Zap,           href: '/chat/new', desc: 'Classify your products fast'   },
];

export default function Dashboard() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const conversations = useSelector(selectConversations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const res  = await apiFetch(`${BACKEND_URL}/api/chat/conversations`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Failed to load conversations');
        dispatch(setConversations(data.data.conversations));
      } catch (err) {
        if (err instanceof SessionExpiredError) return;
        if (err.name === 'TypeError') {
          toast.error('Cannot connect to server. Please try again.');
        } else {
          toast.error(err.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <HeroBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-black/5 flex items-center justify-between">
              <h2 className="font-display font-bold">Quick Actions</h2>
              <button
                type="button"
                onClick={() => navigate('/chat/new')}
                className="flex items-center gap-1.5 text-accent text-sm font-semibold hover:underline"
              >
                <Plus size={14} /> New Chat
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-5">
              {QUICK_ACTIONS.map(({ label, icon: Icon, href, desc }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(href)}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-black/5 hover:border-accent/30 hover:bg-accent/3 transition-all text-left group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs text-black/40 mt-0.5 leading-snug">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-display font-bold">Recent Chats</h2>
            <Clock size={16} className="text-black/30" />
          </div>
          <div className="p-3">
            {loading ? (
              <div className="flex justify-center py-8"><Spinner size="sm" /></div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 sm:py-10 px-4">
                <MessageSquare size={32} className="text-black/10 mx-auto mb-3" />
                <p className="text-sm font-medium text-black/40">No conversations yet</p>
                <button
                  type="button"
                  onClick={() => navigate('/chat/new')}
                  className="mt-4 text-accent text-sm font-semibold hover:underline flex items-center gap-1 mx-auto"
                >
                  Start your first chat <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.slice(0, 8).map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => navigate(`/chat/${c._id}`)}
                    className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-black/3 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.title || 'Untitled Chat'}</div>
                      <div className="text-xs text-black/30 truncate">{c.lastMessage || 'No messages'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
