import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Space, Form, InputNumber, Select } from 'antd';
import { PageWrapper } from '@/components/Page';
import { IMAGE_COMPRESS, COMPRESS_IMG_SRC } from '@/settings/websiteSetting';
import { UploadImage } from '@/components/Upload';
import { getImageSize, compressImage } from '@/utils/image';
import { downloadImgByBase64 } from '@/utils/download';
import SvgIcon from '@/components/SvgIcon';
const defaultForm = {
    width: 1920,
    height: 1080,
    ratio: 100,
    quality: 1,
    mimeType: 'image/png'
};
const defaultImage = {
    width: 1920,
    height: 1080,
    aspectRatio: 1920 / 1080,
    imgSrc: COMPRESS_IMG_SRC
};
const ImageCompress = () => {
    const [form] = Form.useForm();
    const [imageInfo, setImageInfo] = useState(defaultImage);
    useEffect(() => {
        getImageSize(COMPRESS_IMG_SRC).then(({ width, height }) => {
            form.setFieldsValue({ width, height });
            setImageInfo({ ...imageInfo, width, height, aspectRatio: width / height });
        });
    }, []);
    const handleSuccess = (url) => {
        setImageInfo({ ...imageInfo, imgSrc: url });
        getImageSize(url).then(({ width, height }) => {
            form.setFieldsValue({ width, height });
            setImageInfo({ ...imageInfo, width, height, aspectRatio: width / height });
        });
    };
    const handleChange = (value, type) => {
        const getCalcVal = type === 'width'
            ? Number(Math.round(value * imageInfo.aspectRatio).toFixed(0))
            : Number(Math.round(value / imageInfo.aspectRatio).toFixed(0));
        const ratio = Number(Math.round((getCalcVal / imageInfo[type]) * 100).toFixed(2));
        form.setFieldsValue({ [type]: getCalcVal, ratio });
    };
    const onFinish = (values) => {
        const { width, height, quality, mimeType } = values;
        const fileType = mimeType.replace(/image\//, '') || 'png';
        compressImage(imageInfo.imgSrc, { width, height, quality, mimeType }).then((img) => {
            downloadImgByBase64(img, `compress-image.${fileType}`);
        });
    };
    return (_jsx(PageWrapper, { plugin: IMAGE_COMPRESS, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 16, children: _jsx(Card, { title: '\u56FE\u7247\u533A\u57DF', bordered: false, bodyStyle: { height: '500px' }, children: _jsx("div", { className: 'flex-center', children: _jsx("div", { style: {
                                    width: '800px',
                                    height: '450px',
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundImage: `url(${imageInfo.imgSrc})`
                                } }) }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { title: '\u8BBE\u7F6E\u533A\u57DF', bordered: false, bodyStyle: { height: '500px' }, children: _jsxs(Form, { form: form, colon: false, labelCol: { span: 6 }, wrapperCol: { span: 18 }, labelAlign: 'left', initialValues: { ...defaultForm }, style: { width: '300px', margin: '60px auto 0' }, onFinish: onFinish, children: [_jsx(Form.Item, { label: '\u56FE\u7247\u4E0A\u4F20', children: _jsx(UploadImage, { name: '\u9009\u62E9\u56FE\u7247', isFull: true, onSuccess: handleSuccess }) }), _jsx(Form.Item, { label: '\u56FE\u7247\u5C3A\u5BF8', style: { marginBottom: 0 }, children: _jsxs(Space, { children: [_jsx(Form.Item, { name: 'width', children: _jsx(InputNumber, { min: 0, max: imageInfo.width, controls: false, addonBefore: _jsx("span", { children: "\u5BBD" }), onChange: (value) => handleChange(value, 'height') }) }), _jsx(Form.Item, { children: _jsx(SvgIcon, { name: 'linking' }) }), _jsx(Form.Item, { name: 'height', children: _jsx(InputNumber, { min: 0, max: imageInfo.height, controls: false, addonBefore: _jsx("span", { children: "\u9AD8" }), onChange: (value) => handleChange(value, 'width') }) })] }) }), _jsx(Form.Item, { label: '\u538B\u7F29\u6BD4\u4F8B', name: 'ratio', children: _jsx(InputNumber, { min: 0, max: 100, controls: false, formatter: value => `${value}%`, disabled: true, style: { width: '100%' } }) }), _jsx(Form.Item, { label: '\u56FE\u7247\u8D28\u91CF', name: 'quality', children: _jsx(Select, { options: [
                                            { value: 1, label: 100 },
                                            { value: 0.8, label: 80 },
                                            { value: 0.6, label: 60 },
                                            { value: 0.4, label: 40 }
                                        ] }) }), _jsx(Form.Item, { label: '\u56FE\u7247\u683C\u5F0F', name: 'mimeType', children: _jsx(Select, { options: [
                                            { value: 'image/png', label: 'PNG' },
                                            { value: 'image/jpg', label: 'JPG' },
                                            { value: 'image/bmp', label: 'BMP' }
                                        ] }) }), _jsx(Form.Item, { label: ' ', children: _jsx(Button, { type: 'primary', htmlType: 'submit', style: { width: '100%' }, children: "\u538B\u7F29\u56FE\u7247" }) })] }) }) })] }) }));
};
export default ImageCompress;
