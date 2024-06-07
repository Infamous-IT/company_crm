import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/StorageService";

interface AuthContextProps {
    access_token?: string;
    signIn: (access_token?: string | undefined, role?: string) => void;
    singOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

function useProvideAuth() {
    const navigate = useNavigate();

    const signIn = (access_token?: string, role?: string) => {
        if (access_token && role) {
            AuthService.setItem("token", access_token);
            AuthService.setItem("role", role);
            navigate("/user", { replace: true });
        }
    };

    const singOut = () => {
        AuthService.removeItem("token");
        AuthService.removeItem("role");
        navigate("/login", { replace: true });
    };

    return {
        accessToken: AuthService.getItem("token"),
        role: AuthService.getItem("role"),
        signIn,
        singOut,
    };
}

export const Provide = ({ children }: { children: React.ReactNode }) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth!}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
