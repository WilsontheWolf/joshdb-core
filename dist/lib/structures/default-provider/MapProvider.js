"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProvider = void 0;
const utilities_1 = require("@realware/utilities");
const utilities_2 = require("@sapphire/utilities");
const types_1 = require("../../types");
const validators_1 = require("../../validators");
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
    [types_1.Method.AutoKey](payload) {
        this.autoKeyCount++;
        payload.data = this.autoKeyCount.toString();
        return payload;
    }
    [types_1.Method.Clear](payload) {
        this.cache.clear();
        this.autoKeyCount = 0;
        return payload;
    }
    [types_1.Method.Dec](payload) {
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.DecMissingData,
                message: path.length === 0 ? `The data at "${key}" does not exist.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Dec
            });
            return payload;
        }
        if (typeof data !== 'number') {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.DecInvalidType,
                message: path.length === 0 ? `The data at "${key}" must be of type "number".` : `The data at "${key}.${path.join('.')}" must be of type "number".`,
                method: types_1.Method.Dec
            });
            return payload;
        }
        this.set({ method: types_1.Method.Set, key, path, value: data - 1 });
        return payload;
    }
    [types_1.Method.Delete](payload) {
        const { key, path } = payload;
        if (path.length === 0) {
            this.cache.delete(key);
            return payload;
        }
        if (this.has({ method: types_1.Method.Has, key, path, data: false }).data) {
            const { data } = this.get({ method: types_1.Method.Get, key, path: [] });
            (0, utilities_1.deleteFromObject)(data, path);
            return payload;
        }
        return payload;
    }
    [types_1.Method.Ensure](payload) {
        const { key } = payload;
        if (!this.cache.has(key))
            this.cache.set(key, payload.defaultValue);
        Reflect.set(payload, 'data', this.cache.get(key));
        return payload;
    }
    async [types_1.Method.Every](payload) {
        if (this.cache.size === 0) {
            payload.data = false;
            return payload;
        }
        if ((0, validators_1.isEveryByHookPayload)(payload)) {
            const { hook } = payload;
            for (const value of this.cache.values()) {
                const everyValue = await hook(value);
                if (everyValue)
                    continue;
                payload.data = false;
            }
        }
        if ((0, validators_1.isEveryByValuePayload)(payload)) {
            const { path, value } = payload;
            for (const key of this.cache.keys()) {
                const { data } = this.get({ method: types_1.Method.Get, key, path });
                if (value === data)
                    continue;
                payload.data = false;
            }
        }
        return payload;
    }
    async [types_1.Method.Filter](payload) {
        if ((0, validators_1.isFilterByHookPayload)(payload)) {
            const { hook } = payload;
            for (const [key, value] of this.cache.entries()) {
                const filterValue = await hook(value);
                if (!filterValue)
                    continue;
                payload.data[key] = value;
            }
        }
        if ((0, validators_1.isFilterByValuePayload)(payload)) {
            const { path, value } = payload;
            if (!(0, utilities_2.isPrimitive)(value)) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.FilterInvalidValue,
                    message: 'The "value" must be a primitive type.',
                    method: types_1.Method.Filter
                });
                return payload;
            }
            for (const [key, storedValue] of this.cache.entries())
                if (value === (path.length === 0 ? storedValue : (0, utilities_1.getFromObject)(storedValue, path)))
                    payload.data[key] = storedValue;
        }
        return payload;
    }
    async [types_1.Method.Find](payload) {
        if ((0, validators_1.isFindByHookPayload)(payload)) {
            const { hook } = payload;
            for (const value of this.cache.values()) {
                const foundValue = await hook(value);
                if (!foundValue)
                    continue;
                payload.data = value;
                break;
            }
        }
        if ((0, validators_1.isFindByValuePayload)(payload)) {
            const { path, value } = payload;
            if (!(0, utilities_2.isPrimitive)(value)) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.FindInvalidValue,
                    message: 'The "value" must be of type primitive.',
                    method: types_1.Method.Find
                });
                return payload;
            }
            for (const storedValue of this.cache.values()) {
                if (payload.data !== undefined)
                    break;
                if (value === (path.length === 0 ? storedValue : (0, utilities_1.getFromObject)(storedValue, path)))
                    payload.data = storedValue;
            }
        }
        return payload;
    }
    [types_1.Method.Get](payload) {
        const { key, path } = payload;
        Reflect.set(payload, 'data', path.length === 0 ? this.cache.get(key) : (0, utilities_1.getFromObject)(this.cache.get(key), path));
        return payload;
    }
    [types_1.Method.GetAll](payload) {
        for (const [key, value] of this.cache.entries())
            payload.data[key] = value;
        return payload;
    }
    [types_1.Method.GetMany](payload) {
        const { keys } = payload;
        for (const key of keys)
            payload.data[key] = this.cache.get(key) ?? null;
        return payload;
    }
    [types_1.Method.Has](payload) {
        const { key, path } = payload;
        if (this.cache.has(key)) {
            payload.data = true;
            if (path.length !== 0)
                payload.data = (0, utilities_1.hasFromObject)(this.cache.get(key), path);
        }
        return payload;
    }
    [types_1.Method.Inc](payload) {
        const { key, path } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.IncMissingData,
                message: path.length === 0 ? `The data at "${key}" does not exist.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Inc
            });
            return payload;
        }
        if (typeof data !== 'number') {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.IncInvalidType,
                message: path.length === 0 ? `The data at "${key}" must be of type "number".` : `The data at "${key}.${path.join('.')}" must be of type "number".`,
                method: types_1.Method.Inc
            });
            return payload;
        }
        this.set({ method: types_1.Method.Set, key, path, value: data + 1 });
        return payload;
    }
    [types_1.Method.Keys](payload) {
        payload.data = Array.from(this.cache.keys());
        return payload;
    }
    async [types_1.Method.Map](payload) {
        if ((0, validators_1.isMapByHookPayload)(payload)) {
            const { hook } = payload;
            // @ts-expect-error 2345
            for (const value of this.cache.values())
                payload.data.push(await hook(value));
        }
        if ((0, validators_1.isMapByPathPayload)(payload)) {
            const { path } = payload;
            // @ts-expect-error 2345
            for (const value of this.cache.values())
                payload.data.push(path.length === 0 ? value : (0, utilities_1.getFromObject)(value, path));
        }
        return payload;
    }
    [types_1.Method.Math](payload) {
        const { key, path, operator, operand } = payload;
        let { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.MathMissingData,
                message: path.length === 0 ? `The data at "${key}" does not exist.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Math
            });
            return payload;
        }
        if (!(0, utilities_2.isNumber)(data)) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.MathInvalidType,
                message: path.length === 0 ? `The data at "${key}" must be a number.` : `The data at "${key}.${path.join('.')}" must be a number.`,
                method: types_1.Method.Math
            });
            return payload;
        }
        switch (operator) {
            case types_1.MathOperator.Addition:
                data += operand;
                break;
            case types_1.MathOperator.Subtraction:
                data -= operand;
                break;
            case types_1.MathOperator.Multiplication:
                data *= operand;
                break;
            case types_1.MathOperator.Division:
                data /= operand;
                break;
            case types_1.MathOperator.Remainder:
                data %= operand;
                break;
            case types_1.MathOperator.Exponent:
                data **= operand;
                break;
        }
        this.set({ method: types_1.Method.Set, key, path, value: data });
        return payload;
    }
    async [types_1.Method.Partition](payload) {
        if ((0, validators_1.isPartitionByHookPayload)(payload)) {
            const { hook } = payload;
            for (const [key, value] of this.cache.entries()) {
                const filterValue = await hook(value);
                if (filterValue)
                    payload.data.truthy[key] = value;
                else
                    payload.data.falsy[key] = value;
            }
        }
        if ((0, validators_1.isPartitionByValuePayload)(payload)) {
            const { path, value } = payload;
            if (!(0, utilities_2.isPrimitive)(value)) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.PartitionInvalidValue,
                    message: 'The "value" must be a primitive type.',
                    method: types_1.Method.Partition
                });
                return payload;
            }
            for (const [key, storedValue] of this.cache.entries())
                if (value === (path.length === 0 ? storedValue : (0, utilities_1.getFromObject)(storedValue, path)))
                    payload.data.truthy[key] = storedValue;
                else
                    payload.data.falsy[key] = storedValue;
        }
        return payload;
    }
    [types_1.Method.Push](payload) {
        const { key, path, value } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.PushMissingData,
                message: path.length === 0 ? `The data at "${key}" does not exist.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Push
            });
            return payload;
        }
        if (!Array.isArray(data)) {
            payload.error = new MapProviderError_1.MapProviderError({
                identifier: MapProvider.Identifiers.PushInvalidType,
                message: path.length === 0 ? `The data at "${key}" must be an array.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                method: types_1.Method.Push
            });
            return payload;
        }
        data.push(value);
        this.set({ method: types_1.Method.Set, key, path, value: data });
        return payload;
    }
    [types_1.Method.Random](payload) {
        const values = Array.from(this.cache.values());
        Reflect.set(payload, 'data', values[Math.floor(Math.random() * values.length)]);
        return payload;
    }
    [types_1.Method.RandomKey](payload) {
        const keys = Array.from(this.cache.keys());
        payload.data = keys[Math.floor(Math.random() * keys.length)];
        return payload;
    }
    async [types_1.Method.Remove](payload) {
        if ((0, validators_1.isRemoveByHookPayload)(payload)) {
            const { key, path, hook } = payload;
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.RemoveMissingData,
                    message: path.length === 0 ? `The data at "${key}" does not exist.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                    method: types_1.Method.Remove
                });
                return payload;
            }
            if (!Array.isArray(data)) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.RemoveInvalidType,
                    message: path.length === 0 ? `The data at "${key}" must be an array.` : `The data at "${key}.${path.join('.')}" must be an array.`,
                    method: types_1.Method.Remove
                });
                return payload;
            }
            const filterValues = await Promise.all(data.map(hook));
            this.set({ method: types_1.Method.Set, key, path, value: data.filter((_, index) => !filterValues[index]) });
        }
        if ((0, validators_1.isRemoveByValuePayload)(payload)) {
            const { key, path, value } = payload;
            const { data } = this.get({ method: types_1.Method.Get, key, path });
            if (data === undefined) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.RemoveMissingData,
                    message: path.length === 0 ? `The data at "${key}" does not exist.` : `The data at "${key}.${path.join('.')}" does not exist.`,
                    method: types_1.Method.Remove
                });
                return payload;
            }
            if (!Array.isArray(data)) {
                payload.error = new MapProviderError_1.MapProviderError({
                    identifier: MapProvider.Identifiers.RemoveInvalidType,
                    message: path.length === 0 ? `The data at "${key}" must be an array.` : `The data at "${key}.${path.join('.')}" must be an array.`,
                    method: types_1.Method.Remove
                });
                return payload;
            }
            this.set({ method: types_1.Method.Set, key, path, value: data.filter((storedValue) => value !== storedValue) });
        }
        return payload;
    }
    [types_1.Method.Set](payload) {
        const { key, path, value } = payload;
        // @ts-expect-error 2345
        if (path.length === 0)
            this.cache.set(key, value);
        else {
            const storedValue = this.cache.get(key);
            this.cache.set(key, (0, utilities_1.setToObject)(storedValue, path, value));
        }
        return payload;
    }
    [types_1.Method.SetMany](payload) {
        const { keys, value } = payload;
        for (const key of keys)
            this.cache.set(key, value);
        return payload;
    }
    [types_1.Method.Size](payload) {
        payload.data = this.cache.size;
        return payload;
    }
    async [types_1.Method.Some](payload) {
        if ((0, validators_1.isSomeByHookPayload)(payload)) {
            const { hook } = payload;
            for (const value of this.cache.values()) {
                const someValue = await hook(value);
                if (!someValue)
                    continue;
                payload.data = true;
                break;
            }
        }
        if ((0, validators_1.isSomeByValuePayload)(payload)) {
            const { path, value } = payload;
            for (const storedValue of this.cache.values()) {
                if (path.length !== 0 && value !== (0, utilities_1.getFromObject)(storedValue, path))
                    continue;
                if ((0, utilities_2.isPrimitive)(storedValue) && value === storedValue)
                    continue;
                payload.data = true;
            }
        }
        return payload;
    }
    async [types_1.Method.Update](payload) {
        const { key, path, hook } = payload;
        const { data } = this.get({ method: types_1.Method.Get, key, path });
        if (data === undefined)
            return payload;
        Reflect.set(payload, 'data', await hook(data));
        this.set({ method: types_1.Method.Set, key, path, value: payload.data });
        return payload;
    }
    [types_1.Method.Values](payload) {
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
        Identifiers["FilterInvalidValue"] = "filterInvalidValue";
        Identifiers["FindInvalidValue"] = "findInvalidValue";
        Identifiers["IncInvalidType"] = "incInvalidType";
        Identifiers["IncMissingData"] = "incMissingData";
        Identifiers["MathInvalidType"] = "mathInvalidType";
        Identifiers["MathMissingData"] = "mathMissingData";
        Identifiers["PartitionInvalidValue"] = "partitionInvalidValue";
        Identifiers["PushInvalidType"] = "pushInvalidType";
        Identifiers["PushMissingData"] = "pushMissingData";
        Identifiers["RemoveInvalidType"] = "removeInvalidType";
        Identifiers["RemoveMissingData"] = "removeMissingData";
    })(Identifiers = MapProvider.Identifiers || (MapProvider.Identifiers = {}));
})(MapProvider = exports.MapProvider || (exports.MapProvider = {}));
//# sourceMappingURL=MapProvider.js.map