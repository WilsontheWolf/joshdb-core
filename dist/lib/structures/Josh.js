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
            .registerPath(middlewareDirectory ?? (0, path_1.join)((0, pieces_1.getRootData)().root, 'middlewares', this.name))
            .registerPath((0, path_1.join)(__dirname, '..', '..', 'middlewares'));
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.AutoKey))
            payload = await middleware[types_1.Method.AutoKey](payload);
        payload = await this.provider[types_1.Method.AutoKey](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.AutoKey))
            payload = await middleware[types_1.Method.AutoKey](payload);
        return payload.data;
    }
    async clear() {
        let payload = { method: types_1.Method.Clear, trigger: types_1.Trigger.PreProvider };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Clear))
            payload = await middleware[types_1.Method.Clear](payload);
        payload = await this.provider[types_1.Method.Clear](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Clear))
            payload = await middleware[types_1.Method.Clear](payload);
        return this;
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Dec))
            payload = await middleware[types_1.Method.Dec](payload);
        payload = await this.provider[types_1.Method.Dec](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Dec))
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Delete))
            payload = await middleware[types_1.Method.Delete](payload);
        payload = await this.provider[types_1.Method.Delete](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Delete))
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
        let payload = { method: types_1.Method.Ensure, trigger: types_1.Trigger.PreProvider, key, defaultValue, data: defaultValue };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Ensure))
            payload = await middleware[types_1.Method.Ensure](payload);
        payload = await this.provider[types_1.Method.Ensure](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Ensure))
            payload = await middleware[types_1.Method.Ensure](payload);
        return payload.data;
    }
    async every(pathOrHook, value) {
        if (!(0, utilities_1.isFunction)(pathOrHook)) {
            if (value === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.EveryMissingValue, message: 'The "value" parameter was not found.' });
            if (!(0, utilities_1.isPrimitive)(value))
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.EveryInvalidValue, message: 'The "value" parameter must be a primitive type.' });
        }
        let payload = {
            method: types_1.Method.Every,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(pathOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Value,
            data: true
        };
        if ((0, utilities_1.isFunction)(pathOrHook))
            payload.hook = pathOrHook;
        else {
            payload.path = pathOrHook;
            payload.value;
        }
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Every))
            payload = await middleware[types_1.Method.Every](payload);
        payload = await this.provider[types_1.Method.Every](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Every))
            payload = await middleware[types_1.Method.Every](payload);
        return payload.data;
    }
    async filter(pathOrHook, value, returnBulkType) {
        if (!(0, utilities_1.isFunction)(pathOrHook)) {
            if (value === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.FilterMissingValue, message: 'The "value" parameter was not found.' });
            if (!(0, utilities_1.isPrimitive)(value))
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.FilterInvalidValue, message: 'The "value" parameter must be a primitive type.' });
        }
        let payload = {
            method: types_1.Method.Filter,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(pathOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Value,
            data: {}
        };
        if ((0, utilities_1.isFunction)(pathOrHook))
            payload.hook = pathOrHook;
        else {
            payload.path = pathOrHook;
            payload.value = value;
        }
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Filter))
            payload = await middleware[types_1.Method.Filter](payload);
        payload = await this.provider[types_1.Method.Filter](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Filter))
            payload = await middleware[types_1.Method.Filter](payload);
        return this.convertBulkData(payload.data, returnBulkType);
    }
    async find(pathOrHook, value) {
        if (!(0, utilities_1.isFunction)(pathOrHook)) {
            if (value === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.FindMissingValue, message: 'The "value" parameter was not found.' });
            if (!(0, utilities_1.isPrimitive)(value))
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.FindInvalidValue, message: 'The "value" parameter must be a primitive type.' });
        }
        let payload = {
            method: types_1.Method.Find,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(pathOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Value
        };
        if ((0, utilities_1.isFunction)(pathOrHook))
            payload.hook = pathOrHook;
        else {
            payload.path = pathOrHook;
            payload.value = value;
        }
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Find))
            payload = await middleware[types_1.Method.Find](payload);
        payload = await this.provider[types_1.Method.Find](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Find))
            payload = await middleware[types_1.Method.Find](payload);
        return payload.data ?? null;
    }
    async get(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Get, trigger: types_1.Trigger.PreProvider, key, path };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Get))
            payload = await middleware[types_1.Method.Get](payload);
        payload = await this.provider.get(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Get))
            payload = await middleware[types_1.Method.Get](payload);
        return payload.data ?? null;
    }
    /**
     * Get all stored values.
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.GetAll))
            payload = await middleware[types_1.Method.GetAll](payload);
        payload = await this.provider.getAll(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.GetAll))
            payload = await middleware[types_1.Method.GetAll](payload);
        return this.convertBulkData(payload.data, returnBulkType);
    }
    /**
     * Get stored values at multiple keys.
     * @since 2.0.0
     * @param keys An array of keys to get values from.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await this.getMany(['key']); // { key: 'value' }
     * // Using a return bulk type.
     * await this.getMany(['key'], Bulk.OneDimensionalArray); // ['value']
     * ```
     */
    async getMany(keys, returnBulkType) {
        let payload = { method: types_1.Method.GetMany, trigger: types_1.Trigger.PreProvider, keys, data: {} };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.GetMany))
            payload = await middleware[types_1.Method.GetMany](payload);
        payload = await this.provider[types_1.Method.GetMany](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.GetMany))
            payload = await middleware[types_1.Method.GetMany](payload);
        return this.convertBulkData(payload.data, returnBulkType);
    }
    /**
     * Check if a key and/or path exists.
     * @since 2.0.0
     * @param keyPath A key and/or path to the value to check for.
     * @returns Validation boolean.
     *
     * @example
     * ```typescript
     * await josh.has('key'); // false
     *
     * await josh.set('key', 'value');
     *
     * await josh.has('key'); // true
     * ```
     */
    async has(keyPath) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Has, trigger: types_1.Trigger.PreProvider, key, path, data: false };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Has))
            payload = await middleware[types_1.Method.Has](payload);
        payload = await this.provider.has(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Has))
            payload = await middleware[types_1.Method.Has](payload);
        return payload.data;
    }
    /**
     * Increment an integer by `1`.
     * @since 2.0.0
     * @param keyPath The key and/or path to an integer value for incrementing.
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Inc))
            payload = await middleware[types_1.Method.Inc](payload);
        payload = await this.provider.inc(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Inc))
            payload = await middleware[types_1.Method.Inc](payload);
        return this;
    }
    /**
     * Returns all stored value keys.
     * @since 2.0.0
     * @returns The array of stored value keys.
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Keys))
            payload = await middleware[types_1.Method.Keys](payload);
        payload = await this.provider.keys(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Keys))
            payload = await middleware[types_1.Method.Keys](payload);
        return payload.data;
    }
    /**
     * Map stored values by path or hook function.
     * @since 2.0.0
     * @param pathOrHook The path or hook to map by.
     * @returns The mapped values.
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.map(['path']); // ['value']
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.map((value) => value.toUpperCase()); // ['VALUE']
     * ```
     */
    async map(pathOrHook) {
        let payload = {
            method: types_1.Method.Map,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(pathOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Path,
            data: []
        };
        if ((0, utilities_1.isFunction)(pathOrHook))
            payload.hook = pathOrHook;
        else
            payload.path = pathOrHook;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Map))
            payload = await middleware[types_1.Method.Map](payload);
        payload = await this.provider[types_1.Method.Map](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Map))
            payload = await middleware[types_1.Method.Map](payload);
        return payload.data;
    }
    async partition(pathOrHook, value, returnBulkType) {
        if (!(0, utilities_1.isFunction)(pathOrHook)) {
            if (value === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.PartitionMissingValue, message: 'The "value" parameter was not found.' });
            if (!(0, utilities_1.isPrimitive)(value))
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.PartitionInvalidValue, message: 'The "value" parameter must be a primitive type.' });
        }
        let payload = {
            method: types_1.Method.Partition,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(pathOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Value,
            data: { truthy: {}, falsy: {} }
        };
        if ((0, utilities_1.isFunction)(pathOrHook))
            payload.hook = pathOrHook;
        else {
            payload.path = pathOrHook;
            payload.value = value;
        }
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Partition))
            payload = await middleware[types_1.Method.Partition](payload);
        payload = await this.provider[types_1.Method.Partition](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Partition))
            payload = await middleware[types_1.Method.Partition](payload);
        const { truthy, falsy } = payload.data;
        return [this.convertBulkData(truthy, returnBulkType), this.convertBulkData(falsy, returnBulkType)];
    }
    /**
     * Push a value to an array.
     * @since 2.0.0
     * @param keyPath A key and/or path to the array.
     * @param value The value to push.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', []);
     *
     * await josh.push('key', 'value');
     *
     * await josh.get('key'); // ['value']
     * ```
     */
    async push(keyPath, value) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Push, trigger: types_1.Trigger.PreProvider, key, path, value };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Push))
            payload = await middleware[types_1.Method.Push](payload);
        payload = await this.provider[types_1.Method.Push](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Push))
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Random))
            payload = await middleware[types_1.Method.Random](payload);
        payload = await this.provider[types_1.Method.Random](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Random))
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.RandomKey))
            payload = await middleware[types_1.Method.RandomKey](payload);
        payload = await this.provider.randomKey(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.RandomKey))
            payload = await middleware[types_1.Method.RandomKey](payload);
        return payload.data ?? null;
    }
    async remove(keyPath, valueOrHook) {
        const [key, path] = this.getKeyPath(keyPath);
        if (!(0, utilities_1.isFunction)(valueOrHook)) {
            if (!(0, utilities_1.isPrimitive)(valueOrHook))
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.RemoveInvalidValue, message: 'The "value" parameter was not of a primitive type.' });
        }
        let payload = {
            method: types_1.Method.Remove,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(valueOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Value,
            key,
            path
        };
        if ((0, utilities_1.isFunction)(valueOrHook))
            payload.hook = valueOrHook;
        else
            payload.value = valueOrHook;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Remove))
            payload = await middleware[types_1.Method.Remove](payload);
        payload = await this.provider[types_1.Method.Remove](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Remove))
            payload = await middleware[types_1.Method.Remove](payload);
        return this;
    }
    async set(keyPath, value) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Set, trigger: types_1.Trigger.PreProvider, key, path, value };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Set))
            payload = await middleware[types_1.Method.Set](payload);
        payload = await this.provider[types_1.Method.Set](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Set))
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
    async setMany(keys, value) {
        let payload = { method: types_1.Method.SetMany, trigger: types_1.Trigger.PreProvider, keys, value };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.SetMany))
            payload = await middleware[types_1.Method.SetMany](payload);
        payload = await this.provider[types_1.Method.SetMany](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.SetMany))
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Size))
            payload = await middleware[types_1.Method.Size](payload);
        payload = await this.provider[types_1.Method.Size](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Size))
            payload = await middleware[types_1.Method.Size](payload);
        return payload.data;
    }
    async some(pathOrHook, value) {
        if (!(0, utilities_1.isFunction)(pathOrHook)) {
            if (value === undefined)
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.SomeMissingValue, message: 'The "value" parameter was not found.' });
            if (!(0, utilities_1.isPrimitive)(value))
                throw new errors_1.JoshError({ identifier: Josh.Identifiers.SomeInvalidValue, message: 'The "value" parameter must be a primitive type.' });
        }
        let payload = {
            method: types_1.Method.Some,
            trigger: types_1.Trigger.PreProvider,
            type: (0, utilities_1.isFunction)(pathOrHook) ? payloads_1.Payload.Type.Hook : payloads_1.Payload.Type.Value,
            data: false
        };
        if ((0, utilities_1.isFunction)(pathOrHook))
            payload.hook = pathOrHook;
        else {
            payload.path = pathOrHook;
            payload.value = value;
        }
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Some))
            payload = await middleware[types_1.Method.Some](payload);
        payload = await this.provider[types_1.Method.Some](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Some))
            payload = await middleware[types_1.Method.Some](payload);
        return payload.data;
    }
    /**
     * Update a stored value using a hook function.
     * @param keyPath The key and/or path to the stored value for updating.
     * @param hook The hook to update the stored value.
     * @returns The updated value or null.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.update('key', (value) => value.toUpperCase()); // 'VALUE'
     * ```
     */
    async update(keyPath, hook) {
        const [key, path] = this.getKeyPath(keyPath);
        let payload = { method: types_1.Method.Update, trigger: types_1.Trigger.PreProvider, key, path, hook };
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Update))
            payload = await middleware[types_1.Method.Update](payload);
        payload = await this.provider[types_1.Method.Update](payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Update))
            payload = await middleware[types_1.Method.Update](payload);
        return payload.data ?? null;
    }
    /**
     * Get all stored values.
     * @since 2.0.0
     * @returns An array of stored values.
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
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPreMiddlewares(types_1.Method.Values))
            payload = await middleware[types_1.Method.Values](payload);
        payload = await this.provider.values(payload);
        payload.trigger = types_1.Trigger.PostProvider;
        if (payload.error)
            throw payload.error;
        for (const middleware of this.middlewares.array())
            await middleware.run(payload);
        for (const middleware of this.getPostMiddlewares(types_1.Method.Values))
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
     * Simple utility function to extract from a key/path.
     * @since 2.0.0
     * @param keyPath The {@link KeyPath} to extract
     * @returns The extract key/path
     */
    getKeyPath(keyPath) {
        return typeof keyPath === 'string' ? [keyPath, []] : [keyPath[0], keyPath[1] ?? []];
    }
    /**
     * Filters pre-provider middlewares by a method.
     * @since 2.0.0
     * @param method The method to filter by.
     * @returns The filtered middlewares.
     */
    getPreMiddlewares(method) {
        return this.middlewares.filterByCondition(method, types_1.Trigger.PreProvider);
    }
    /**
     * Filters post-provider middlewares by a method.
     * @param method The method to filter by.
     * @returns The filtered middlewares.
     */
    getPostMiddlewares(method) {
        return this.middlewares.filterByCondition(method, types_1.Trigger.PostProvider);
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
        Identifiers["EveryInvalidValue"] = "everyInvalidValue";
        Identifiers["EveryMissingValue"] = "everyMissingValue";
        Identifiers["FilterInvalidValue"] = "filterInvalidValue";
        Identifiers["FilterMissingValue"] = "filterMissingValue";
        Identifiers["FindInvalidValue"] = "findInvalidValue";
        Identifiers["FindMissingValue"] = "findMissingValue";
        Identifiers["InvalidProvider"] = "invalidProvider";
        Identifiers["MiddlewareNotFound"] = "middlewareNotFound";
        Identifiers["MissingName"] = "missingName";
        Identifiers["PartitionInvalidValue"] = "partitionInvalidValue";
        Identifiers["PartitionMissingValue"] = "partitionMissingValue";
        Identifiers["RemoveInvalidValue"] = "removeInvalidValue";
        Identifiers["SomeInvalidValue"] = "someInvalidValue";
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