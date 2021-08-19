"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProvider = void 0;
const utilities_1 = require("@realware/utilities");
const stopwatch_1 = require("@sapphire/stopwatch");
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
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        this.autoKeyCount++;
        payload.data = this.autoKeyCount.toString();
        payload.stopwatch.stop();
        return payload;
    }
    dec(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch.stop();
        return payload;
    }
    ensure(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { key } = payload;
        // @ts-expect-error 2345
        if (!this.cache.has(key))
            this.cache.set(key, payload.defaultValue);
        Reflect.set(payload, 'data', this.cache.get(key));
        payload.stopwatch.stop();
        return payload;
    }
    filterByData(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { path, inputData } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (inputData !== data)
                continue;
            payload.data[key] = data;
        }
        payload.stopwatch.stop();
        return payload;
    }
    async filterByHook(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { path, inputHook } = payload;
        for (const key of this.keys({ method: types_1.Method.Keys, data: [] }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined)
                continue;
            if (!(await inputHook(data)))
                continue;
            payload.data[key] = data;
        }
        payload.stopwatch.stop();
        return payload;
    }
    findByData(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch.stop();
        return payload;
    }
    async findByHook(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch.stop();
        return payload;
    }
    get(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { key, path } = payload;
        Reflect.set(payload, 'data', path ? utilities_1.getFromObject(this.cache.get(key), path) : this.cache.get(key));
        payload.stopwatch.stop();
        return payload;
    }
    getAll(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        for (const [key, value] of this.cache.entries())
            Reflect.set(payload.data, key, value);
        payload.stopwatch.stop();
        return payload;
    }
    getMany(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        for (const [key, path] of payload.keyPaths) {
            const { data } = this.get({ method: types_1.Method.Get, key, path, data: null });
            Reflect.set(payload.data, key, data);
        }
        payload.stopwatch.stop();
        return payload;
    }
    has(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { key, path } = payload;
        if (this.cache.has(key)) {
            payload.data = true;
            if (path)
                payload.data = Boolean(utilities_1.getFromObject(this.cache.get(key), path));
        }
        payload.stopwatch.stop();
        return payload;
    }
    inc(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        payload.data = Array.from(this.cache.keys());
        payload.stopwatch.stop();
        return payload;
    }
    push(payload, value) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const values = Array.from(this.cache.values());
        Reflect.set(payload, 'data', values.length ? values[Math.floor(Math.random() * values.length)] : null);
        payload.stopwatch.stop();
        return payload;
    }
    randomKey(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const keys = Array.from(this.cache.keys());
        payload.data = keys[Math.floor(Math.random() * keys.length)];
        payload.stopwatch.stop();
        return payload;
    }
    set(payload, value) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { key, path } = payload;
        if (path) {
            const { data } = this.get({ method: types_1.Method.Get, stopwatch: new stopwatch_1.Stopwatch(), key });
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
        payload.stopwatch.stop();
        return payload;
    }
    setMany(payload, value) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        for (const [key, path] of payload.keyPaths)
            this.set({ method: types_1.Method.Set, key, path }, value);
        payload.stopwatch.stop();
        return payload;
    }
    size(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        payload.data = this.cache.size;
        payload.stopwatch.stop();
        return payload;
    }
    someByData(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch.stop();
        return payload;
    }
    async someByHook(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
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
        payload.stopwatch.stop();
        return payload;
    }
    updateByData(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path, data: payload.inputData });
        if (data === undefined)
            return payload;
        Reflect.set(payload, 'data', utilities_2.isObject(payload.inputData) ? utilities_2.mergeDefault(data ?? {}, payload.inputData) : payload.inputData);
        this.set({ method: types_1.Method.Set, key, path }, payload.data);
        payload.stopwatch.stop();
        return payload;
    }
    async updateByHook(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        const { key, path, inputHook } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined)
            return payload;
        payload.data = await inputHook(data);
        this.set({ method: types_1.Method.Set, key, path }, payload.data);
        payload.stopwatch.stop();
        return payload;
    }
    values(payload) {
        payload.stopwatch = new stopwatch_1.Stopwatch();
        payload.stopwatch.start();
        Reflect.set(payload, 'data', Array.from(this.cache.values()));
        payload.stopwatch.stop();
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