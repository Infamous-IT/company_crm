import React, {createContext, useContext} from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/StorageService";

interface AuthContextProps {
    accessToken?: string | null;
    signIn: (access_token: string, isGoogleAuth?: boolean) => void;
    singOut: () => void;
}

const authContext = createContext<AuthContextProps>({} as AuthContextProps);

function useProvideAuth() {
    const navigate = useNavigate();

    const signIn = (access_token: string) => {
        if (access_token) {
            AuthService.setItem("token", access_token);
            navigate("/", { replace: true });
        }
    };

    const singOut = () => {
        AuthService.removeItem("token");
        navigate("/", { replace: true });
    };

    return {
        accessToken: AuthService.getItem("token"),
        signIn,
        singOut,
    };
}

export function ProvideAuth({ children }: { children: React.ReactNode }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};
