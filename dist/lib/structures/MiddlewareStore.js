"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareStore = void 0;
const pieces_1 = require("@sapphire/pieces");
const Middleware_1 = require("./Middleware");
class MiddlewareStore extends pieces_1.Store {
    constructor(options) {
        super(Middleware_1.Middleware, { name: 'middlewares' });
        const { instance } = options;
        this.instance = instance;
    }
    filterByCondition(method, trigger) {
        const middlewares = this.array().filter((middleware) => middleware.use && middleware.conditions.some((c) => c.methods.includes(method) && c.trigger === trigger));
        const withPositions = middlewares.filter((middleware) => Boolean(middleware.position));
        const withoutPositions = middlewares.filter((middleware) => !middleware.position);
        return [...withPositions.sort((a, b) => a.position - b.position), ...withoutPositions];
    }
}
exports.MiddlewareStore = MiddlewareStore;
//# sourceMappingURL=MiddlewareStore.js.map