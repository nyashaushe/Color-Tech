import React from 'react';
interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
}
interface ApiUserResponse {
    id: string;
    email: string;
    role: string;
    fullName?: string;
    first_name?: string;
    last_name?: string;
}
interface AuthResponse {
    token: string;
    user: ApiUserResponse;
    message?: string;
}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}
declare const AuthContext: React.Context<AuthContextType | undefined>;
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const useAuth: () => AuthContextType;
export default AuthContext;
