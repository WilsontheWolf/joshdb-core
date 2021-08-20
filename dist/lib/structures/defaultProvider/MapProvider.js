"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProvider = void 0;
const utilities_1 = require("@realware/utilities");
const utilities_2 = require("@sapphire/utilities");
const types_1 = require("../../types");
const JoshProvider_1 = require("../JoshProvider");
const MapProviderError_1 = require("./MapProviderError");
/**
 * A provider that uses the Node.js native [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class.
 * @since 2.0.0
 */
class MapProvider extends JoshProvider_1.JoshProvider {
    constructor() {
        super(...arguments);
        /**
         * The [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) cache to store data.
         * @since 2.0.0
         * @private
         */
        this.cache = new Map();
        /**
         * A simple cache for the {@link MapProvider.autoKey} method.
         * @since 2.0.0
         */
        this.autoKeyCount = 0;
    }
    autoKey(payload) {
        this.autoKeyCount++;
        payload.data = this.autoKeyCount.toString();
        return payload;
    }
    dec(payload) {
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key });
        if (!path) {
            if (typeof data !== 'number') {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.DecInvalidType,
                    message: `The data at "${key}" must be of type "number".`,
                    method: types_1.Method.Dec
                });
                return payload;
            }
            payload.data = data - 1;
            this.set({ method: types_1.Method.Set, key }, payload.data);
            return payload;
        }
        const number = utilities_1.getFromObject(data, path);
        if (number === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.DecMissingData,
                message: `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Dec
            });
            return payload;
        }
        if (typeof number !== 'number') {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.DecInvalidType,
                message: `The data at "${key}.${path.join('.')}" must be of type "number".`,
                method: types_1.Method.Dec
            });
            return payload;
        }
        payload.data = number - 1;
        this.set({ method: types_1.Method.Set, key, path }, payload.data);
        return payload;
    }
    delete(payload) {
        const { key, path } = payload;
        if (!path) {
            this.cache.delete(key);
            return payload;
        }
        if (this.has({ method: types_1.Method.Has, key, path, data: false }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key });
            if (data === undefined) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.DeleteMissingData,
                    message: `The data at "${key}.${path.join('.')}" does not exist.`,
                    method: types_1.Method.Delete
                });
                return payload;
            }
            this.set({ method: types_1.Method.Set, key, path }, utilities_1.deleteFromObject(data, path));
        }
        return payload;
    }
    ensure(payload) {
        const { key } = payload;
        // @ts-expect-error 2345
        if (!this.cache.has(key))
            this.cache.set(key, payload.defaultValue);
        Reflect.set(payload, 'data', this.cache.get(key));
        return payload;
    }
    filterByData(payload) {
        const { path, inputData } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (inputData !== data)
                continue;
            payload.data[key] = data;
        }
        return payload;
    }
    async filterByHook(payload) {
        const { path, inputHook } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (!(await inputHook(data)))
                continue;
            payload.data[key] = data;
        }
        return payload;
    }
    findByData(payload) {
        const { path, inputData } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (inputData !== data)
                continue;
            payload.data = data;
            break;
        }
        return payload;
    }
    async findByHook(payload) {
        const { path, inputHook } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (!(await inputHook(data)))
                continue;
            payload.data = data;
            break;
        }
        return payload;
    }
    get(payload) {
        const { key, path } = payload;
        Reflect.set(payload, 'data', path ? utilities_1.getFromObject(this.cache.get(key), path) : this.cache.get(key));
        return payload;
    }
    getAll(payload) {
        for (const [key, value] of this.cache.entries())
            Reflect.set(payload.data, key, value);
        return payload;
    }
    getMany(payload) {
        for (const [key, path] of payload.keyPaths) {
            const { data } = this.get({ method: types_1.Method.Get, key, path, data: null });
            Reflect.set(payload.data, key, data);
        }
        return payload;
    }
    has(payload) {
        const { key, path } = payload;
        if (this.cache.has(key)) {
            payload.data = true;
            if (path)
                payload.data = Boolean(utilities_1.getFromObject(this.cache.get(key), path));
        }
        return payload;
    }
    inc(payload) {
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key });
        if (!path) {
            if (typeof data !== 'number') {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.IncInvalidType,
                    message: `The data at "${key}" must be of type "number".`,
                    method: types_1.Method.Dec
                });
                return payload;
            }
            payload.data = data + 1;
            this.set({ method: types_1.Method.Set, key }, payload.data);
            return payload;
        }
        const number = utilities_1.getFromObject(data, path);
        if (number === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.IncMissingData,
                message: `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Inc
            });
            return payload;
        }
        if (typeof number !== 'number') {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.IncInvalidType,
                message: `The data at "${key}.${path.join('.')}" must be of type "number".`,
                method: types_1.Method.Dec
            });
            return payload;
        }
        payload.data = number + 1;
        this.set({ method: types_1.Method.Set, key, path }, payload.data);
        return payload;
    }
    keys(payload) {
        payload.data = Array.from(this.cache.keys());
        return payload;
    }
    mapByPath(payload) {
        const { path } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data)
            payload.data.push(this.get({ method: types_1.Method.Get, key, path }).data);
        return payload;
    }
    async mapByHook(payload) {
        const { hook } = payload;
        for (const value of this.values({ method: types_1.Method.Values, data: [] }).data)
            payload.data.push(await hook(value));
        return payload;
    }
    push(payload, value) {
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key });
        if (!path) {
            if (!Array.isArray(data)) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.PushInvalidType,
                    message: `The data at "${key}" must be an array.`,
                    method: types_1.Method.Push
                });
                return payload;
            }
            data.push(value);
            this.set({ method: types_1.Method.Set, key }, data);
            return payload;
        }
        const array = utilities_1.getFromObject(data, path);
        if (array === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.PushMissingData,
                message: `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Push
            });
            return payload;
        }
        if (!Array.isArray(array)) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.PushInvalidType,
                message: `The data at "${key}.${path.join('.')} must be an array.`,
                method: types_1.Method.Push
            });
            return payload;
        }
        array.push(value);
        this.set({ method: types_1.Method.Set, key, path }, array);
        return payload;
    }
    random(payload) {
        const values = Array.from(this.cache.values());
        Reflect.set(payload, 'data', values.length ? values[Math.floor(Math.random() * values.length)] : null);
        return payload;
    }
    randomKey(payload) {
        const keys = Array.from(this.cache.keys());
        payload.data = keys[Math.floor(Math.random() * keys.length)];
        return payload;
    }
    set(payload, value) {
        const { key, path } = payload;
        if (path) {
            const { data } = this.get({ method: types_1.Method.Get, key });
            if (data === undefined) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.SetMissingData,
                    message: `The data at "${key}" does not exist and cannot be set.`,
                    method: types_1.Method.Set
                });
                return payload;
            }
            this.cache.set(key, utilities_1.setFromObject(data, path, value));
            // @ts-expect-error 2345
        }
        else
            this.cache.set(key, value);
        return payload;
    }
    setMany(payload, value) {
        for (const [key, path] of payload.keyPaths)
            this.set({ method: types_1.Method.Set, key, path }, value);
        return payload;
    }
    size(payload) {
        payload.data = this.cache.size;
        return payload;
    }
    someByData(payload) {
        const { path, inputData } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (inputData !== data)
                continue;
            payload.data = true;
            break;
        }
        return payload;
    }
    async someByHook(payload) {
        const { path, inputHook } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (!(await inputHook(data)))
                continue;
            payload.data = true;
            break;
        }
        return payload;
    }
    updateByData(payload) {
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path, data: payload.inputData });
        if (data === undefined)
            return payload;
        Reflect.set(payload, 'data', utilities_2.isObject(payload.inputData) ? utilities_2.mergeDefault(data ?? {}, payload.inputData) : payload.inputData);
        this.set({ method: types_1.Method.Set, key, path }, payload.data);
        return payload;
    }
    async updateByHook(payload) {
        const { key, path, inputHook } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined)
            return payload;
        payload.data = await inputHook(data);
        this.set({ method: types_1.Method.Set, key, path }, payload.data);
        return payload;
    }
    values(payload) {
        Reflect.set(payload, 'data', Array.from(this.cache.values()));
        return payload;
    }
}
exports.MapProvider = MapProvider;
(function (MapProvider) {
    let Identifiers;
    (function (Identifiers) {
        Identifiers["DecInvalidType"] = "decInvalidType";
        Identifiers["DecMissingData"] = "decMissingData";
        Identifiers["DeleteMissingData"] = "deleteMissingData";
        Identifiers["IncInvalidType"] = "incInvalidType";
        Identifiers["IncMissingData"] = "incMissingData";
        Identifiers["PushInvalidType"] = "pushInvalidType";
        Identifiers["PushMissingData"] = "pushMissingData";
        Identifiers["SetMissingData"] = "setMissingData";
    })(Identifiers = MapProvider.Identifiers || (MapProvider.Identifiers = {}));
})(MapProvider = exports.MapProvider || (exports.MapProvider = {}));
//# sourceMappingURL=MapProvider.js.map