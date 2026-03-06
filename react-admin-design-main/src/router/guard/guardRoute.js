import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthCache } from '@/utils/auth';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useAppSelector } from '@/stores';
export const GuardRoute = ({ children }) => {
    const whiteList = ['/', '/home', '/login'];
    const { pathname } = useLocation();
    const { token } = useAppSelector(state => state.user);
    const getToken = () => {
        return token || getAuthCache(TOKEN_KEY);
    };
    if (!getToken()) {
        if (whiteList.includes(pathname)) {
            return _jsx(Navigate, { to: '/login', replace: true });
        }
        else {
            return _jsx(Navigate, { to: `/login?redirect=${pathname}`, replace: true });
        }
    }
    return children;
};
