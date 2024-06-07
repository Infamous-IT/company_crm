import {useEffect, useState} from 'react';
import {Layout, Menu, MenuProps, theme} from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import {
  BookOutlined,
  HomeOutlined, LoginOutlined, SettingOutlined, TagOutlined,
  TagsOutlined,
  TeamOutlined, UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useUserData from "../hooks/useUserData.tsx";
import {useNavigate} from "react-router-dom";


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    target: string,
    icon?: React.ReactNode,
    children?: MenuItem[]
) {
  return {
    key,
    icon,
    target,
    children,
    label,
  };
}

const userItems = [
  getItem("Home", "1", "/", <HomeOutlined />),
  getItem("My profile", "2", "/user", <UserOutlined />),
  getItem("My orders", "3", "/order-list", <TeamOutlined />),
  getItem("My customers book", "4", "/customer-list", <BookOutlined />),
  getItem("My tags", "5", "/tags-list", <TagOutlined />),
  getItem("Settings", "6", "/settings", <SettingOutlined />)
];

const adminItems = [
  getItem("Home", "1", "/", <HomeOutlined />),
  getItem("List of users", "2", "/user-list", <UserOutlined />),
  getItem("List of customers", "3", "/customer-list", <BookOutlined />),
  getItem("List of orders", "4", "/order-list", <TeamOutlined />),
  getItem("List of tags", "5", "/tags-list", <TagsOutlined />),
  getItem("Settings", "6", "/settings", <SettingOutlined />)
];

const unauthorizedItems = [
  getItem("Home", "1", "/", <HomeOutlined />),
  getItem("Registration", "2", "/auth",  <UserAddOutlined />),
  getItem("Login", "3", "/auth/sign-in",  <LoginOutlined />),
];

const WrapperMenu = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = useUserData();
  const [collapsed, setCollapsed] = useState(false);
  const [i, setI] = useState(unauthorizedItems);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (user) {
      const isAdmin = user.role === "ADMIN";
      const isUser = user.role === "USER";

      setI(isAdmin ? adminItems : isUser ? userItems : unauthorizedItems);
    }
  }, [user]);

  const handleMenuClick = (event: MenuInfo) => {
    const { target } = i.find((item) => item?.key === event.key) || {};
    if (target) {
      navigate(target);
    }
  };

  return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
          {/*<Image src={logo} alt="logo" preview={false} />*/}
          <Menu
              theme="dark"
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={i}
              onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "16px 16px" }}>
            <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Copyright ©{new Date().getFullYear()} created by Nazar Hlukhaniuk
          </Footer>
        </Layout>
      </Layout>
  );
};

export default WrapperMenu;
