export var ExceptionEnum;
(function (ExceptionEnum) {
    // page not access
    ExceptionEnum[ExceptionEnum["PAGE_NOT_ACCESS"] = 403] = "PAGE_NOT_ACCESS";
    // page not found
    ExceptionEnum[ExceptionEnum["PAGE_NOT_FOUND"] = 404] = "PAGE_NOT_FOUND";
    // server error
    ExceptionEnum[ExceptionEnum["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(ExceptionEnum || (ExceptionEnum = {}));
