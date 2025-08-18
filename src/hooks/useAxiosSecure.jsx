// import axios from 'axios';
// import React from 'react';
// import useAuth from './useAuth';
// import { Navigate, useNavigate } from 'react-router';

// const axiosSecure = axios.create({
//     baseURL: `https://qcktlk.vercel.app`
// });

// const  useAxiosSecure= () => {
//     const { user,logOut } = useAuth();

//     axiosSecure.interceptors.request.use(config => {
//         config.headers.Authorization = `Bearer ${user.accessToken}`
//         return config;
//     }, error => {
//         return Promise.reject(error);
//     })
//     return axiosSecure;
// };

// export default useAxiosSecure;

// import axios from 'axios';
// import { useEffect } from 'react';
// import useAuth from './useAuth';

// const axiosSecure = axios.create({
//   baseURL: `https://qcktlk.vercel.app`, // your backend
// });

// const useAxiosSecure = () => {
//   const { user } = useAuth();

//   useEffect(() => {
//     const setTokenInterceptor = async () => {
//       axiosSecure.interceptors.request.use(
//         async (config) => {
//           if (user) {
//             const token = await user.getIdToken(); // ✅ fetch valid Firebase token
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//           return config;
//         },
//         (error) => {
//           return Promise.reject(error);
//         }
//       );
//     };

//     setTokenInterceptor();
//   }, [user]);

//   return axiosSecure;
// };

// export default useAxiosSecure;
