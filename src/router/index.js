import { createBrowserRouter, Outlet } from "react-router-dom";
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
import Todo from "../pages/Todo/Todo";
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
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
                element: <Todo />,
                path: "/todo",
              },
            ],
          },
        ],
      },
    ],
  },
]);
