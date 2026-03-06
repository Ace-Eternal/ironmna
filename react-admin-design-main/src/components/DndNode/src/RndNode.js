import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useId, useRef } from 'react';
import { useImmer } from 'use-immer';
import { Rnd } from 'react-rnd';
import classNames from 'classnames';
import styles from './compo.module.less';
var handlerEnum;
(function (handlerEnum) {
    handlerEnum["n"] = "top";
    handlerEnum["e"] = "right";
    handlerEnum["s"] = "bottom";
    handlerEnum["w"] = "left";
    handlerEnum["nw"] = "topLeft";
    handlerEnum["ne"] = "topRight";
    handlerEnum["se"] = "bottomRight";
    handlerEnum["sw"] = "bottomLeft";
})(handlerEnum || (handlerEnum = {}));
const RndNode = props => {
    const { element, children, handlers = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'], onChange } = props;
    const { x = 0, y = 0, w: width = 100, h: height = 28 } = element;
    const rndRef = useRef(null);
    const rndNodeId = `rndNode_${useId()}`;
    const [nodeData, setNodeData] = useImmer({ x, y, width, height });
    const [active, setActive] = useState(element.active);
    useEffect(() => {
        setNodeData(draft => {
            draft.x = x;
            draft.y = y;
            draft.width = width;
            draft.height = height;
        });
    }, [x, y, width, height]);
    useEffect(() => {
        setActive(element.active);
    }, [element.active]);
    useEffect(() => {
        if (element.type === 'text') {
            calcTextNodeHeight({ x: nodeData.x, y: nodeData.y });
        }
    }, [element]);
    useEffect(() => {
        onChange?.({ ...element, x: nodeData.x, y: nodeData.y, w: nodeData.width, h: nodeData.height, active });
    }, [active, nodeData]);
    useEffect(() => {
        const container = document.querySelector('.rnd-container') || document.documentElement;
        container.addEventListener('mousedown', handleMousedown, false);
        return () => {
            container.removeEventListener('mousedown', handleMousedown, false);
        };
    });
    const handlerClasses = handlers.reduce((acc, cur) => {
        acc[handlerEnum[cur]] = `${styles['handler']} ${styles[`handler-${cur}`]}`;
        return acc;
    }, {});
    const enableHandler = handlers.reduce((acc, cur) => {
        acc[handlerEnum[cur]] = true;
        return acc;
    }, {});
    const handleMousedown = (e) => {
        const target = e.target;
        const rndNodeRef = document.getElementById(rndNodeId);
        if (rndNodeRef?.contains(target)) {
            !active && setActive(true);
        }
        else {
            active && setActive(false);
        }
    };
    const calcTextNodeHeight = (position) => {
        const rndNodeRef = document.getElementById(rndNodeId);
        if (rndNodeRef && element.type === 'text') {
            const viewHeight = Math.ceil(rndNodeRef.parentNode?.getBoundingClientRect().height);
            const childNodeHeight = Math.ceil(rndNodeRef.querySelector('.rich-text-input').getBoundingClientRect().height);
            if (position.y + childNodeHeight >= viewHeight) {
                setNodeData(draft => {
                    draft.y = viewHeight - childNodeHeight;
                });
                rndRef.current?.updatePosition({ y: nodeData.y });
            }
            rndNodeRef.style.height = `${childNodeHeight}px`;
            setNodeData(draft => {
                draft.height = childNodeHeight;
            });
        }
    };
    const handleResize = (_e, _direction, _ref, _delta, position) => {
        if (element.type === 'text') {
            calcTextNodeHeight(position);
        }
    };
    const handleResizeStop = (_e, _direction, ref, _delta, position) => {
        setNodeData(draft => {
            draft.width = ref.offsetWidth;
            draft.height = ref.offsetHeight;
            draft.x = position.x;
            draft.y = position.y;
        });
        if (element.type === 'text') {
            calcTextNodeHeight(position);
        }
    };
    const handleDragStop = (_e, data) => {
        setNodeData(draft => {
            draft.x = data.x;
            draft.y = data.y;
        });
    };
    return (_jsx(Rnd, { ref: rndRef, id: rndNodeId, default: { ...nodeData }, minWidth: 80, minHeight: 24, bounds: 'parent', enableResizing: { ...enableHandler }, resizeHandleClasses: { ...handlerClasses }, className: classNames(styles['rnd-node-wrapper'], { [styles['active']]: active }), onResize: handleResize, onResizeStop: handleResizeStop, onDragStop: handleDragStop, children: children }));
};
export default RndNode;
