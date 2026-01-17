import React from 'react';
import { Feather, Flame, Trash2, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../translations';

interface NavbarProps {
    onBrandClick: () => void;
    currentStepIndex: number;
    onReset: () => void;
    language: string;
    onLanguageChange: (lang: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    onBrandClick,
    currentStepIndex,
    onReset,
    language,
    onLanguageChange
}) => {
    const { user, login, logout } = useAuth();
    const t = translations[language as keyof typeof translations] || translations['American English'];

    return (
        <nav className="sticky top-0 z-50 bg-[#fdf6e3]/95 backdrop-blur-sm border-b border-[#c5a059] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={onBrandClick}>
                    <div className="w-10 h-10 rounded-lg bg-[#2b5876] flex items-center justify-center shadow-lg border-2 border-[#c5a059]">
                        <Feather className="w-6 h-6 text-[#fdf6e3]" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-[#2b5876] tracking-tight hidden sm:block">{t.brand}</h1>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    {/* Status & Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {currentStepIndex > 0 && (
                            <button
                                onClick={onReset}
                                className="flex items-center gap-2 text-xs font-bold text-[#c0392b] hover:bg-[#fff0f0] px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-[#ff6b6b]/30"
                                title={t.discardNew}
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden lg:inline uppercase tracking-wider">{t.newQuest}</span>
                            </button>
                        )}

                        <div className="flex items-center gap-2 px-2 py-1 bg-[#fffdf5] rounded-full border border-[#c5a059] shadow-inner">
                            <Flame className="w-3 h-3 text-[#ff6b6b] ml-1" />
                            <select
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value)}
                                className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-[#637b89] outline-none cursor-pointer pr-1"
                            >
                                <option value="Traditional Chinese (繁體中文)">繁中</option>
                                <option value="American English">EN</option>
                            </select>
                        </div>
                    </div>


                    {/* Auth Section */}
                    <div className="flex items-center border-l border-[#c5a059] pl-3 md:pl-6 gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[10px] uppercase tracking-tighter text-[#637b89] font-bold">{t.explorer}</span>
                                    <span className="text-xs font-medium text-[#2b5876] max-w-[150px] truncate">{user.email}</span>
                                </div>
                                <button
                                    onClick={() => logout()}
                                    className="p-2.5 rounded-full bg-[#fffdf5] border border-[#c5a059] text-[#2b5876] hover:bg-[#2b5876] hover:text-white transition-all shadow-sm group"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => login()}
                                className="flex items-center gap-2 bg-[#2b5876] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#1a3a52] transition-all transform hover:-translate-y-0.5"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>{t.login}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
