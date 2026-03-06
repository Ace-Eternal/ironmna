import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Row, Col, Card, Button, Space } from 'antd';
import { PageWrapper } from '@/components/Page';
import { REACT_CROPPER_PLUGIN, CROPPER_IMG_SRC } from '@/settings/websiteSetting';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { downloadImgByUrl } from '@/utils/download';
import { UploadImage } from '@/components/Upload';
const ImageCropper = () => {
    const cropperRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(CROPPER_IMG_SRC);
    const handleSuccess = (data) => {
        setImgSrc(data);
    };
    const downloadImage = () => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            const imgUrl = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            downloadImgByUrl(imgUrl, 'demo.png');
        }
    };
    return (_jsx(PageWrapper, { plugin: REACT_CROPPER_PLUGIN, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 10, children: _jsx(Card, { title: '\u88C1\u526A\u533A\u57DF', bordered: false, bodyStyle: { height: '400px' }, children: _jsx(Cropper, { ref: cropperRef, src: imgSrc, initialAspectRatio: 3 / 2, autoCrop: true, responsive: true, guides: true, autoCropArea: 0.6, preview: '.img-preview', style: {
                                height: '100%',
                                width: '100%'
                            } }) }) }), _jsx(Col, { span: 4, children: _jsx(Card, { title: '\u8BBE\u7F6E\u533A\u57DF', bordered: false, children: _jsx("div", { className: 'flex-center', style: { height: '352px' }, children: _jsxs(Space, { direction: 'vertical', children: [_jsx(UploadImage, { onSuccess: handleSuccess }), _jsx(Button, { type: 'primary', onClick: downloadImage, children: "\u4E0B\u8F7D\u56FE\u7247" })] }) }) }) }), _jsx(Col, { span: 10, children: _jsx(Card, { title: '\u9884\u89C8\u533A\u57DF', bordered: false, bodyStyle: { height: '400px' }, children: _jsx("div", { className: 'img-preview', style: {
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                margin: 'auto'
                            } }) }) })] }) }));
};
export default ImageCropper;
