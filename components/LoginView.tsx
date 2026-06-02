// src/components/auth/LoginView.tsx
import React, { useState } from 'react';
import { ArrowDownLeft, Phone, Lock } from 'lucide-react';
import { User } from '../types';
import { Card, Input, Button } from './ui';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LOGO } from '../constants';

interface LoginViewProps {
  setUser: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ setUser }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data } = await api.post('/login', { phone, password });
      const token = data.access_token;
      localStorage.setItem('token', token);

      const meResponse = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(meResponse.data);
      if (meResponse.data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          'Identifiants incorrects ou compte non activé.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-[url('https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 text-sm sm:text-base"
      >
        <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
        Retour
      </button>

      <Card className="w-full max-w-md relative z-10 border-t-4 border-t-blue-500">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <img src={LOGO} alt="NovaTrust" className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Connexion</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Accédez à votre tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
              Numéro de téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Ex: +237 690 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={isProcessing}>
            Se Connecter
          </Button>
        </form>

        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-center text-slate-500">
          Pas de compte ?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-400 underline cursor-pointer"
          >
            Inscrivez-vous
          </span>
        </p>
      </Card>
    </div>
  );
};

export default LoginView;