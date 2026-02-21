import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MenuIcon, LogoutIcon, BellIcon, SunIcon, MoonIcon, GlobeIcon, PaletteIcon } from '../icons';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    
    // In a real app, user notifications would be fetched and managed more robustly
    const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === user?.id);
    const unreadCount = userNotifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
            >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center font-bold">{unreadCount}</span>
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
                    <div className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold flex items-center gap-2">
                        <BellIcon className="h-5 w-5" />
                        {t('header.notifications')}
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                        {userNotifications.length > 0 ? userNotifications.map(notif => (
                            <div key={notif.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notif.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{notif.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{new Date(notif.date).toLocaleString()}</p>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">{t('header.noNotifications')}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1"
            >
                <GlobeIcon className="h-5 w-5" />
                <span className="uppercase text-xs font-bold hidden sm:inline">{language}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        <li>
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); setLanguage('en'); setIsOpen(false); }} 
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              🇬🇧 English
                            </a>
                        </li>
                        <li>
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); setLanguage('ta'); setIsOpen(false); }} 
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              🇮🇳 தமிழ்
                            </a>
                        </li>
                        <li>
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); setLanguage('te'); setIsOpen(false); }} 
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              🇮🇳 తెలుగు
                            </a>
                        </li>
                        <li>
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); setLanguage('ml'); setIsOpen(false); }} 
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              🇮🇳 മലയാളം
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, colorTheme, toggleTheme, toggleColorTheme } = useTheme();
  const { t } = useI18n();
  const colorThemeOrder = ['classic', 'ocean', 'forest', 'sunset'] as const;
  const themeLabels: Record<(typeof colorThemeOrder)[number], string> = {
    classic: 'Classic',
    ocean: 'Ocean',
    forest: 'Forest',
    sunset: 'Sunset',
  };
  const currentThemeIndex = colorThemeOrder.indexOf(colorTheme);
  const nextTheme = colorThemeOrder[(currentThemeIndex + 1) % colorThemeOrder.length];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm animate-slide-in-down">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden transition-colors hover-lift"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">SAMS</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <LanguageSelector />
          <button
            onClick={toggleColorTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover-lift"
            title={`Color theme: ${themeLabels[colorTheme]} · Switch to ${themeLabels[nextTheme]}`}
          >
            <PaletteIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover-lift"
            title="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
          <NotificationBell />
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right">
              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t(`login.roles.${user?.role}`)}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors hover-lift"
              title={t('common.logout')}
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;