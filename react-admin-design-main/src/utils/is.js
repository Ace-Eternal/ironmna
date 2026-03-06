export function is(val, type) {
    return Object.prototype.toString.call(val) === `[object ${type}]`;
}
export function isFunction(val) {
    return typeof val === 'function';
}
export function isArray(val) {
    return val && Array.isArray(val);
}
export function isObject(val) {
    return val !== null && is(val, 'Object');
}
export function isNumber(val) {
    return is(val, 'Number');
}
export function isString(val) {
    return is(val, 'String');
}
export function isDef(val) {
    return typeof val !== 'undefined';
}
export function isUnDef(val) {
    return !isDef(val);
}
export function isNull(val) {
    return val === null;
}
export function isNullOrUnDef(val) {
    return isUnDef(val) || isNull(val);
}
export function isUrl(path) {
    const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    return reg.test(path);
}
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;
