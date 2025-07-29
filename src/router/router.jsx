import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import PostDetails from "../Pages/PostDetails/PostDetails";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import CreatePost from "../Pages/CreatePost";
import Dashboard from "../Pages/Dashboard";
import Payment from "../Payment/Payment";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import AdminLayout from "../Layouts/AdminLayout";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminUsers from "../Pages/Admin/AdminUsers";
import AdminReports from "../Pages/Admin/AdminReports";
import AdminAnnouncements from "../Pages/Admin/AdminAnnouncements";
import AdminTags from "../Pages/Admin/AdminTags";
import AdminRoute from "../components/AdminRoute/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/post/:id",
        Component: PostDetails,
      },
      {
        path: "/create-post",
        element: <CreatePost />,
      },
      {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: "/membership",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "reports",
        element: <AdminReports />,
      },
      {
        path: "announcements",
        element: <AdminAnnouncements />,
      },
      {
        path: "tags",
        element: <AdminTags />,
      },
    ],
  },
]);
