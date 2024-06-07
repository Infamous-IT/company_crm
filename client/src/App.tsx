import Routes from "./routes/router.tsx";
import {ProvideAuth} from "./hooks/useAuth.tsx";
import {UserDataProvider} from "./hooks/useUserData.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

function App() {


  return (
      <div className='App'>
          <GoogleOAuthProvider clientId='39695705763-p65vdma0hhhl9fmejcptt0jkmtsqiv1h.apps.googleusercontent.com'>
              <ProvideAuth>
                  <UserDataProvider>
                      <Routes />
                  </UserDataProvider>
              </ProvideAuth>
          </GoogleOAuthProvider>
      </div>
  )
}

export default App
