"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var noop = function () { };
var ChariotConnect = function (_a) {
    var cid = _a.cid, _b = _a.theme, theme = _b === void 0 ? "DefaultTheme" : _b, onDonationRequest = _a.onDonationRequest, _c = _a.onSuccess, onSuccess = _c === void 0 ? noop : _c, _d = _a.onExit, onExit = _d === void 0 ? noop : _d;
    (0, react_1.useEffect)(function () {
        var script = document.createElement('script');
        // change this to https://cdn.givechariot.com/chariot-connect.umd.js
        // once CHARIOT_INIT event is added to prod
        script.src = "http://127.0.0.1:5173/dist/chariot-connect.umd.js";
        script.async = true;
        document.body.appendChild(script);
        var connect = document.createElement('chariot-connect');
        connect.setAttribute('cid', cid);
        connect.setAttribute('theme', (typeof theme === "string") ? theme : 'customTheme');
        connect.addEventListener("CHARIOT_INIT", function () {
            connect.onDonationRequest(onDonationRequest);
            connect.registerTheme("customTheme", theme);
        });
        connect.addEventListener("CHARIOT_SUCCESS", onSuccess);
        connect.addEventListener("CHARIOT_EXIT", onExit);
        var connectContainer = document.getElementById('connectContainer');
        connectContainer === null || connectContainer === void 0 ? void 0 : connectContainer.appendChild(connect);
        return function () {
            document.body.removeChild(script);
            connectContainer === null || connectContainer === void 0 ? void 0 : connectContainer.removeChild(connect);
        };
    }, []);
    return (react_1["default"].createElement("div", { id: "connectContainer" }));
};
exports["default"] = ChariotConnect;
//# sourceMappingURL=index.js.map