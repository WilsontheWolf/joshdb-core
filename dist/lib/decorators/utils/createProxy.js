"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxy = void 0;
// eslint-disable-next-line @typescript-eslint/ban-types
function createProxy(target, handler) {
    return new Proxy(target, {
        ...handler,
        get: (target, property) => {
            const value = Reflect.get(target, property);
            return typeof value === 'function' ? (...args) => value.apply(target, args) : value;
        }
    });
}
exports.createProxy = createProxy;
//# sourceMappingURL=createProxy.js.map