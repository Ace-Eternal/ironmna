import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { Row, Col, Card, Button, Form, message } from 'antd';
import { RndNode } from '@/components/DndNode';
import { PageWrapper } from '@/components/Page';
import { IMAGE_COMPOSITION } from '@/settings/websiteSetting';
import { RichTextInput, RichTextSetting } from '@/components/RichText';
import { UploadImage } from '@/components/Upload';
import { getImageSize, calcImageSize } from '@/utils/image';
import { textElement, imageElement, containerObj } from './data';
import dom2image from 'dom-to-image';
const ImageComposition = () => {
    const [container, setContainer] = useImmer(containerObj);
    const [elements, setElements] = useImmer([textElement, imageElement]);
    const [activeElementTag, setActiveElementTag] = useState(elements[0]?.tag || '');
    const [elementIndex, setElementIndex] = useState(elements.length);
    const containerStyle = useMemo(() => {
        return {
            position: 'relative',
            width: container.width,
            height: container.height,
            backgroundImage: `url(${container.bgImgUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        };
    }, [container]);
    const activeElement = useMemo(() => {
        return elements.find(item => item.tag === activeElementTag);
    }, [activeElementTag, elements]);
    const elementHandler = (type) => {
        if (type === 'text') {
            return ['e', 'w'];
        }
        return ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
    };
    const handleAddText = () => {
        const tagIndex = elementIndex + 1;
        const textElement = {
            x: 300,
            y: 100,
            z: elements.length,
            w: 180,
            h: 36,
            type: 'text',
            tag: `text_${tagIndex}`,
            active: false,
            text: '请输入文本',
            style: {
                fontFamily: '微软雅黑',
                fontSize: '24px',
                lineHeight: '24px',
                color: '#f70707',
                backgroundColor: '#05f8e8',
                fontWeight: '',
                fontStyle: '',
                textShadow: '',
                textAlign: 'left'
            }
        };
        if (elements.length > 4) {
            message.warning('图片上最多叠加5个元素!');
            return;
        }
        else {
            setElements(draft => {
                draft.push(textElement);
            });
            setElementIndex(tagIndex);
        }
    };
    const handleAddImage = (imgObj) => {
        const tagIndex = elementIndex + 1;
        const imageElement = {
            x: 320,
            y: 300,
            z: elements.length,
            w: imgObj.width,
            h: imgObj.height,
            type: 'image',
            tag: `image_${tagIndex}`,
            active: false,
            url: imgObj.url
        };
        if (elements.length > 4) {
            message.warning('图片上最多叠加5个元素!');
            return;
        }
        else {
            setElements(draft => {
                draft.push(imageElement);
            });
            setElementIndex(tagIndex);
        }
    };
    const handleDeleteElement = () => {
        if (!activeElementTag) {
            message.warning('请先选择元素!');
            return;
        }
        const activeElementIndex = elements.findIndex(item => item.tag === activeElementTag);
        setElements(draft => {
            draft.splice(activeElementIndex, 1);
        });
        setActiveElementTag('');
    };
    const changeBgImg = (url) => {
        getImageSize(url).then(({ width, height }) => {
            const { width: containerWidth, height: containerHeight } = calcImageSize(width, height, 850, 550);
            setContainer(draft => {
                draft.bgImgUrl = url;
                draft.width = containerWidth;
                draft.height = containerHeight;
            });
        });
    };
    const uploadImage = (url) => {
        getImageSize(url).then(({ width, height }) => {
            const { width: imgWidth, height: imgHeight } = calcImageSize(width, height, Math.floor(container.width / 4), Math.floor(container.height / 4));
            handleAddImage({
                url,
                width: imgWidth,
                height: imgHeight
            });
        });
    };
    const handleSettingText = (val) => {
        setElements((draft) => {
            draft.forEach((item) => {
                if (item.tag === activeElementTag) {
                    item.text = val;
                }
            });
        });
    };
    const handleSettingStyles = (style) => {
        setElements((draft) => {
            draft.forEach((item) => {
                if (item.tag === activeElementTag) {
                    item.style = style;
                }
            });
        });
    };
    const handleChangeElement = (ele, index) => {
        setElements((draft) => {
            draft[index] = ele;
        });
        if (ele.active) {
            setActiveElementTag(ele.tag);
            setElements((draft) => {
                draft.forEach((item) => {
                    if (item.tag !== ele.tag) {
                        item.active = false;
                    }
                });
            });
        }
    };
    const handleComposition = async () => {
        dom2image.toPng(document.getElementById('imageComposition')).then(dataUrl => {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `composition-image.png`;
            a.click();
        });
    };
    return (_jsx(PageWrapper, { plugin: IMAGE_COMPOSITION, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 16, children: _jsx(Card, { title: '\u5408\u6210\u533A\u57DF', bordered: false, bodyStyle: { height: '600px' }, children: _jsx("div", { className: 'flex-center', children: _jsx("div", { id: 'imageComposition', className: 'dnd-container', style: { ...containerStyle }, children: elements.map((item, index) => {
                                    return (_jsx(RndNode, { element: item, handlers: elementHandler(item.type), onChange: ele => handleChangeElement(ele, index), children: item.type === 'text' ? (_jsx(RichTextInput, { value: item.text, style: item.style, onChange: val => {
                                                setElements((draft) => {
                                                    draft[index].text = val;
                                                });
                                            } })) : item.type === 'image' ? (_jsx("img", { src: item.url, draggable: 'false' })) : (_jsx(_Fragment, {})) }, item.tag));
                                }) }) }) }) }), _jsx(Col, { span: 8, children: _jsxs(Card, { title: '\u8BBE\u7F6E\u533A\u57DF', bordered: false, bodyStyle: { height: '600px' }, children: [_jsxs(Form, { colon: false, labelCol: { span: 6 }, wrapperCol: { span: 18 }, labelAlign: 'left', style: { width: '300px', margin: '0 auto' }, children: [_jsx(Form.Item, { label: '\u9009\u62E9\u5E95\u56FE', children: _jsx(UploadImage, { name: '\u9009\u62E9\u5E95\u56FE', isFull: true, onSuccess: changeBgImg }) }), _jsx(Form.Item, { label: '\u6DFB\u52A0\u6587\u672C', children: _jsx(Button, { block: true, style: { width: '100%' }, onClick: handleAddText, children: "\u6DFB\u52A0\u6587\u672C" }) }), _jsx(Form.Item, { label: '\u6DFB\u52A0\u56FE\u7247', children: _jsx(UploadImage, { name: '\u6DFB\u52A0\u56FE\u7247', isFull: true, onSuccess: uploadImage }) }), _jsx(Form.Item, { label: '\u5220\u9664\u5143\u7D20', children: _jsx(Button, { type: 'primary', danger: true, style: { width: '100%' }, onClick: handleDeleteElement, children: "\u5220\u9664\u5143\u7D20" }) })] }), activeElement && activeElement.type === 'text' ? (_jsx(RichTextSetting, { textValue: activeElement.text, textStyles: activeElement.style, onChangeValue: val => handleSettingText(val), onChangeStyles: style => handleSettingStyles(style) })) : (_jsx(_Fragment, {})), _jsx("div", { style: { width: '300px', margin: '0 auto' }, children: _jsx(Button, { type: 'primary', style: { width: '100%' }, onClick: handleComposition, children: "\u5408\u6210\u56FE\u7247" }) })] }) })] }) }));
};
export default ImageComposition;
