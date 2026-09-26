import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@makereregadgets.ug');
  const [password, setPassword] = useState('makerere2026');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(email, password);
    if (success) {
      showToast('Logged in to Admin Dashboard successfully');
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid admin credentials. Use admin@makereregadgets.ug / makerere2026');
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@makereregadgets.ug');
    setPassword('makerere2026');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">Admin Portal</h3>
              <p className="text-[11px] text-slate-500">Makerere Gadgets Hub Staff</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
            />
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex flex-col gap-1">
            <div className="font-semibold text-slate-800">Pre-configured Admin Access:</div>
            <div className="flex justify-between items-center text-slate-500 font-mono">
              <span>admin@makereregadgets.ug</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-left text-sky-600 font-semibold hover:underline mt-0.5"
            >
              Fill Default Credentials
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>LOGIN TO DASHBOARD</span>
          </button>
        </form>
      </div>
    </div>
  );
};
