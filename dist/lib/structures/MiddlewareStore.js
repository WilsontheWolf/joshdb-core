"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareStore = void 0;
const types_1 = require("../types");
/**
 * The store to contain {@link Middleware} classes.
 * @since 2.0.0
 */
class MiddlewareStore extends Map {
    constructor(options) {
        super();
        const { instance } = options;
        this.instance = instance;
    }
    /**
     * Gets an array of middlewares.
     * @since 2.0.0
     * @returns The array of middlewares.
     */
    array() {
        return Array.from(this.values());
    }
    /**
     * Get pre provider middlewares by method.
     * @since 2.0.0
     * @param method The method to filter by.
     * @returns The middlewares after filtered.
     */
    getPreMiddlewares(method) {
        return this.filterByCondition(method, types_1.Trigger.PreProvider);
    }
    /**
     * Get post provider middlewares by method.
     * @since 2.0.0
     * @param method The method to filter by.
     * @returns The middlewares after filtered.
     */
    getPostMiddlewares(method) {
        return this.filterByCondition(method, types_1.Trigger.PostProvider);
    }
    /**
     * Filter middlewares by their conditions.
     * @since 2.0.0
     * @param method
     * @param trigger
     * @returns
     */
    filterByCondition(method, trigger) {
        const middlewares = this.array().filter((middleware) => trigger === types_1.Trigger.PreProvider ? middleware.conditions.pre.includes(method) : middleware.conditions.post.includes(method));
        const withPositions = middlewares.filter((middleware) => middleware.position !== undefined);
        const withoutPositions = middlewares.filter((middleware) => middleware.position !== undefined);
        return [...withPositions.sort((a, b) => a.position - b.position), ...withoutPositions];
    }
}
exports.MiddlewareStore = MiddlewareStore;
//# sourceMappingURL=MiddlewareStore.js.map