import { jsx as _jsx } from "react/jsx-runtime";
import { Modal, message as Message } from 'antd';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { isString } from '@/utils/is';
function getIcon(iconType) {
    if (iconType === 'warning') {
        return _jsx(InfoCircleFilled, { className: 'modal-icon-warning' });
    }
    else if (iconType === 'success') {
        return _jsx(CheckCircleFilled, { className: 'modal-icon-success' });
    }
    else if (iconType === 'info') {
        return _jsx(InfoCircleFilled, { className: 'modal-icon-info' });
    }
    else {
        return _jsx(CloseCircleFilled, { className: 'modal-icon-error' });
    }
}
function renderContent({ content }) {
    if (isString(content)) {
        // @ts-ignore
        return _jsx("div", { dangerouslySetInnerHTML: `<div>${content}</div>` });
    }
    else {
        return content;
    }
}
// Create confirmation box
function createConfirm(options) {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt = {
        centered: true,
        icon: getIcon(iconType),
        content: renderContent(options),
        okText: '确定',
        cancelText: '取消',
        ...options
    };
    return Modal.confirm(opt);
}
export function useMessage() {
    return {
        createMessage: Message,
        createConfirm
    };
}
