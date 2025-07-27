import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import { Component } from "react";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";

 export const router = createBrowserRouter([
    {
      path: "/",
      Component:RootLayout,
      children:[
        {
          index:true,
          Component: Home
        },
      ]
    },

    {
      path: "/",
      Component: AuthLayout,
      children:[
        {
          path: "/login",
          Component: Login,
        },
        {
          path: "/register",
          Component: Register,
        }

      ]



    }
  ]);