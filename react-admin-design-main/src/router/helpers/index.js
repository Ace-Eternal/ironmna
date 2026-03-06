import { cloneDeep } from 'lodash-es';
import { isUrl } from '@/utils/is';
import { treeMap } from '@/utils/helper/treeHelper';
export function joinParentPath(menus, parentPath = '') {
    for (let index = 0; index < menus.length; index++) {
        const menu = menus[index];
        // Note that nested paths that start with / will be treated as a root path.
        if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
            // Path doesn't start with /, nor is it a url, join parent path
            menu.path = `${parentPath}/${menu.path}`;
        }
        if (menu?.children?.length) {
            joinParentPath(menu.children, menu.path);
        }
    }
}
export function transformRouteToMenu(routes) {
    const cloneRoutes = cloneDeep(routes);
    const routeList = [];
    cloneRoutes.forEach(item => {
        if (item.meta.hideChildrenInMenu) {
            item.children = [];
        }
        routeList.push(item);
    });
    const list = treeMap(routeList, {
        conversion: (node) => {
            const { meta: { title, hideMenu = false, ...rest } = {} } = node;
            return {
                ...(rest || {}),
                name: title,
                hideMenu,
                path: node.path
            };
        }
    });
    joinParentPath(list);
    return cloneDeep(list);
}
export function genFullPath(routes, parentPath = '') {
    for (let index = 0; index < routes.length; index++) {
        const route = routes[index];
        if (route.path.startsWith('/')) {
            route.fullPath = route.path;
        }
        else {
            route.fullPath = `${parentPath}/${route.path}`;
        }
        if (route?.children?.length) {
            genFullPath(route.children, route.fullPath);
        }
    }
}
