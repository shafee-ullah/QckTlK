import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://qcktlk.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;