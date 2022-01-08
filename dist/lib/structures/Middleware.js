"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const errors_1 = require("../errors");
const types_1 = require("../types");
/**
 * The base class for creating middlewares. Extend this class to create a middleware.
 * @see {@link Middleware.Options} for all available options for middlewares.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * (at)ApplyOptions<Middleware.Options>({
 *   name: 'middleware',
 *   // More options...
 * })
 * export class CoreMiddleware extends Middleware {
 *   // Make method implementations...
 * }
 * ```
 *
 * ```typescript
 * export class CoreMiddleware extends Middleware {
 *   public constructor() {
 *     super({
 *       name: 'middleware'
 *     })
 *   }
 * }
 * ```
 */
class Middleware {
    constructor(options) {
        const { name, position, conditions } = options;
        this.name = name;
        this.position = position;
        this.conditions = conditions;
    }
    /**
     * Initiates this class with it's store.
     * @since 2.0.0
     * @param store The store to set to `this`.
     * @returns Returns the current Middleware class.
     */
    init(store) {
        this.store = store;
        return this;
    }
    [types_1.Method.AutoKey](payload) {
        return payload;
    }
    [types_1.Method.Clear](payload) {
        return payload;
    }
    [types_1.Method.Dec](payload) {
        return payload;
    }
    [types_1.Method.Delete](payload) {
        return payload;
    }
    [types_1.Method.Ensure](payload) {
        return payload;
    }
    [types_1.Method.Every](payload) {
        return payload;
    }
    [types_1.Method.Filter](payload) {
        return payload;
    }
    [types_1.Method.Find](payload) {
        return payload;
    }
    [types_1.Method.Get](payload) {
        return payload;
    }
    [types_1.Method.GetAll](payload) {
        return payload;
    }
    [types_1.Method.GetMany](payload) {
        return payload;
    }
    [types_1.Method.Has](payload) {
        return payload;
    }
    [types_1.Method.Inc](payload) {
        return payload;
    }
    [types_1.Method.Keys](payload) {
        return payload;
    }
    [types_1.Method.Map](payload) {
        return payload;
    }
    [types_1.Method.Math](payload) {
        return payload;
    }
    [types_1.Method.Partition](payload) {
        return payload;
    }
    [types_1.Method.Push](payload) {
        return payload;
    }
    [types_1.Method.Random](payload) {
        return payload;
    }
    [types_1.Method.RandomKey](payload) {
        return payload;
    }
    [types_1.Method.Remove](payload) {
        return payload;
    }
    [types_1.Method.Set](payload) {
        return payload;
    }
    [types_1.Method.SetMany](payload) {
        return payload;
    }
    [types_1.Method.Size](payload) {
        return payload;
    }
    [types_1.Method.Some](payload) {
        return payload;
    }
    [types_1.Method.Update](payload) {
        return payload;
    }
    [types_1.Method.Values](payload) {
        return payload;
    }
    run(payload) {
        return payload;
    }
    /**
     * Adds the options of this class to an object.
     * @since 2.0.0
     * @returns The options for this middleware as an object.
     */
    toJSON() {
        return { name: this.name, position: this.position, conditions: this.conditions };
    }
    /**
     * The Josh instance this middleware is currently running on.
     * @since 2.0.0
     */
    get instance() {
        if (this.store === undefined)
            throw new errors_1.JoshError({
                identifier: Middleware.Identifiers.StoreNotFound,
                message: 'The "store" property is undefined. This usually means this middleware has not been initiated.'
            });
        return this.store.instance;
    }
    /**
     * The provider that is used with the current Josh.
     * @since 2.0.0
     */
    get provider() {
        return this.instance.provider;
    }
}
exports.Middleware = Middleware;
(function (Middleware) {
    let Identifiers;
    (function (Identifiers) {
        Identifiers["StoreNotFound"] = "storeNotFound";
    })(Identifiers = Middleware.Identifiers || (Middleware.Identifiers = {}));
})(Middleware = exports.Middleware || (exports.Middleware = {}));
//# sourceMappingURL=Middleware.js.map