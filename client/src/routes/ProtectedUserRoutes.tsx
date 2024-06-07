import { Navigate, Outlet } from "react-router-dom";
import useUserData from "../hooks/useUserData";

const ProtectedUserRoutes = ({ redirectPath = "/" }) => {
    const user = useUserData();

    if (user.role && user.role !== "USER") {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedUserRoutes;
