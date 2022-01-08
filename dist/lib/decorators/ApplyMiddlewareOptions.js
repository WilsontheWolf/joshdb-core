"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyMiddlewareOptions = void 0;
const createClassDecorator_1 = require("./utils/createClassDecorator");
const createProxy_1 = require("./utils/createProxy");
/**
 * Decorator function that applies given options to {@link Middleware} class.
 * @since 2.0.0
 * @param options The middleware options.
 *
 * @example
 * ```typescript
 * import { ApplyMiddlewareOptions, Middleware } from '@joshdb/core';
 *
 * (at)ApplyMiddlewareOptions({
 *   name: 'name',
 *   // More options...
 * })
 * export class CoreMiddleware extends Middleware {}
 * ``` */
function ApplyMiddlewareOptions(options) {
    return (0, createClassDecorator_1.createClassDecorator)((target) => (0, createProxy_1.createProxy)(target, {
        construct: (ctor) => new ctor(options)
    }));
}
exports.ApplyMiddlewareOptions = ApplyMiddlewareOptions;
//# sourceMappingURL=ApplyMiddlewareOptions.js.map