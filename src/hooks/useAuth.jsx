import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext/AuthContext.jsx';

const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;