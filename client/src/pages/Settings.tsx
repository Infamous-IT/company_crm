import {FC} from "react";
import {Button} from "antd";
import {useAuth} from "../hooks/useAuth.tsx";
import useApi from "../hooks/useApi.ts";


const Settings: FC = () => {
    const api = useApi();
    const auth = useAuth();
    const handleLogout = async () => {
        await api.logout();
        auth.singOut();
        window.location.href = "/";
    }

    return (
        <div>
            <h1>Settings</h1>
            <div style={{marginTop: 10}}>
                <Button danger htmlType="submit" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default Settings;
