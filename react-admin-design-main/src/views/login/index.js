import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Checkbox, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/stores';
import { setToken, setUserInfo, setSessionTimeout } from '@/stores/modules/user';
import { getAuthCache } from '@/utils/auth';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { loginApi, getUserInfo } from '@/api';
import logoIcon from '@/assets/images/logo_name.png';
import classNames from 'classnames';
import styles from './index.module.less';
const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { token, sessionTimeout } = useAppSelector(state => state.user);
    const getToken = () => {
        return token || getAuthCache(TOKEN_KEY);
    };
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const userInfo = await loginAction({
                username: values.username,
                password: values.password
            });
            console.log('这里是userinfo');
            console.log(userInfo);
            if (userInfo) {
                message.success('登陆成功！');
            }
        }
        catch (error) {
            console.log('这里是error');
            message.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const loginAction = async (params) => {
        try {
            const { goHome = true, ...loginParams } = params;
            const data = await loginApi(loginParams);
            console.log(data);
            // 保存 Token
            dispatch(setToken(data?.token));
            return afterLoginAction(goHome);
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
    const afterLoginAction = async (goHome) => {
        if (!getToken())
            return null;
        const userInfo = await getUserInfoAction();
        if (sessionTimeout) {
            dispatch(setSessionTimeout(false));
        }
        else {
            const redirect = searchParams.get('redirect');
            if (redirect) {
                navigate(redirect);
            }
            else {
                goHome && navigate(userInfo?.homePath || '/home');
            }
        }
        return userInfo;
    };
    const getUserInfoAction = async () => {
        if (!getToken())
            return null;
        const userInfo = await getUserInfo();
        dispatch(setUserInfo(userInfo));
        return userInfo;
    };
    return (_jsx("div", { className: styles['login-wrapper'], children: _jsxs("div", { className: styles['login-box'], children: [_jsxs("div", { className: styles['login-box-title'], children: [_jsx("img", { src: logoIcon, alt: 'icon' }), _jsx("p", { children: "\u8D26 \u53F7 \u767B \u5F55" })] }), _jsxs(Form, { form: form, initialValues: {
                        username: 'ywyp',
                        password: '',
                        remember: true
                    }, className: styles['login-box-form'], onFinish: handleLogin, children: [_jsx(Form.Item, { name: 'username', rules: [{ required: true, message: '请输入账号' }], children: _jsx(Input, { placeholder: '\u8BF7\u8F93\u5165\u8D26\u53F7', prefix: _jsx(UserOutlined, { style: { color: 'rgba(0, 0, 0, 0.25)' }, rev: undefined }) }) }), _jsx(Form.Item, { name: 'password', rules: [{ required: true, message: '请输入密码' }], children: _jsx(Input, { type: 'password', placeholder: '\u8BF7\u8F93\u5165\u5BC6\u7801', prefix: _jsx(LockOutlined, { style: { color: 'rgba(0, 0, 0, 0.25)' }, rev: undefined }) }) }), _jsxs(Form.Item, { children: [_jsx(Form.Item, { name: 'remember', className: classNames('fl', styles['no-margin']), valuePropName: 'checked', children: _jsx(Checkbox, { children: "\u8BB0\u4F4F\u6211" }) }), _jsx(Form.Item, { className: classNames('fr', styles['no-margin']), children: _jsx("a", { href: '', children: "\u5FD8\u8BB0\u5BC6\u7801\uFF1F" }) })] }), _jsx(Form.Item, { children: _jsx(Button, { type: 'primary', htmlType: 'submit', className: styles['login-btn'], loading: loading, children: "\u767B \u5F55" }) })] })] }) }));
};
export default LoginPage;
