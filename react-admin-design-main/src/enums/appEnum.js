export const SIDE_BAR_MIN_WIDTH = 48;
export const SIDE_BAR_SHOW_TITLE_MIN_WIDTH = 80;
// App mode enum
export var AppModeEnum;
(function (AppModeEnum) {
    AppModeEnum["DARK"] = "dark";
    AppModeEnum["LIGHT"] = "light";
})(AppModeEnum || (AppModeEnum = {}));
// Menu theme enum
export var ThemeEnum;
(function (ThemeEnum) {
    ThemeEnum["DARK"] = "dark";
    ThemeEnum["LIGHT"] = "light";
})(ThemeEnum || (ThemeEnum = {}));
// Page switching animation
export var PageTransitionEnum;
(function (PageTransitionEnum) {
    PageTransitionEnum["FADE"] = "fade";
    PageTransitionEnum["FADE_SIDE"] = "fade-slide";
    PageTransitionEnum["FADE_BOTTOM"] = "fade-bottom";
    PageTransitionEnum["FADE_SCALE"] = "fade-scale";
    PageTransitionEnum["ZOOM_FADE"] = "zoom-fade";
    PageTransitionEnum["ZOOM_OUT"] = "zoom-out";
})(PageTransitionEnum || (PageTransitionEnum = {}));
// Permission mode
export var PermissionModeEnum;
(function (PermissionModeEnum) {
    // Route mapping
    PermissionModeEnum["MAPPING"] = "MAPPING";
    // The back-end response
    PermissionModeEnum["BACKEND"] = "BACKEND";
})(PermissionModeEnum || (PermissionModeEnum = {}));
