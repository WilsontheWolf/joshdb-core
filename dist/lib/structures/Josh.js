"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulk = exports.Josh = void 0;
const pieces_1 = require("@sapphire/pieces");
const utilities_1 = require("@sapphire/utilities");
const path_1 = require("path");
const errors_1 = require("../errors");
const payloads_1 = require("../payloads");
const types_1 = require("../types");
const defaultProvider_1 = require("./defaultProvider");
const JoshProvider_1 = require("./JoshProvider");
const MiddlewareStore_1 = require("./MiddlewareStore");
class Josh {
    constructor(options) {
        const { name, provider, middlewareDirectory } = options;
        this.options = options;
        if (!name)
            throw new errors_1.JoshError({ identifier: Josh.Identifiers.MissingName, message: 'The "name" option is required to initiate a Josh instance.' });
        this.name = name;
        this.provider = provider ?? new defaultProvider_1.MapProvider();
        if (!(this.provider instanceof JoshProvider_1.JoshProvider))
            throw new errors_1.JoshError({
                identifier: Josh.Identifiers.InvalidProvider,
                message: 'The "provider" option must extend the exported "JoshProvider" class.'
            });
        this.middlewares = new MiddlewareStore_1.MiddlewareStore({ instance: this })
            .registerPath(middlewareDirectory ?? path_1.join(pieces_1.getRootData().root, 'middlewares', this.name))
            .registerPath(path_1.join(__dirname, '..', '..', 'middlewares'));
    }
    async autoKey() {
        let payload = { method: types_1.Method.AutoKey, trigger: types_1.Trigger.PreProvider, data: '' };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.AutoKey, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.AutoKey](payload);
        payload = await this.provider.autoKey(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.AutoKey, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.AutoKey](payload);
        return payload.data;
    }
    async dec(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Dec, trigger: types_1.Trigger.PreProvider, key, path };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Dec, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Dec](payload);
        payload = await this.provider.dec(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Dec, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Dec](payload);
        return this;
    }
    async delete(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Delete, trigger: types_1.Trigger.PreProvider, key, path };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Delete, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Delete](payload);
        payload = await this.provider.delete(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Delete, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Delete](payload);
        return this;
    }
    async ensure(key, defaultValue) {
        let payload = { method: types_1.Method.Ensure, trigger: types_1.Trigger.PreProvider, key, data: defaultValue, defaultValue };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Ensure, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Ensure](payload);
        payload = await this.provider.ensure(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Ensure, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Ensure](payload);
        return payload.data;
    }
    async filter(pathOrHook, pathOrValue, returnBulkType) {
        if (Array.isArray(pathOrHook)) {
            if (pathOrValue === undefined)
                throw new errors_1.JoshError({
                    identifier: Josh.Identifiers.FilterMissingValue,
                    message: 'The "value" parameter is required when filtering by data.'
                });
            let payload = {
                method: types_1.Method.Filter,
                trigger: types_1.Trigger.PreProvider,
                type: payloads_1.Payload.Type.Data,
                path: pathOrHook,
                inputData: pathOrValue,
                data: {}
            };
            const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Filter, types_1.Trigger.PreProvider);
            for (const middleware of preMiddlewares)
                payload = await middleware[types_1.Method.Filter](payload);
            payload = await this.provider.filterByData(payload);
            payload.trigger = types_1.Trigger.PostProvider;
            if (payload.error)
                throw payload.error;
            const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Filter, types_1.Trigger.PostProvider);
            for (const middleware of postMiddlewares)
                payload = await middleware[types_1.Method.Filter](payload);
            return this.convertBulkData(payload.data, returnBulkType);
        }
        if (pathOrValue !== undefined && !Array.isArray(pathOrValue))
            throw new errors_1.JoshError({ identifier: Josh.Identifiers.FilterInvalidPath, message: 'The "path" parameter must be an array of strings.' });
        let payload = {
            method: types_1.Method.Filter,
            trigger: types_1.Trigger.PreProvider,
            type: payloads_1.Payload.Type.Hook,
            path: pathOrValue,
            inputHook: pathOrHook,
            data: {}
        };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Filter, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Filter](payload);
        payload = await this.provider.filterByHook(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Filter, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Filter](payload);
        return this.convertBulkData(payload.data, returnBulkType);
    }
    async find(pathOrHook, pathOrValue) {
        if (Array.isArray(pathOrHook)) {
            if (pathOrValue === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.FindMissingValue, message: 'The "value" parameter is required when finding by data.' });
            let payload = {
                method: types_1.Method.Find,
                trigger: types_1.Trigger.PreProvider,
                type: payloads_1.Payload.Type.Data,
                path: pathOrHook,
                inputData: pathOrValue
            };
            const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Find, types_1.Trigger.PreProvider);
            for (const middleware of preMiddlewares)
                payload = await middleware[types_1.Method.Find](payload);
            payload = await this.provider.findByData(payload);
            payload.trigger = types_1.Trigger.PostProvider;
            if (payload.error)
                throw payload.error;
            const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Find, types_1.Trigger.PostProvider);
            for (const middleware of postMiddlewares)
                payload = await middleware[types_1.Method.Find](payload);
            return payload.data ?? null;
        }
        if (pathOrValue !== undefined && !Array.isArray(pathOrValue))
            throw new errors_1.JoshError({ identifier: Josh.Identifiers.FindInvalidPath, message: 'The "path" parameter must be an array of strings.' });
        let payload = {
            method: types_1.Method.Find,
            trigger: types_1.Trigger.PreProvider,
            type: payloads_1.Payload.Type.Hook,
            path: pathOrValue,
            inputHook: pathOrHook
        };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Find, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Find](payload);
        payload = await this.provider.findByHook(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Find, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Find](payload);
        return payload.data ?? null;
    }
    async get(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Get, trigger: types_1.Trigger.PreProvider, key, path };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Get, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Get](payload);
        payload = await this.provider.get(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Get, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Get](payload);
        return payload.data ?? null;
    }
    async getAll(returnBulkType) {
        let payload = { method: types_1.Method.GetAll, trigger: types_1.Trigger.PreProvider, data: {} };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.GetAll, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.GetAll](payload);
        payload = await this.provider.getAll(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.GetAll, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.GetAll](payload);
        return this.convertBulkData(payload.data, returnBulkType);
    }
    async getMany(keyPaths, returnBulkType) {
        let payload = { method: types_1.Method.GetMany, trigger: types_1.Trigger.PreProvider, keyPaths, data: {} };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.GetMany, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.GetMany](payload);
        payload = await this.provider.getMany(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.GetMany, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.GetMany](payload);
        return this.convertBulkData(payload.data, returnBulkType);
    }
    async has(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Has, trigger: types_1.Trigger.PreProvider, key, path, data: false };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Has, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Has](payload);
        payload = await this.provider.has(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Has, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Has](payload);
        return payload.data;
    }
    async inc(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Inc, trigger: types_1.Trigger.PreProvider, key, path };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Inc, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Inc](payload);
        payload = await this.provider.inc(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Inc, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Inc](payload);
        return this;
    }
    async keys() {
        let payload = { method: types_1.Method.Keys, trigger: types_1.Trigger.PreProvider, data: [] };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Keys, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Keys](payload);
        payload = await this.provider.keys(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Keys, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Keys](payload);
        return payload.data;
    }
    async push(keyPath, value) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Push, trigger: types_1.Trigger.PreProvider, key, path };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Push, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Push](payload);
        payload = await this.provider.push(payload, value);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Push, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Push](payload);
        return this;
    }
    async random() {
        let payload = { method: types_1.Method.Random, trigger: types_1.Trigger.PreProvider };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Random, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Random](payload);
        payload = await this.provider.random(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Random, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Random](payload);
        return payload.data ?? null;
    }
    async randomKey() {
        let payload = { method: types_1.Method.RandomKey, trigger: types_1.Trigger.PreProvider };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.RandomKey, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.RandomKey](payload);
        payload = await this.provider.randomKey(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.RandomKey, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.RandomKey](payload);
        return payload.data ?? null;
    }
    async set(keyPath, value) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Set, trigger: types_1.Trigger.PreProvider, key, path };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Set, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Set](payload);
        payload = await this.provider.set(payload, value);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Set, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Set](payload);
        return this;
    }
    async setMany(keyPaths, value) {
        let payload = { method: types_1.Method.SetMany, trigger: types_1.Trigger.PreProvider, keyPaths };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.SetMany, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.SetMany](payload);
        payload = await this.provider.setMany(payload, value);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.SetMany, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.SetMany](payload);
        return this;
    }
    async size() {
        let payload = { method: types_1.Method.Size, trigger: types_1.Trigger.PreProvider, data: 0 };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Size, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Size](payload);
        payload = await this.provider.size(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Size, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Size](payload);
        return payload.data;
    }
    async some(pathOrHook, pathOrValue) {
        if (Array.isArray(pathOrHook)) {
            if (pathOrValue === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.SomeMissingValue, message: 'The "value" parameter is required when finding by data.' });
            let payload = {
                method: types_1.Method.Some,
                trigger: types_1.Trigger.PreProvider,
                type: payloads_1.Payload.Type.Data,
                path: pathOrHook,
                inputData: pathOrValue,
                data: false
            };
            const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Some, types_1.Trigger.PreProvider);
            for (const middleware of preMiddlewares)
                payload = await middleware[types_1.Method.Some](payload);
            payload = await this.provider.someByData(payload);
            payload.trigger = types_1.Trigger.PostProvider;
            if (payload.error)
                throw payload.error;
            const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Some, types_1.Trigger.PostProvider);
            for (const middleware of postMiddlewares)
                payload = await middleware[types_1.Method.Some](payload);
            return payload.data;
        }
        if (pathOrValue !== undefined && !Array.isArray(pathOrValue))
            throw new errors_1.JoshError({ identifier: Josh.Identifiers.SomeInvalidPath, message: 'The "path" parameter must be an array of strings.' });
        let payload = {
            method: types_1.Method.Some,
            trigger: types_1.Trigger.PreProvider,
            type: payloads_1.Payload.Type.Hook,
            path: pathOrValue,
            inputHook: pathOrHook,
            data: false
        };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Some, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Some](payload);
        payload = await this.provider.someByHook(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Some, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Some](payload);
        return payload.data;
    }
    async update(keyPath, inputDataOrHook) {
        const [key, path] = this.getKeyPath(keyPath);
        if (utilities_1.isFunction(inputDataOrHook)) {
            let payload = {
                method: types_1.Method.Update,
                key,
                path,
                type: payloads_1.Payload.Type.Hook,
                inputHook: inputDataOrHook
            };
            const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Update, types_1.Trigger.PreProvider);
            for (const middleware of preMiddlewares)
                payload = await middleware[types_1.Method.Update](payload);
            payload = await this.provider.updateByHook(payload);
            payload.trigger = types_1.Trigger.PostProvider;
            if (payload.error)
                throw payload.error;
            const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Update, types_1.Trigger.PostProvider);
            for (const middleware of postMiddlewares)
                payload = await middleware[types_1.Method.Update](payload);
            return payload.data ?? null;
        }
        let payload = { method: types_1.Method.Update, key, path, type: payloads_1.Payload.Type.Data, inputData: inputDataOrHook };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Update, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Update](payload);
        payload = await this.provider.updateByData(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Update, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Update](payload);
        return payload.data ?? null;
    }
    async values() {
        let payload = { method: types_1.Method.Values, trigger: types_1.Trigger.PreProvider, data: [] };
        const preMiddlewares = this.middlewares.filterByCondition(types_1.Method.Values, types_1.Trigger.PreProvider);
        for (const middleware of preMiddlewares)
            payload = await middleware[types_1.Method.Values](payload);
        payload = await this.provider.values(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        const postMiddlewares = this.middlewares.filterByCondition(types_1.Method.Values, types_1.Trigger.PostProvider);
        for (const middleware of postMiddlewares)
            payload = await middleware[types_1.Method.Values](payload);
        return payload.data;
    }
    async init() {
        await this.middlewares.loadAll();
        const context = await this.provider.init({ name: this.name, instance: this });
        if (context.error)
            throw context.error;
        return this;
    }
    use(name) {
        const middleware = this.middlewares.get(name);
        if (!middleware)
            throw new errors_1.JoshError({ identifier: Josh.Identifiers.MiddlewareNotFound, message: `The middleware "${name}" does not exist.` });
        middleware.use = true;
        this.middlewares.set(name, middleware);
        return this;
    }
    convertBulkData(data, returnBulkType) {
        switch (returnBulkType) {
            case Bulk.Object:
                return data;
            case Bulk.Map:
                return new Map(Object.entries(data));
            case Bulk.OneDimensionalArray:
                return Object.values(data);
            case Bulk.TwoDimensionalArray:
                return Object.entries(data);
            default:
                return data;
        }
    }
    getKeyPath(keyPath) {
        if (typeof keyPath === 'string')
            return [keyPath, undefined];
        return keyPath;
    }
    static multi(names, options = {}) {
        const instances = {};
        for (const [name, instance] of names.map((name) => [name, new Josh({ ...options, name })]))
            instances[name] = instance;
        // @ts-expect-error 2322
        return instances;
    }
}
exports.Josh = Josh;
(function (Josh) {
    let Identifiers;
    (function (Identifiers) {
        Identifiers["FilterInvalidPath"] = "filterInvalidPath";
        Identifiers["FilterMissingValue"] = "filterMissingValue";
        Identifiers["FindInvalidPath"] = "findInvalidPath";
        Identifiers["FindMissingValue"] = "findMissingValue";
        Identifiers["MissingName"] = "missingName";
        Identifiers["InvalidProvider"] = "invalidProvider";
        Identifiers["MiddlewareNotFound"] = "middlewareNotFound";
        Identifiers["SomeInvalidPath"] = "someInvalidPath";
        Identifiers["SomeMissingValue"] = "someMissingValue";
    })(Identifiers = Josh.Identifiers || (Josh.Identifiers = {}));
})(Josh = exports.Josh || (exports.Josh = {}));
var Bulk;
(function (Bulk) {
    Bulk[Bulk["Object"] = 0] = "Object";
    Bulk[Bulk["Map"] = 1] = "Map";
    Bulk[Bulk["OneDimensionalArray"] = 2] = "OneDimensionalArray";
    Bulk[Bulk["TwoDimensionalArray"] = 3] = "TwoDimensionalArray";
})(Bulk = exports.Bulk || (exports.Bulk = {}));
//# sourceMappingURL=Josh.js.map