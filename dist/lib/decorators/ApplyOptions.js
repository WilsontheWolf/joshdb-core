"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyOptions = void 0;
const createClassDecorator_1 = require("./utils/createClassDecorator");
const createProxy_1 = require("./utils/createProxy");
function ApplyOptions(options) {
    return createClassDecorator_1.createClassDecorator((target) => createProxy_1.createProxy(target, {
        construct: (ctor, [context, baseOptions = {}]) => new ctor(context, {
            ...baseOptions,
            ...options
        })
    }));
}
exports.ApplyOptions = ApplyOptions;
//# sourceMappingURL=ApplyOptions.js.map