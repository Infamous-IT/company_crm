import React, { createContext, useContext, useEffect, useState } from "react";

import useApi from "./useApi.ts";
import { useAuth } from "./useAuth.tsx";
import {OrderProps, TagProps, CustomerProps} from "../types/types.ts";

interface UserProps {
    photoUrl?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    id?: string;
    role?: string;
    income?: number;
    costs?: number;
    orders?: OrderProps[];
    tags?: TagProps[];
    customers?: CustomerProps[];
}

const userDataContext = createContext<UserProps>({});

export const UserDataProvider = ({ children }: { children: React.ReactNode; }) => {
    const [userData, setUserData] = useState<UserProps>({});

    const auth = useAuth();
    const api = useApi();

    const getUser = async () => {
        const user = await api.getCurrentUser();
        console.log(user);
        setUserData(user.currentUser);
    };

    useEffect(() => {
        if (auth.accessToken) {
            getUser();
        }
    }, [auth.accessToken]);

    if (auth.accessToken && !userData) {
        return <div>Loading...</div>;
    }

    return (
        <userDataContext.Provider value={userData}>
            {children}
        </userDataContext.Provider>
    );
};

export default function useUserData() {
    return useContext(userDataContext);
}

