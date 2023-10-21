import React, { useState, useRef,useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Divider } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const { Header } = Layout;

const Topbar = () => {
  const Router = useRouter();
  const menuRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 useEffect(() => {
   const handleClickOutside = (event) => {
     if (menuRef.current && !menuRef.current.contains(event.target)) {
       setIsMenuOpen(false);
     }
   };

   document.addEventListener("mousedown", handleClickOutside);

   return () => {
     document.removeEventListener("mousedown", handleClickOutside);
   };
 }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
const logout=()=>{
  toast.success("logged out")
}
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => Router.push("/user/profile")}
        key="1"
        icon={<UserOutlined />}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        onClick={() => Router.push("/settings")}
        key="2"
        icon={<SettingOutlined />}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => logout()}
        icon={<LogoutOutlined />}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="bg-white p-2 md:p-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => Router.push("/")}
        >
          <span className="text-2xl md:text-5xl font-bold text-gray-900">
            <span className="text-3xl md:text-6xl text-green-500">K</span>aya
          </span>
        </div>
        <div>
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Avatar size="lg" src="/avatar.png" />
          </Dropdown>
          <span className="text-gray-900 cursor-pointer" onClick={toggleMenu}>
            WelcomeHomes <FiChevronDown className="inline" />
          </span>
        </div>
      </Header>
      {isMenuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: "8%", // Adjust the position as needed
            right: 35,
            zIndex: 10, // Adjust the position as needed
          }}
        >
          {menu}
        </div>
      )}
      <Divider className=" bg-green-400" />
    </>
  );
};

export default Topbar;