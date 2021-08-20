"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const pieces_1 = require("@sapphire/pieces");
const JoshError_1 = require("../errors/JoshError");
const types_1 = require("../types");
/**
 * The base class piece for creating middlewares. Extend this piece to create a middleware.
 * @see {@link Middleware.Options} for all available options for middlewares.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * (at)ApplyOptions<MiddlewareOptions>({
 *   name: 'middleware',
 *   // More options...
 * })
 * export class CoreMiddleware extends Middleware {
 *   // Make method implementations...
 * }
 * ```
 */
class Middleware extends pieces_1.Piece {
    constructor(context, options = {}) {
        super(context, options);
        const { position, conditions, use } = options;
        if (!conditions)
            throw new JoshError_1.JoshError({
                identifier: Middleware.Identifiers.MissingConditions,
                message: 'The "conditions" property is a required Middleware option.'
            });
        this.position = position;
        this.conditions = conditions;
        this.use = use ?? true;
    }
    [types_1.Method.AutoKey](payload) {
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
    toJSON() {
        return { ...super.toJSON(), position: this.position, conditions: this.conditions, use: this.use };
    }
    /**
     * Retrieve this middleware'es context data from the Josh instance.
     * @since 2.0.0
     * @returns The context or `undefined`
     */
    getContext() {
        const contextData = this.instance.options.middlewareContextData ?? {};
        return Reflect.get(contextData, this.name);
    }
    /**
     * Get this middleware's Josh instance.
     * @since 2.0.0
     */
    get instance() {
        return this.store.instance;
    }
    /**
     * Get this middleware's provider instance.
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
        Identifiers["MissingConditions"] = "missingConditions";
    })(Identifiers = Middleware.Identifiers || (Middleware.Identifiers = {}));
})(Middleware = exports.Middleware || (exports.Middleware = {}));
//# sourceMappingURL=Middleware.js.map