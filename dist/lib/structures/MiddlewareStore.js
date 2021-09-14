"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareStore = void 0;
const pieces_1 = require("@sapphire/pieces");
const Middleware_1 = require("./Middleware");
/**
 * The store to contain {@link Middleware} pieces.
 * @since 2.0.0
 */
class MiddlewareStore extends pieces_1.Store {
    constructor(options) {
        super(Middleware_1.Middleware, { name: 'middlewares' });
        const { instance } = options;
        this.instance = instance;
    }
    array() {
        return Array.from(this.values());
    }
    /**
     * Filter middlewares by their conditions.
     * @since 2.0.0
     * @param method The method to filter by.
     * @param trigger The trigger to filter by.
     * @returns An array of middleware's in which the method and trigger matched.
     */
    filterByCondition(method, trigger) {
        const middlewares = this.array().filter((middleware) => middleware.use && middleware.conditions.some((c) => c.methods.includes(method) && c.trigger === trigger));
        const withPositions = middlewares.filter((middleware) => (middleware.position === undefined ? false : true));
        const withoutPositions = middlewares.filter((middleware) => (middleware.position === undefined ? true : false));
        return [...withPositions.sort((a, b) => a.position - b.position), ...withoutPositions];
    }
}
exports.MiddlewareStore = MiddlewareStore;
//# sourceMappingURL=MiddlewareStore.js.map