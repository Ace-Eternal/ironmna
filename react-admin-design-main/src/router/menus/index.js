import { basicRoutes } from '..';
import { transformRouteToMenu } from '../helpers';
// Get async menus
export async function getAsyncMenus() {
    const staticMenus = transformRouteToMenu(basicRoutes);
    staticMenus.sort((a, b) => {
        return (a?.orderNo || staticMenus.length) - (b?.orderNo || staticMenus.length);
    });
    return staticMenus.filter(item => !item.hideMenu);
}
