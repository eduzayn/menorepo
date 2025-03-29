interface User {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    permissoes?: string[];
    avatar_url?: string;
}
interface AuthCredentials {
    email: string;
    password: string;
}
interface AuthResponse {
    user: User | null;
    error: Error | null;
}
export declare function useAuth(): {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
    signIn: (credentials: AuthCredentials) => Promise<AuthResponse>;
    signOut: () => Promise<boolean>;
    hasPermission: (permission: string) => boolean;
};
export {};
//# sourceMappingURL=useAuth.d.ts.map