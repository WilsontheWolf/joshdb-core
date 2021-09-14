"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyOptions = void 0;
const createClassDecorator_1 = require("./utils/createClassDecorator");
const createProxy_1 = require("./utils/createProxy");
/**
 * Decorator function that applies given options to {@link Middleware} piece.
 * @since 2.0.0
 * @param options The options to pass to the middleware constructor.
 *
 * @example
 * ```typescript
 * import { ApplyOptions, Middleware } from '@joshdb/core';
 *
 * (at)ApplyOptions<Middleware.Options>({
 *   name: 'name',
 *   position: 0,
 *   conditions: []
 * })
 * export class CoreMiddleware extends Middleware {}
 * ```
 */
function ApplyOptions(options) {
    return (0, createClassDecorator_1.createClassDecorator)((target) => (0, createProxy_1.createProxy)(target, {
        construct: (ctor, [context, baseOptions = {}]) => new ctor(context, {
            ...baseOptions,
            ...options
        })
    }));
}
exports.ApplyOptions = ApplyOptions;
//# sourceMappingURL=ApplyOptions.js.map