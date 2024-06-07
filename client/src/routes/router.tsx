import { Route, Routes } from "react-router-dom";
import Layout from '../pages/Layout.tsx';
import HomePage from '../pages/HomePage.tsx';
import Auth from '../pages/Auth.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';
import ProtectedAdminRoutes from "./ProtectedAdminRoutes.tsx";
import ProtectedUserRoutes from "./ProtectedUserRoutes.tsx";
import SignIn from "../pages/SignIn.tsx";
import UserList from "../components/users/UserList.tsx";
import User from "../components/users/User.tsx";
import CustomerList from "../components/customers/CustomerList.tsx";
import TagList from "../components/tags/TagList.tsx";
import OrderList from "../components/orders/OrderList.tsx";
import Settings from "../pages/Settings.tsx";


export const Index = () => {
  return (
      <Routes>
        <Route element={<Layout />}>
          {/*Thinking how I can change url and component name for admin and user, because now, it's work incorrect*/}
          <Route element={<ProtectedAdminRoutes />}>
            <Route path="/customer-list" element={<CustomerList />} />
            <Route path="/tags-list" element={<TagList />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/settings" element={<Settings/>}/>
            {/* Added delete, update, getById for User, Customer, Tag, Order */}
          </Route>
          <Route element={<ProtectedUserRoutes />}>
            <Route path="/user" element={<User />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/tags-list" element={<TagList />} />
            <Route path="/customer-list" element={<CustomerList />} />
            <Route path="/settings" element={<Settings/>}/>
            {/* Added delete, update, getById, create for User, Customer, Tag, Order */}
          </Route>

          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Routes>
  );
};

export default Index;