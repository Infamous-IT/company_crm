import axios, { type AxiosRequestHeaders } from "axios";
import type {
    IUserData,
    IResponseUser,
    OrderProps,
    CustomerProps,
    EditCustomerProps,
    EditOrderProps,
    EditTagProps,
    IResponseUserData,
    IUser,
    EditUserProps,
    TagProps,
    SignIn,
    SignUp
} from '../types/types.ts';
import { useAuth } from "./useAuth";

export default function useApi() {
    const auth = useAuth();

    const axiosRequest = async <T>(
        method: string,
        uri: string,
        data?: T,
        headers?: AxiosRequestHeaders
    ) => {
        const token = auth.accessToken;

        try {
            const params = method === "GET" ? data : null;
            const body = method !== "GET" ? data : null;

            return await axios(`http://localhost:3000/${uri}`, {
                method,
                params,
                data: body,
                headers: { ...headers, Authorization: `Bearer ${token}` },
            });
        } catch (e) {
            if (e?.response?.status === 401 && token) {
                auth.singOut();
            }
            throw e;
        }
    };

    return {
        register: ({ email, password, role, firstName, lastName }: SignUp) =>
            axiosRequest<SignUp>("POST", "auth/register", {
                email,
                password,
                role,
                firstName,
                lastName,
            }),
        login: ({ email, password }: SignIn) =>
            axiosRequest<SignIn>("POST", "auth/login", { email, password }).then(
                ({ data }) => data
            ),
        logout: () =>
            axiosRequest("POST", "auth/logout").then(({data}) => data),
        getCurrentUser: () => axiosRequest("GET", `users/current`).then(({ data }) => data),
        googleLogin: ({token}: {token: string}) => axiosRequest("POST", "auth/google-login", {token}).then(({data}) => data),
        editProfile: ({id, firstName, lastName, email, income, costs}: EditUserProps) =>
            axiosRequest("PATCH", `users/user/${id}`, {id, firstName, lastName, email, income, costs})
                .then(({data}) => data),
        fetchOrderList: () => axiosRequest("GET", 'orders').then(({data}) => data),
        fetchCustomerList: () => axiosRequest("GET", 'customers').then(({data}) => data),
        // createProcedure: ({id, title, description, duration, startDate}: ProcedureProps) => axiosRequest("POST", `procedures/${id}`, {id, title, description, duration, startDate}).then(({data}) => data),
        // getProceduresByOwner: async ({ id }: { id: string }) => {
        //     const response = await axiosRequest("GET", `procedures/${id}`, { id });
        //     return response.data;
        // },
        // removeProcedure: (procedureId: string) => axiosRequest("DELETE", `procedures/procedure/${procedureId}`).then(({data}) => data),
        // updateProcedure: (procedureId: string, procedureData: EditProcedureProps) =>
        //     axiosRequest("PATCH", `procedures/procedure/${procedureId}`, procedureData).then(({ data }) => data),
    }
}