import { jsx as _jsx } from "react/jsx-runtime";
import { BasicLayout } from '@/layout';
import { GuardRoute } from './guardRoute';
export const LayoutGuard = () => {
    return (_jsx(GuardRoute, { children: _jsx(BasicLayout, {}) }));
};
