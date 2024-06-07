import { Navigate, Outlet } from "react-router-dom";
import useUserData from "../hooks/useUserData";

const ProtectedAdminRoutes = ({  redirectPath = "/" }) => {
    const user = useUserData();

    if (user.role && user.role !== 'ADMIN') {
        return <Navigate to={redirectPath} replace/>
    }

    return <Outlet/>
}

export default ProtectedAdminRoutes;