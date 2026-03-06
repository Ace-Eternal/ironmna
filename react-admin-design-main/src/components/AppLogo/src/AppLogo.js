import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Space } from 'antd';
import { useAppSelector } from '@/stores';
import classNames from 'classnames';
import styles from './app-logo.module.less';
import logoImg from '@/assets/images/logo.png';
import logoName from '@/assets/images/name_white.png';
const AppLogo = () => {
    const getMenuFold = useAppSelector(state => state.app.appConfig?.menuSetting?.menuFold);
    return (_jsx("div", { className: classNames('anticon', styles['app-logo']), children: _jsxs(Space, { children: [_jsx("img", { className: styles['logo-img'], src: logoImg, alt: 'logo' }), _jsx("img", { className: classNames(styles['logo-name'], { [styles['hidden']]: getMenuFold }), src: logoName, alt: 'logo' })] }) }));
};
export default AppLogo;
