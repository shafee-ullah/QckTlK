import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import PostDetails from "../Pages/PostDetails/PostDetails";
import EventDetails from "../Pages/EventDetails/EventDetails";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import CreatePost from "../Pages/CreatePost";
import Dashboard from "../Pages/Dashboard";
import Payment from "../Payment/Payment";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import AboutUs from "../Pages/LegalPages/AboutUs";
import Contact from "../Pages/LegalPages/Contact";
import PrivacyPolicy from "../Pages/LegalPages/PrivacyPolicy";
import TermsOfService from "../Pages/LegalPages/TermsOfService";
import CookiePolicy from "../Pages/LegalPages/CookiePolicy";
import BecomeMember from "../Pages/BecomeMember";

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
        path: "/events/:id",
        Component: EventDetails,
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
      // Legal Pages
      {
        path: "/become-member",
        element: <BecomeMember />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/cookies",
        element: <CookiePolicy />,
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
]);
