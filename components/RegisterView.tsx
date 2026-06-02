// src/components/auth/RegisterView.tsx
import React, { useState } from 'react';
import { ArrowDownLeft, Phone, Lock, User as UserIcon, Mail } from 'lucide-react';
import { User } from '../types';
import { Card, Input, Button } from './ui';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LOGO } from '../constants';

interface RegisterViewProps {
  setUser: (user: User) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ setUser }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data } = await api.post('/register', {
        phone,
        name: name || undefined,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const token = data.access_token;
      localStorage.setItem('token', token);

      const meResponse = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(meResponse.data);
      navigate('/app/dashboard');
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Erreur lors de l'inscription. Veuillez réessayer."
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

      <Card className="w-full max-w-md relative z-10 border-t-4 border-t-blue-500 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <img src={LOGO} alt="NovaTrust" className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Inscription</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Créez votre compte pour commencer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
              Nom (optionnel)
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
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
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={isProcessing}>
            S'inscrire
          </Button>
        </form>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-center text-slate-500">
          Déjà inscrit ?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-400 underline cursor-pointer"
          >
            Connectez-vous
          </span>
        </p>
      </Card>
    </div>
  );
};

export default RegisterView;