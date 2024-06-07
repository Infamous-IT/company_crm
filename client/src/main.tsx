
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {ToastContainer} from 'react-toastify';
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {StrictMode} from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
      <StrictMode>
          <BrowserRouter>
              <App />
              <ToastContainer position='top-center' autoClose={2000}/>
          </BrowserRouter>
      </StrictMode>

  </>,
)
