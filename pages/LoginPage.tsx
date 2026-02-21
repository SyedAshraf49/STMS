import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { MOCK_USERS } from '../data/mockData';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const { login } = useAuth();
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  };

  const copyCredential = (email: string) => {
    setEmail(email);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-900 p-4 flex flex-col items-center justify-center">
      {/* Main Login Card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="card p-8 space-y-8 border border-gray-200 dark:border-gray-700 hover-lift">
          <div className="text-center">
            <div className="inline-block p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full mb-4">
              <span className="text-2xl text-white">📚</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-slide-in-up">
              {t('login.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm animate-slide-in-up stagger-1">
              Student Attendance Management System
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder={t('login.emailPlaceholder')}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('login.passwordLabel') || "Password"}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base font-semibold rounded-lg"
            >
              {t('login.signInButton')}
            </button>
          </form>
        </div>
      </div>

      {/* Demo Credentials Section */}
      <div className="w-full max-w-5xl mt-12 animate-slide-in-up">
        <div className="card p-8 border border-gray-200 dark:border-gray-700 hover-lift">
          <div className="text-center mb-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-slide-in-up">
              🔐 Demo Credentials
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm animate-slide-in-up stagger-1">
              Click any credential to auto-fill the form. Password for all: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-indigo-600 dark:text-indigo-400 font-semibold">password</code>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Admin */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700 animate-slide-in-up stagger-0 hover-lift">
              <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>👤</span> Admin
              </h4>
              <div 
                onClick={() => copyCredential('admin@school.com')}
                className="p-3 hover:bg-purple-200 dark:hover:bg-purple-800/50 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105"
              >
                admin@school.com
              </div>
            </div>

            {/* Teachers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700 animate-slide-in-up stagger-1 hover-lift">
              <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                <span>👨‍🏫</span> Teachers
              </h4>
              <div className="space-y-2">
                {MOCK_USERS.filter(u => u.role === 'teacher').map(u => (
                  <div key={u.id} onClick={() => copyCredential(u.email)} className="p-2 hover:bg-blue-200 dark:hover:bg-blue-800/50 cursor-pointer rounded text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105">
                    {u.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700 animate-slide-in-up stagger-2 hover-lift">
              <h4 className="font-bold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                <span>👨‍🎓</span> Students
              </h4>
              <div className="h-40 overflow-y-auto space-y-2 pr-2">
                {MOCK_USERS.filter(u => u.role === 'student').map((u, i) => (
                  <div key={u.id} onClick={() => copyCredential(u.email)} className="p-2 hover:bg-green-200 dark:hover:bg-green-800/50 cursor-pointer rounded text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105 animate-slide-in-left" style={{animationDelay: `${i * 0.05}s`}}>
                    {u.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Parents */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-4 border border-orange-200 dark:border-orange-700 animate-slide-in-up stagger-3 hover-lift">
              <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                <span>👨‍👩‍👧</span> Parents
              </h4>
              <div className="h-40 overflow-y-auto space-y-2 pr-2">
                {MOCK_USERS.filter(u => u.role === 'parent').map((u, i) => (
                  <div key={u.id} onClick={() => copyCredential(u.email)} className="p-2 hover:bg-orange-200 dark:hover:bg-orange-800/50 cursor-pointer rounded text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105 animate-slide-in-right" style={{animationDelay: `${i * 0.05}s`}}>
                    {u.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;