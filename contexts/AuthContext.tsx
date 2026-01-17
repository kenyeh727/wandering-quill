import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Check for specific OAuth errors in URL
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const error_description = params.get('error_description');
        if (error && error_description) {
            console.error("OAuth Error detected:", error, error_description);
            alert(`Login/Auth Error: ${error_description}`);
        }

        return () => subscription.unsubscribe();
    }, []);

    const login = async () => {
        try {
            // Ensure we redirect back to the current page (or root/base path)
            const redirectTo = window.location.origin + window.location.pathname;
            console.log("AuthContext: Redirecting to:", redirectTo);
            // DEBUG: Ensure no trailing slash issues or double path
            console.log("Current Origin:", window.location.origin);
            console.log("Current Pathname:", window.location.pathname);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectTo,
                    queryParams: { prompt: 'select_account' }
                }
            });
            if (error) {
                console.error("Supabase Auth Error:", error);
                alert(`Login failed: ${error.message}`);
                throw error;
            }
        } catch (err) {
            console.error("Catch block error:", err);
            alert("An unexpected error occurred during login.");
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, session, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
