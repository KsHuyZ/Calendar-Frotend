import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import AuthProvider from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "./ErrorPage";
import Header from "../components/Header/Header";
import SideBar from "../components/SideBar/SideBar";
import Dashboard from "../pages/DashBoard/Dashboard";
import { useState } from "react";
import VideoChat from "../components/VideoChat/VideoChat";
import Profile from "../pages/Profile/Profile";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const SettingsLayout = () => {
  const NAV__LINKS = [
    {
      display: "Profile",
      url: "/settings/profile",
    },
    {
      display: "Change password",
      url: "/settings/change-password",
    },
  ];
  return (
    <div className="profile-section">
      <div className="profile">
        <div className="settings">
          <div className="setting-header">
            <div className="heading">
              <h2>Settings</h2>
            </div>
          </div>
        </div>
        <div className="profile-main">
          <div className="profile-left">
            <div className="navbar">
              {NAV__LINKS.map((item, index) => (
                <NavLink
                  key={index}
                  className={(navClass) =>
                    `item ${navClass.isActive ? "active" : ""}`
                  }
                  to={item.url}
                >
                  <div className="title-item">{item.display}</div>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="profile-right">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashBoardLayout = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div style={{ padding: "0 20px" }}>
      <SideBar show={showSideBar} close={() => setShowSideBar(false)} />
      <Header show={showSideBar} openSideBar={() => setShowSideBar(true)} />
      <Outlet />
    </div>
  );
};

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashBoardLayout />,
            children: [
              {
                element: <Dashboard />,
                path: "/",
              },
              {
                element: <VideoChat />,
                path: "/video-chat/:channelName",
              },
              {
                element: <Home />,
                path: "/:id",
              },
              {
                element: <Home />,
                path: "/:id/:year/:month/:day",
              },
              {
                element: <SettingsLayout />,
                path: "/settings",
                children: [
                  {
                    element: <Profile />,
                    path: "/settings/profile"
                  },
                  {
                    element: <ChangePassword />,
                    path: "/settings/change-password"
                  }
                ]
              },
            ],
          },
        ],
      },
    ],
  },
]);
