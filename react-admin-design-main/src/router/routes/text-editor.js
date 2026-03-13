import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// text-editor module page
const TextEditorRoute = {
    path: '/editor',
    name: 'Editor',
    element: _jsx(LayoutGuard, {}),
    meta: {
        title: '文本编辑器',
        icon: 'editor',
        orderNo: 7,
        hideMenu: true
    },
    children: [
        {
            path: 'markdown',
            name: 'Markdown',
            element: LazyLoad(lazy(() => import('@/views/editor/markdown'))),
            meta: {
                title: 'Markdown编辑器',
                key: 'markdown'
            }
        },
        {
            path: 'rich-text',
            name: 'RichText',
            element: LazyLoad(lazy(() => import('@/views/editor/rich-text'))),
            meta: {
                title: '富文本编辑器',
                key: 'richText'
            }
        },
        {
            path: 'code-editor',
            name: 'CodeEditor',
            element: LazyLoad(lazy(() => import('@/views/editor/code-mirror'))),
            meta: {
                title: '代码编辑器',
                key: 'codeEditor'
            }
        }
    ]
};
export default TextEditorRoute;
