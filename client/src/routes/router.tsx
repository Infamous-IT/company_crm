import {createBrowserRouter} from 'react-router-dom';
import Layout from '../pages/Layout.tsx';
import Home from '../pages/Home.tsx';
import Profile from '../pages/Profile.tsx';
import Orders from '../pages/Orders.tsx';
import Customers from '../pages/Customers.tsx';
import Auth from '../pages/Auth.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';


export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout/>,
      children: [
        {
          path: '/',
          index: true,
          element: <Home/>
        },
        {
          path: '/profile',
          element: <Profile/>
        },
        {
          path: '/orders',
          element: <Orders/>
        },
        {
          path: '/customers',
          element: <Customers/>
        },
        {
          path: '/auth',
          element: <Auth/>
        }
      ],
      errorElement: <ErrorPage/>,
    },
  ]
)