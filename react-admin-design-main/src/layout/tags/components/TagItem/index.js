import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tag } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';
const TagItem = ({ name, fixed, active, closeTag, onClick }) => {
    return (_jsxs(Tag, { className: classNames(styles['compo_tag-item'], { [styles['active']]: active }), closable: !fixed, onClose: closeTag, onClick: onClick, children: [_jsx("span", { className: styles['compo_tag-item__dot'] }), _jsx("span", { className: styles['compo_tag-item__name'], children: name })] }));
};
export default TagItem;
