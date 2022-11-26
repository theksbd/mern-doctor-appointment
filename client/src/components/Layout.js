import React, { useState } from "react";
import { RightCircleFilled } from "@ant-design/icons";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, Avatar } from "antd";
import PropTypes from "prop-types";
import { UserOutlined } from "@ant-design/icons";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "ri-notification-2-line",
    },
    // {
    //   name: "Apply Doctor",
    //   path: "/apply-doctor-account",
    //   icon: "ri-notification-2-line",
    // },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-star-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
    {
      name: "Users List",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors List",
      path: "/admin/doctorslist",
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  // const menuToBeRendered = doctorMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div
          className="sidebar"
          style={{ width: `${collapsed ? "120px" : "250px"}` }}
        >
          <div className="collap-icon">
            <RightCircleFilled
              onClick={() => setCollapsed((prev) => !prev)}
              rotate={collapsed ? 0 : 180}
              style={{ fontSize: "2rem", color: "var(--secondaryColor)" }}
            />
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <Link to={menu.path}>
                    <i className={menu.icon}></i>
                    {!collapsed && <span>{menu.name}</span>}
                  </Link>
                </div>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.clear();
              }}
            >
              <Link to={"/login"}>
                <i className="ri-logout-circle-line"></i>
                {!collapsed && <span>Logout</span>}
              </Link>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header justify-content-end">
            <div className="d-flex align-items-center">

              <Avatar
              gap={8}
              draggable
              style={{ backgroundColor: "var(--primaryColor)" }}
              icon={<UserOutlined />}
            />
            <Link className="anchor mx-2" to="/profile">
              {user?.name}
            </Link>
            <Badge
                count={user?.unseenNotifications.length} // Notification count
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>
            </div>

          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node,
};
export default Layout;
