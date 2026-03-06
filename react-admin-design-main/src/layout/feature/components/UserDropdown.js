import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Space, Dropdown } from 'antd';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAuthCache, clearAuthCache } from '@/utils/auth';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useAppDispatch, useAppSelector } from '@/stores';
import { useMessage } from '@/hooks/web/useMessage';
import { logoutApi } from '@/api';
import { resetState } from '@/stores/modules/user';
import headerImg from '@/assets/images/avatar.jpeg';
export default function UserDropdown() {
    const items = [
        {
            key: 'lock',
            label: (_jsxs(Space, { size: 4, children: [_jsx(LockOutlined, { rev: undefined }), _jsx("span", { children: "\u9501\u5B9A\u5C4F\u5E55" })] }))
        },
        {
            key: 'logout',
            label: (_jsxs(Space, { size: 4, children: [_jsx(PoweroffOutlined, { rev: undefined }), _jsx("span", { children: "\u9000\u51FA\u767B\u5F55" })] }))
        }
    ];
    const onClick = ({ key }) => {
        switch (key) {
            case 'lock':
                handleLock();
                break;
            case 'logout':
                handleLogout();
                break;
        }
    };
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.user);
    const getToken = () => {
        return token || getAuthCache(TOKEN_KEY);
    };
    const handleLock = () => { };
    const handleLogout = () => {
        const { createConfirm } = useMessage();
        createConfirm({
            iconType: 'warning',
            title: _jsx("span", { children: "\u6E29\u99A8\u63D0\u9192" }),
            content: _jsx("span", { children: "\u662F\u5426\u786E\u8BA4\u9000\u51FA\u7CFB\u7EDF?" }),
            onOk: async () => {
                await logoutAction(true);
            }
        });
    };
    const logoutAction = async (goLogin = false) => {
        if (getToken()) {
            try {
                await logoutApi();
            }
            catch (error) {
                const { createMessage } = useMessage();
                createMessage.error('注销失败!');
            }
        }
        dispatch(resetState());
        clearAuthCache();
        goLogin && navigate('/login');
    };
    return (_jsx(Dropdown, { menu: { items, onClick }, placement: 'bottomRight', arrow: true, children: _jsx("span", { className: 'flex-center', style: { cursor: 'pointer' }, children: _jsx("img", { src: headerImg, style: {
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%'
                }, alt: '' }) }) }));
}
