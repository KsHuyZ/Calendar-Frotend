import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login/Login";
import App from "../App";
import Home from "../pages/Home/Home";
import AuthProvider from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "./ErrorPage";
import Header from "../components/Header/Header";
import SideBar from "../components/SideBar/SideBar";
import Dashboard from "../pages/DashBoard/Dashboard";
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const DashBoardLayout = () => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ width: "15%" }}>
          <SideBar />
        </div>

        <div style={{ width: "85%" }}>
          <Header />
          <Outlet />
        </div>
      </div>
    </>
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
                element: <Home />,
                path: "/:id",
              },
            ],
          },
        ],
      },
    ],
  },
]);
