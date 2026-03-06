import { isObject } from './is';
export function openWindow(url, opt) {
    const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
    const feature = [];
    noopener && feature.push('noopener=yes');
    noreferrer && feature.push('noreferrer=yes');
    window.open(url, target, feature.join(','));
}
export function promiseTimeout(ms, throwOnTimeout = false, reason = 'Timeout') {
    return new Promise((resolve, reject) => {
        if (throwOnTimeout)
            setTimeout(() => reject(reason), ms);
        else
            setTimeout(resolve, ms);
    });
}
export const searchRoute = (path, routes = []) => {
    for (const item of routes) {
        if (item.path === path || item.fullPath === path)
            return item;
        if (item.children) {
            const result = searchRoute(path, item.children);
            if (result)
                return result;
        }
    }
    return null;
};
export function deepMerge(src = {}, target = {}) {
    let key;
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}
