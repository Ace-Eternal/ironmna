import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Row, Col, Card, Button, Upload, Modal } from 'antd';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { PageWrapper } from '@/components/Page';
import { UPLOAD_COMPO } from '@/settings/websiteSetting';
import { UPLOAD_IMG_SRC, UPLOAD_IMG_SRC2 } from '@/settings/websiteSetting';
const ImageUpload = () => {
    const { Dragger } = Upload;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const dragImgs = [
        { uid: '-1', name: 'beautiful-girl.jpg' },
        { uid: '-2', name: 'beautiful-sunshine.jpg' }
    ];
    const [listImgs, setListImgs] = useState([
        {
            uid: '-1',
            name: 'beautiful-girl.jpg',
            status: 'done',
            url: UPLOAD_IMG_SRC,
            thumbUrl: UPLOAD_IMG_SRC
        },
        {
            uid: '-2',
            name: 'beautiful-sunshine.jpg',
            status: 'done',
            url: UPLOAD_IMG_SRC2,
            thumbUrl: UPLOAD_IMG_SRC2
        }
    ]);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = (await getBase64(file.originFileObj));
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };
    const handleChange = ({ fileList: newFileList }) => setListImgs(newFileList);
    const handleCancle = () => {
        setPreviewVisible(false);
        setPreviewTitle('');
    };
    return (_jsx(PageWrapper, { plugin: UPLOAD_COMPO, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 8, children: _jsx(Card, { title: '\u62D6\u62FD\u4E0A\u4F20', bordered: false, bodyStyle: { height: '300px' }, children: _jsxs(Dragger, { defaultFileList: dragImgs, action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', accept: '.jpg, .jpeg, .gif, .png, .bmp', multiple: true, children: [_jsx("p", { className: 'ant-upload-drag-icon', style: { marginBottom: 0 }, children: _jsx(CloudUploadOutlined, { rev: undefined }) }), _jsxs("p", { children: ["\u5C06\u56FE\u7247\u62D6\u5230\u6B64\u5904, \u6216", _jsx("span", { style: { color: '#1890ff' }, children: "\u70B9\u51FB\u4E0A\u4F20" })] }), _jsx("p", { className: 'ant-upload-hint', children: "\u53EA\u80FD\u4E0A\u4F20jpg\u3001jpeg\u3001gif\u3001png\u3001bmp\u6587\u4EF6, \u4E14\u4E0D\u8D85\u8FC7500kb" })] }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { title: '\u5217\u8868\u6837\u5F0F', bordered: false, bodyStyle: { height: '300px' }, children: _jsxs(Upload, { defaultFileList: [...listImgs], action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', accept: '.jpg, .jpeg, .gif, .png, .bmp', listType: 'picture', className: 'list-upload', children: [_jsxs(Button, { type: 'primary', children: [_jsx(CloudUploadOutlined, { rev: undefined }), _jsx("span", { children: "\u70B9\u51FB\u4E0A\u4F20" })] }), _jsx("p", { className: 'ant-upload-hint', children: "\u53EA\u80FD\u4E0A\u4F20jpg\u3001jpeg\u3001gif\u3001png\u3001bmp\u6587\u4EF6, \u4E14\u4E0D\u8D85\u8FC7500kb" })] }) }) }), _jsxs(Col, { span: 8, children: [_jsx(Card, { title: '\u7167\u7247\u5899', bordered: false, bodyStyle: { height: '300px' }, children: _jsx(Upload, { fileList: listImgs, action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', accept: '.jpg, .jpeg, .gif, .png, .bmp', listType: 'picture-card', className: 'list-upload', onPreview: handlePreview, onChange: handleChange, children: _jsxs("div", { children: [_jsx(PlusOutlined, { rev: undefined }), _jsx("div", { style: { marginTop: '8px' }, children: "\u70B9\u51FB\u4E0A\u4F20" })] }) }) }), _jsx(Modal, { open: previewVisible, title: previewTitle, footer: null, onCancel: handleCancle, children: _jsx("img", { src: previewImage, style: { width: '100%' } }) })] })] }) }));
};
export default ImageUpload;
