import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import { Component } from "react";
import Home from "../Pages/Home/Home";
import PostDetails from "../Pages/PostDetails/PostDetails";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import CreatePost from "../Pages/CreatePost";
import Dashboard from "../Pages/Dashboard";
import Payment from "../Payment/Payment";

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
        element: <Dashboard />,
      },
      {
        path: "/membership",
        element: <Payment />,
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
]);
