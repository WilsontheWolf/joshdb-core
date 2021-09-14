"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreMiddleware = void 0;
const tslib_1 = require("tslib");
const ApplyOptions_1 = require("../lib/decorators/ApplyOptions");
const Middleware_1 = require("../lib/structures/Middleware");
const types_1 = require("../lib/types");
let CoreMiddleware = class CoreMiddleware extends Middleware_1.Middleware {
    async [types_1.Method.Dec](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
    async [types_1.Method.Get](payload) {
        if (payload.data !== undefined)
            return payload;
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        const { data } = await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        Reflect.set(payload, 'data', data);
        return payload;
    }
    async [types_1.Method.GetMany](payload) {
        if (Object.keys(payload.data).length !== 0)
            return payload;
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        for (const [key] of payload.keys) {
            if (payload.data[key] !== null)
                continue;
            const { data } = await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
            Reflect.set(payload, 'data', data);
        }
        return payload;
    }
    async [types_1.Method.Inc](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
    async [types_1.Method.Push](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
    async [types_1.Method.Remove](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
    async [types_1.Method.Set](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
    async [types_1.Method.SetMany](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        for (const key of payload.keys)
            await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
    async [types_1.Method.Update](payload) {
        const context = this.getContext();
        if (!context)
            return payload;
        const { defaultValue } = context;
        const { key } = payload;
        await this.provider.ensure({ method: types_1.Method.Ensure, key, data: defaultValue, defaultValue });
        return payload;
    }
};
CoreMiddleware = (0, tslib_1.__decorate)([
    (0, ApplyOptions_1.ApplyOptions)({
        name: types_1.BuiltInMiddleware.AutoEnsure,
        position: 0,
        conditions: [
            {
                methods: [types_1.Method.Dec, types_1.Method.Inc, types_1.Method.Push, types_1.Method.Remove, types_1.Method.Set, types_1.Method.SetMany],
                trigger: types_1.Trigger.PreProvider
            },
            {
                methods: [types_1.Method.Get, types_1.Method.GetMany, types_1.Method.Update],
                trigger: types_1.Trigger.PostProvider
            }
        ],
        use: false
    })
], CoreMiddleware);
exports.CoreMiddleware = CoreMiddleware;
//# sourceMappingURL=CoreAutoEnsure.js.map