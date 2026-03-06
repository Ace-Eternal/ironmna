import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { Row, Col, Card } from 'antd';
import { PageWrapper } from '@/components/Page';
import { VIDEO_RES_SRC, VIDEO_PLUGIN } from '@/settings/websiteSetting';
import { VideoReact } from '@/components/VideoReact';
const VideoPlayer = () => {
    return (_jsx(PageWrapper, { plugin: VIDEO_PLUGIN, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 12, children: _jsx(Card, { title: '\u4F20\u7EDF\u89C6\u9891\u64AD\u653E\u5668', bordered: false, children: _jsx("video", { src: VIDEO_RES_SRC, controls: true, style: { width: '100%', outline: 'none' } }) }) }), _jsx(Col, { span: 12, children: _jsx(Card, { title: '\u89C6\u9891\u64AD\u653E\u63D2\u4EF6', bordered: false, children: _jsx(VideoReact, { options: {
                                sources: [{ src: VIDEO_RES_SRC, type: 'video/mp4' }],
                                playbackRates: [0.5, 1.0, 1.5, 2.0],
                                controls: true,
                                fluid: true,
                                loop: false,
                                preload: 'auto',
                                aspectRatio: '16:9'
                            } }) }) })] }) }));
};
export default VideoPlayer;
