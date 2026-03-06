import { jsx as _jsx } from "react/jsx-runtime";
import { Result, Card, Button } from 'antd';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { ExceptionEnum } from '@/enums/exceptionEnum';
import { PageWrapper } from '@/components/Page';
import { RESULT_COMPO } from '@/settings/websiteSetting';
const subTitleMap = new Map([
    [ExceptionEnum.PAGE_NOT_ACCESS, '对不起，您没有权限访问此页面。'],
    [ExceptionEnum.PAGE_NOT_FOUND, '对不起，您访问的页面不存在。'],
    [ExceptionEnum.SERVER_ERROR, '对不起，服务器发生错误。']
]);
const PageException = () => {
    const navigate = useNavigate();
    const { status, withCard } = useLoaderData();
    const goHome = () => {
        navigate('/home');
    };
    const WithCard = ({ children }) => {
        if (withCard) {
            return (_jsx(PageWrapper, { plugin: RESULT_COMPO, children: _jsx(Card, { bordered: false, children: children }) }));
        }
        else {
            return (_jsx("div", { className: 'flex-center', style: { height: '100vh' }, children: children }));
        }
    };
    return (_jsx(WithCard, { children: _jsx(Result, { status: status, title: status, subTitle: subTitleMap.get(status), extra: _jsx(Button, { type: 'primary', onClick: goHome, children: "\u8FD4\u56DE\u9996\u9875" }) }) }));
};
export default PageException;
