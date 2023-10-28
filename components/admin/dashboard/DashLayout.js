import { Layout, Menu, Collapse, Avatar } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  BulbOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dashboard, Person } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { FaBullseye } from "react-icons/fa";
import { loadUser, logout } from "@/redux/actions/userActions";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const { Header, Sider } = Layout;
const { SubMenu } = Menu;
const { Panel } = Collapse;

const DashboardSidebar = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out success");
  };

  return (
    <Sider
      theme="light"
      style={{ position: "fixed", top: 0, minHeight: "100vh", zIndex: 100 }}
      collapsible
      collapsed={collapsed}
      trigger={null}
    >
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Menu" key="1">
          <Menu mode="vertical" defaultSelectedKeys={["1"]} theme="light">
            <Menu.Item key="1xx" icon={<HomeOutlined className="mr-2" />}>
              <Link href="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="1x" icon={<DashboardOutlined className="mr-2" />}>
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined className="mr-2" />}>
              <Link href="/dashboard/customers">Customers</Link>
            </Menu.Item>
            <SubMenu key="3" icon={<ProjectOutlined className="mr-2" />} title="Projects">
              <Menu.Item key="3.1" icon={<FaBullseye className="mr-2" />}>
                <Link href="/dashboard/projects/new">Create Project</Link>
              </Menu.Item>
              <Menu.Item key="3.2" icon={<UnorderedListOutlined className="mr-2" />}>
                <Link href="/dashboard/projects">All Projects</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="1" icon={<UnorderedListOutlined className="mr-2" />}>
              <Link href="/dashboard/orders">Orders</Link>
            </Menu.Item>
            <SubMenu
              key="4"
              icon={<BulbOutlined className="mr-2" />}
              title="Light Features"
            >
              <Menu.Item key="4.1" icon={<BulbOutlined className="mr-2" />}>
                <Link href="/admin/feature/light/new">New Light Feature</Link>
              </Menu.Item>
              <Menu.Item key="4.2" icon={<BulbOutlined className="mr-2" />}>
                <Link href="/admin/feature/light/all">All Light Feature</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="5"
              icon={<BulbOutlined className="mr-2" />}
              title="Roofing Features"
            >
              <Menu.Item key="5.1" icon={<BulbOutlined className="mr-2" />}>
                <Link href="/admin/feature/roof/new">New Roof Feature</Link>
              </Menu.Item>
              <Menu.Item key="5.2" icon={<BulbOutlined className="mr-2" />}>
                <Link href="/admin/feature/roof/all">All Roof Feature</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="profile"
              icon={<Avatar src={user?.avatar ? user?.avatar : "/avatar.png"} />}
            >
              <Link href="/user/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item
              key="logout"
              icon={<LogoutOutlined className="mr-2" />}
              onClick={logoutHandler}
            >
              <Link href="#">Logout</Link>
            </Menu.Item>
          </Menu>
        </Panel>
      </Collapse>
    </Sider>
  );
};

const DashboardLayout = ({ children }) => {
  
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

 

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header
          className="bg-white"
          style={{
            position: "fixed",
            padding: 0,
            paddingLeft: collapsed ? "90px" : "205px",
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger z-50 mt-[20px]",
            onClick: toggle,
          })}
        </Header>
        <Layout className={`${collapsed ? "pl-28" : "pl-52"}`}>{children}</Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
