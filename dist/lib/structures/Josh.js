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
/**
 * The base class that makes Josh work.
 * @see {@link Josh.Options} for all options available to the Josh class.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const josh = new Josh({
 *   name: 'name',
 *   // More options...
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using a provider.
 * const josh = new Josh({
 *   provider: new Provider(),
 *   // More options...
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Automatically scan from a specific directory.
 * // The main file is at `/hom/me/project/index.js`
 * // and all your pieces are at `/home/me/project/middlewares`
 * // NOTE: Do not use this option unless you know what you're doing.
 * const josh = new Josh({
 *   middlewareDirectory: join(__dirname, 'middlewares'),
 *   // More options
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using middleware context
 * const josh = new Josh({
 *   middlewareContextData: {
 *     [BuiltInMiddleware.AutoEnsure]: {
 *       defaultValue: 'value'
 *     }
 *   },
 *   // More options...
 * });
 */
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
    /**
     * Generate an automatic key. Generally an integer incremented by `1`, but depends on provider.
     * @since 2.0.0
     * @returns The newly generated automatic key.
     *
     * @example
     * ```typescript
     * const key = await josh.autoKey();
     *
     * await josh.set(key, 'value');
     * ```
     */
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
    /**
     * Decrement an integer by `1`.
     * @since 2.0.0
     * @param keyPath The key/path to the integer for decrementing.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', 1);
     *
     * await josh.dec('key');
     *
     * await josh.get('key'); // 0
     * ```
     */
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
    /**
     * Deletes a key or path in a key value.
     * @since 2.0.0
     * @param keyPath The key/path to delete from.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.delete('key');
     *
     * await josh.get('key'); // null
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { key: 'value' });
     *
     * await josh.delete(['key', ['key']]);
     *
     * await josh.get('key'); // {}
     * ```
     */
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
    /**
     * Ensure a key exists and set a default value if it doesn't.
     * @since 2.0.0
     * @param key The key to ensure.
     * @param defaultValue The default value to set if the key doesn't exist.
     * @returns The value gotten from the key.
     *
     * @example
     * ```typescript
     * await josh.ensure('key', 'defaultValue'); // 'defaultValue'
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.ensure('key', 'defaultValue'); // 'value'
     * ```
     */
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
    /**
     * Filter data using a path and value or function and optional path.
     * @param pathOrHook The path array or function.
     * @param pathOrValue The value or path array.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     */
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
    /**
     * Find data using a path and value or function and optional path.
     * @param pathOrHook The path array or function.
     * @param pathOrValue The value or path array.
     * @returns The data found or `null`.
     */
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
    /**
     * Get data at a specific key/path.
     * @since 2.0.0
     * @param keyPath The key/path to get data from.
     * @returns The data found or `null`.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.get('key'); // 'value'
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.get(['key', ['path']]); // 'value'
     * ```
     */
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
    /**
     * Get all data.
     * @since 2.0.0
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.getAll(); // { key: 'value' }
     * // Using a return bulk type.
     * await josh.getAll(Bulk.OneDimensionalArray); // ['value']
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.getAll(); // { key: { path: 'value' } }
     * // Using a return bulk type.
     * await josh.getAll(Bulk.TwoDimensionalArray); // [['key', { path: 'value' }]]
     * ```
     */
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
    /**
     * Get data at many key/paths.
     * @since 2.0.0
     * @param keyPaths The key/paths to get from.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.getMany([['key', []]]); // { key: 'value' };
     * // Using a return bulk type.
     * await josh.getMany([['key', []]], Bulk.OneDimensionalArray); // ['value']
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.getMany([['key', ['path']]]); // { key: 'value' }
     * // Using a return bulk type.
     * await josh.getMany([['key', ['path]]], Bulk.TwoDimensionalArray); // [['key', 'value']]
     * ```
     */
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
    /**
     * Increment an integer by `1`.
     * @since 2.0.0
     * @param keyPath The key/path to the integer for incrementing.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', 0);
     *
     * await josh.inc('key');
     *
     * await josh.get('key'); // 1
     * ```
     */
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
    /**
     * Get an array of keys.
     * @since 2.0.0
     * @returns The array of string keys.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.keys(); // ['key']
     * ```
     */
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
    /**
     * Push a value to an array at a specific key/value.
     * @since 2.0.0
     * @param keyPath The key/path to the array for pushing.
     * @param value The value to push to the array.
     * @returns The {@link Josh} instance.
     */
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
    /**
     * Get a random value.
     * @since 2.0.0
     * @returns The random data or `null`.
     */
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
    /**
     * Get a random key.
     * @since 2.0.0
     * @returns The random key or `null`.
     */
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
    /**
     * Set data at a specific key/path.
     * @since 2.0.0
     * @param keyPath The key/path to the data for setting.
     * @param value The value to set at the key/path.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.get('key'); // 'value';
     * ```
     */
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
    /**
     * Set data at many key/paths.
     * @since 2.0.0
     * @param keyPaths The key/paths to the data for setting.
     * @param value The value to set at the key/paths.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.setMany([['key', []]], 'value');
     *
     * await josh.getMany([['key', []]]); // { key: 'value' }
     * ```
     */
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
    /**
     * Get the amount of key/values
     * @since 2.0.0
     * @returns The number amount.
     *
     * @example
     * ```typescript
     * await josh.size(); // 0
     * ```
     */
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
    /**
     * Check if data matches with a path and value or function and optional path.
     * @since 2.0.0
     * @param pathOrHook The path array or function.
     * @param pathOrValue The value or path array.
     * @returns Whether the data check is `true` or `false`.
     */
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
    /**
     * Update data at a specific key/path.
     * @since 2.0.0
     * @param keyPath The key/path to data for updating.
     * @param inputDataOrHook The input, either a value or a function.
     * @returns The updated value or `null` if the data doesn't exist.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.update('key', 'anotherValue'); // 'anotherValue'
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' })
     *
     * await josh.update('key', (data) => {
     *   data.anotherPath = 'anotherValue';
     *
     *   return data;
     * }); // { path: 'value', anotherPath: 'anotherValue' }
     * ```
     */
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
    /**
     * Get all data values.
     * @since 2.0.0
     * @returns An array of data values.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     * await josh.set('anotherKey', 'anotherValue');
     *
     * await josh.values(); // ['value', 'anotherValue']
     * ```
     */
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
    /**
     * The initialization method for Josh.
     * @since 2.0.0
     * @returns The {@link Josh} instance
     *
     * @example
     * ```typescript
     * await josh.init();
     * ```
     */
    async init() {
        await this.middlewares.loadAll();
        const context = await this.provider.init({ name: this.name, instance: this });
        if (context.error)
            throw context.error;
        return this;
    }
    /**
     * Enables a middleware that was not enabled by default.
     * @since 2.0.0
     * @param name The name of the middleware to enable.
     */
    use(name) {
        const middleware = this.middlewares.get(name);
        if (!middleware)
            throw new errors_1.JoshError({ identifier: Josh.Identifiers.MiddlewareNotFound, message: `The middleware "${name}" does not exist.` });
        middleware.use = true;
        this.middlewares.set(name, middleware);
        return this;
    }
    /** A private method for converting bulk data.
     * @since 2.0.0
     * @private
     * @param data The data to convert.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     */
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
    /**
     * A private method for extracting the key/path from a {@link KeyPath} type.
     * @since 2.0.0
     * @private
     * @param keyPath The key/path to extract from.
     * @returns The extracted key/path data.
     */
    getKeyPath(keyPath) {
        if (typeof keyPath === 'string')
            return [keyPath, undefined];
        return keyPath;
    }
    /**
     * A static method to create multiple instances of {@link Josh}.
     * @since 2.0.0
     * @param names The names to give each instance of {@link Josh}
     * @param options The options to give all the instances.
     * @returns
     */
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