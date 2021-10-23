import { getRootData } from '@sapphire/pieces';
import { isFunction, isPrimitive, Primitive } from '@sapphire/utilities';
import { join } from 'path';
import type { AutoEnsureContext } from '../../middlewares/CoreAutoEnsure';
import { JoshError } from '../errors';
import {
	AutoKeyPayload,
	ClearPayload,
	DecPayload,
	DeletePayload,
	EnsurePayload,
	EveryHook,
	EveryPayload,
	FilterHook,
	FilterPayload,
	FindHook,
	FindPayload,
	GetAllPayload,
	GetManyPayload,
	GetPayload,
	HasPayload,
	IncPayload,
	KeysPayload,
	MapHook,
	MapPayload,
	MathPayload,
	PartitionHook,
	PartitionPayload,
	Payload,
	PushPayload,
	RandomKeyPayload,
	RandomPayload,
	RemoveHook,
	RemovePayload,
	SetManyPayload,
	SetPayload,
	SizePayload,
	SomeHook,
	SomePayload,
	UpdateHook,
	UpdatePayload,
	ValuesPayload
} from '../payloads';
import { BuiltInMiddleware, KeyPath, KeyPathArray, MathOperator, Method, StringArray, Trigger } from '../types';
import { MapProvider } from './defaultProvider';
import { JoshProvider } from './JoshProvider';
import type { Middleware } from './Middleware';
import { MiddlewareStore } from './MiddlewareStore';

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
export class Josh<StoredValue = unknown> {
	/**
	 * This Josh's name. Used for middleware and/or provider information.
	 * @since 2.0.0
	 */
	public name: string;

	/**
	 * This Josh's options. Used throughout the instance.
	 * @since 2.0.0
	 */
	public options: Josh.Options<StoredValue>;

	/**
	 * The middleware store.
	 *
	 * NOTE: Do not use this unless you know what your doing.
	 * @since 2.0.0
	 */
	public middlewares: MiddlewareStore<StoredValue>;

	/**
	 * This Josh's provider instance.
	 *
	 * NOTE: Do not use this unless you know what your doing.
	 */
	public provider: JoshProvider<StoredValue>;

	public constructor(options: Josh.Options<StoredValue>) {
		const { name, provider, middlewareDirectory } = options;

		this.options = options;

		if (!name)
			throw new JoshError({ identifier: Josh.Identifiers.MissingName, message: 'The "name" option is required to initiate a Josh instance.' });

		this.name = name;
		this.provider = provider ?? new MapProvider<StoredValue>();

		if (!(this.provider instanceof JoshProvider))
			throw new JoshError({
				identifier: Josh.Identifiers.InvalidProvider,
				message: 'The "provider" option must extend the exported "JoshProvider" class.'
			});

		this.middlewares = new MiddlewareStore<StoredValue>({ instance: this })
			.registerPath(middlewareDirectory ?? join(getRootData().root, 'middlewares', this.name))
			.registerPath(join(__dirname, '..', '..', 'middlewares'));
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
	public async autoKey(): Promise<string> {
		let payload: AutoKeyPayload = { method: Method.AutoKey, trigger: Trigger.PreProvider, data: '' };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.AutoKey)) payload = await middleware[Method.AutoKey](payload);

		payload = await this.provider[Method.AutoKey](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.AutoKey)) payload = await middleware[Method.AutoKey](payload);

		return payload.data;
	}

	public async clear(): Promise<this> {
		let payload: ClearPayload = { method: Method.Clear, trigger: Trigger.PreProvider };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Clear)) payload = await middleware[Method.Clear](payload);

		payload = await this.provider[Method.Clear](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Clear)) payload = await middleware[Method.Clear](payload);

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
	public async dec(keyPath: KeyPath): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: DecPayload = { method: Method.Dec, trigger: Trigger.PreProvider, key, path };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Dec)) payload = await middleware[Method.Dec](payload);

		payload = await this.provider[Method.Dec](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Dec)) payload = await middleware[Method.Dec](payload);

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
	public async delete(keyPath: KeyPath): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: DeletePayload = { method: Method.Delete, trigger: Trigger.PreProvider, key, path };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Delete)) payload = await middleware[Method.Delete](payload);

		payload = await this.provider[Method.Delete](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Delete)) payload = await middleware[Method.Delete](payload);

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
	public async ensure(key: string, defaultValue: StoredValue): Promise<StoredValue> {
		let payload: EnsurePayload<StoredValue> = { method: Method.Ensure, trigger: Trigger.PreProvider, key, defaultValue, data: defaultValue };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Ensure)) payload = await middleware[Method.Ensure](payload);

		payload = await this.provider[Method.Ensure](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Ensure)) payload = await middleware[Method.Ensure](payload);

		return payload.data;
	}

	public async every(path: StringArray, value: Primitive): Promise<boolean>;
	public async every(hook: EveryHook<StoredValue>): Promise<boolean>;
	public async every(pathOrHook: StringArray | EveryHook<StoredValue>, value?: Primitive): Promise<boolean> {
		if (!isFunction(pathOrHook)) {
			if (value === undefined)
				throw new JoshError({ identifier: Josh.Identifiers.EveryMissingValue, message: 'The "value" parameter was not found.' });
			if (!isPrimitive(value))
				throw new JoshError({ identifier: Josh.Identifiers.EveryInvalidValue, message: 'The "value" parameter must be a primitive type.' });
		}

		let payload: EveryPayload<StoredValue> = {
			method: Method.Every,
			trigger: Trigger.PreProvider,
			type: isFunction(pathOrHook) ? Payload.Type.Hook : Payload.Type.Value,
			data: true
		};

		if (isFunction(pathOrHook)) payload.hook = pathOrHook;
		else {
			payload.path = pathOrHook;
			payload.value;
		}

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Every)) payload = await middleware[Method.Every](payload);

		payload = await this.provider[Method.Every](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Every)) payload = await middleware[Method.Every](payload);

		return payload.data;
	}

	/**
	 * Filter stored values using a path and value.
	 * @since 2.0.0
	 * @param path A path to the value for equality check.
	 * @param value The value to check equality.
	 * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
	 * @returns The bulk data.
	 *
	 * @example
	 * ```typescript
	 * await josh.set('key', { path: 'value' });
	 *
	 * await josh.filter(['path'], 'value'); // { key: { path: 'value' } }
	 * // Using a return bulk type.
	 * await josh.filter(['path'], 'value', Bulk.OneDimensionalArray); // [{ path: 'value' }]
	 * ```
	 */
	public async filter<BulkType extends keyof ReturnBulk<StoredValue>>(
		path: StringArray,
		value: Primitive,
		returnBulkType?: BulkType
	): Promise<ReturnBulk<StoredValue>[BulkType]>;

	/**
	 * Filter stored data using a hook function.
	 * @since 2.0.0
	 * @param hook The hook function to check equality.
	 * @param _value Unused.
	 * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
	 * @returns The bulk data.
	 *
	 * @example
	 * ```typescript
	 * await josh.set('key', 'value');
	 *
	 * await josh.filter((value) => value === 'value'); // { key: { path: 'value' } }
	 * // Using a return bulk type.
	 * await josh.filter((value) => value === 'value', undefined, Bulk.TwoDimensionalArray); // [['key', 'value']]
	 * ```
	 */
	public async filter<BulkType extends keyof ReturnBulk<StoredValue>>(
		hook: FilterHook<StoredValue>,
		_value: undefined,
		returnBulkType?: BulkType
	): Promise<ReturnBulk<StoredValue>[BulkType]>;

	public async filter<BulkType extends keyof ReturnBulk<StoredValue>>(
		pathOrHook: StringArray | FilterHook<StoredValue>,
		value?: Primitive,
		returnBulkType?: BulkType
	): Promise<ReturnBulk<StoredValue>[BulkType]> {
		if (!isFunction(pathOrHook)) {
			if (value === undefined)
				throw new JoshError({ identifier: Josh.Identifiers.FilterMissingValue, message: 'The "value" parameter was not found.' });
			if (!isPrimitive(value))
				throw new JoshError({ identifier: Josh.Identifiers.FilterInvalidValue, message: 'The "value" parameter must be a primitive type.' });
		}

		let payload: FilterPayload<StoredValue> = {
			method: Method.Filter,
			trigger: Trigger.PreProvider,
			type: isFunction(pathOrHook) ? Payload.Type.Hook : Payload.Type.Value,
			data: {}
		};

		if (isFunction(pathOrHook)) payload.hook = pathOrHook;
		else {
			payload.path = pathOrHook;
			payload.value = value;
		}

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Filter)) payload = await middleware[Method.Filter](payload);

		payload = await this.provider[Method.Filter](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Filter)) payload = await middleware[Method.Filter](payload);

		return this.convertBulkData(payload.data, returnBulkType);
	}

	/**
	 * Find a stored value using a path and value.
	 * @since 2.0.0
	 * @param path A path to the value for equality check.
	 * @param value The value to check equality.
	 * @returns The found value or null.
	 */
	public async find(path: StringArray, value: Primitive): Promise<StoredValue | null>;

	/**
	 * Find a stored value using a hook function.
	 * @since 2.0.0
	 * @param hook The hook to check equality.
	 * @returns The found value or null.
	 */
	public async find(hook: FindHook<StoredValue>): Promise<StoredValue | null>;
	public async find(pathOrHook: StringArray | FindHook<StoredValue>, value?: Primitive): Promise<StoredValue | null> {
		if (!isFunction(pathOrHook)) {
			if (value === undefined)
				throw new JoshError({ identifier: Josh.Identifiers.FindMissingValue, message: 'The "value" parameter was not found.' });
			if (!isPrimitive(value))
				throw new JoshError({ identifier: Josh.Identifiers.FindInvalidValue, message: 'The "value" parameter must be a primitive type.' });
		}

		let payload: FindPayload<StoredValue> = {
			method: Method.Find,
			trigger: Trigger.PreProvider,
			type: isFunction(pathOrHook) ? Payload.Type.Hook : Payload.Type.Value
		};

		if (isFunction(pathOrHook)) payload.hook = pathOrHook;
		else {
			payload.path = pathOrHook;
			payload.value = value;
		}

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Find)) payload = await middleware[Method.Find](payload);

		payload = await this.provider[Method.Find](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Find)) payload = await middleware[Method.Find](payload);

		return payload.data ?? null;
	}

	/**
	 * Get a value using a key.
	 * @since 2.0.0
	 * @param key A key at which a value is.
	 * @returns The value gotten or null.
	 *
	 * @example
	 * ```typescript
	 * await josh.set('key', 'value');
	 *
	 * await josh.get('key'); // 'value'
	 * ```
	 */
	public async get(key: string): Promise<StoredValue | null>;

	/**
	 * Get a value using a key and/or path.
	 * @since 2.0.0
	 * @param keyPath A key and/or path at which a value is.
	 * @returns The value gotten or null.
	 *
	 * @example
	 * ```typescript
	 * await josh.set('key', { path: 'value' });
	 *
	 * await josh.get(['key', ['path']]); // 'value'
	 * ```
	 */
	public async get<Value = StoredValue>(keyPath: KeyPathArray): Promise<Value | null>;
	public async get<Value = StoredValue>(keyPath: KeyPath): Promise<Value | null> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: GetPayload<Value> = { method: Method.Get, trigger: Trigger.PreProvider, key, path };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Get)) payload = await middleware[Method.Get](payload);

		payload = await this.provider.get(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Get)) payload = await middleware[Method.Get](payload);

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
	public async getAll<BulkType extends keyof ReturnBulk<StoredValue> = Bulk.Object>(
		returnBulkType?: BulkType
	): Promise<ReturnBulk<StoredValue>[BulkType]> {
		let payload: GetAllPayload<StoredValue> = { method: Method.GetAll, trigger: Trigger.PreProvider, data: {} };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.GetAll)) payload = await middleware[Method.GetAll](payload);

		payload = await this.provider.getAll(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.GetAll)) payload = await middleware[Method.GetAll](payload);

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
	public async getMany<BulkType extends keyof ReturnBulk<StoredValue | null>>(
		keys: StringArray,
		returnBulkType?: BulkType
	): Promise<ReturnBulk<StoredValue | null>[BulkType]> {
		let payload: GetManyPayload<StoredValue> = { method: Method.GetMany, trigger: Trigger.PreProvider, keys, data: {} };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.GetMany)) payload = await middleware[Method.GetMany](payload);

		payload = await this.provider[Method.GetMany](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.GetMany)) payload = await middleware[Method.GetMany](payload);

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
	public async has(keyPath: KeyPath): Promise<boolean> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: HasPayload = { method: Method.Has, trigger: Trigger.PreProvider, key, path, data: false };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Has)) payload = await middleware[Method.Has](payload);

		payload = await this.provider.has(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Has)) payload = await middleware[Method.Has](payload);

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
	public async inc(keyPath: KeyPath): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: IncPayload = { method: Method.Inc, trigger: Trigger.PreProvider, key, path };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Inc)) payload = await middleware[Method.Inc](payload);

		payload = await this.provider.inc(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Inc)) payload = await middleware[Method.Inc](payload);

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
	public async keys(): Promise<string[]> {
		let payload: KeysPayload = { method: Method.Keys, trigger: Trigger.PreProvider, data: [] };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Keys)) payload = await middleware[Method.Keys](payload);

		payload = await this.provider.keys(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Keys)) payload = await middleware[Method.Keys](payload);

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
	public async map<Value = StoredValue>(pathOrHook: StringArray | MapHook<Value, StoredValue>): Promise<Value[]> {
		let payload: MapPayload<Value, StoredValue> = {
			method: Method.Map,
			trigger: Trigger.PreProvider,
			type: isFunction(pathOrHook) ? Payload.Type.Hook : Payload.Type.Path,
			data: []
		};

		if (isFunction(pathOrHook)) payload.hook = pathOrHook;
		else payload.path = pathOrHook;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Map)) payload = await middleware[Method.Map](payload);

		payload = await this.provider[Method.Map](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Map)) payload = await middleware[Method.Map](payload);

		return payload.data;
	}

	public async math(keyPath: KeyPath, operator: MathOperator, operand: number): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: MathPayload = { method: Method.Math, trigger: Trigger.PreProvider, key, path, operator, operand };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Math)) payload = await middleware[Method.Math](payload);

		payload = await this.provider[Method.Math](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Math)) payload = await middleware[Method.Math](payload);

		return this;
	}

	/**
	 * Filter stored values and get both truthy and falsy results.
	 * @since 2.0.0
	 * @param hook The hook function to check equality.
	 * @param _value Unused.
	 * @param returnBulkType The return bulk type, Defaults to {@link Bulk.Object}
	 * @returns A partition of filtered bulk data. First bulk data is the truthy filter and the second bulk data is the falsy filter.
	 */
	public async partition<BulkType extends keyof ReturnBulk<StoredValue>>(
		hook: PartitionHook<StoredValue>,
		_value: undefined,
		returnBulkType: BulkType
	): Promise<[ReturnBulk<StoredValue>[BulkType], ReturnBulk<StoredValue>[BulkType]]>;

	/**
	 * Filter stored values and get both truthy and falsy results.
	 * @since 2.0.0
	 * @param path A path to the value for equality check.
	 * @param value The value to check equality.
	 * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
	 * @returns A partition of filtered bulk data. First bulk data is the truthy filter and the second bulk data is the falsy filter.
	 */
	public async partition<BulkType extends keyof ReturnBulk<StoredValue>>(
		path: StringArray,
		value: Primitive,
		returnBulkType: BulkType
	): Promise<[ReturnBulk<StoredValue>[BulkType], ReturnBulk<StoredValue>[BulkType]]>;

	public async partition<BulkType extends keyof ReturnBulk<StoredValue>>(
		pathOrHook: StringArray | PartitionHook<StoredValue>,
		value?: Primitive,
		returnBulkType?: BulkType
	): Promise<[ReturnBulk<StoredValue>[BulkType], ReturnBulk<StoredValue>[BulkType]]> {
		if (!isFunction(pathOrHook)) {
			if (value === undefined)
				throw new JoshError({ identifier: Josh.Identifiers.PartitionMissingValue, message: 'The "value" parameter was not found.' });
			if (!isPrimitive(value))
				throw new JoshError({ identifier: Josh.Identifiers.PartitionInvalidValue, message: 'The "value" parameter must be a primitive type.' });
		}

		let payload: PartitionPayload<StoredValue> = {
			method: Method.Partition,
			trigger: Trigger.PreProvider,
			type: isFunction(pathOrHook) ? Payload.Type.Hook : Payload.Type.Value,
			data: { truthy: {}, falsy: {} }
		};

		if (isFunction(pathOrHook)) payload.hook = pathOrHook;
		else {
			payload.path = pathOrHook;
			payload.value = value;
		}

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Partition)) payload = await middleware[Method.Partition](payload);

		payload = await this.provider[Method.Partition](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Partition)) payload = await middleware[Method.Partition](payload);

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
	public async push<Value = StoredValue>(keyPath: KeyPath, value: Value): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: PushPayload<Value> = { method: Method.Push, trigger: Trigger.PreProvider, key, path, value };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Push)) payload = await middleware[Method.Push](payload);

		payload = await this.provider[Method.Push](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Push)) payload = await middleware[Method.Push](payload);

		return this;
	}

	/**
	 * Get a random value.
	 * @since 2.0.0
	 * @returns The random data or `null`.
	 */
	public async random(): Promise<StoredValue | null> {
		let payload: RandomPayload<StoredValue> = { method: Method.Random, trigger: Trigger.PreProvider };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Random)) payload = await middleware[Method.Random](payload);

		payload = await this.provider[Method.Random](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Random)) payload = await middleware[Method.Random](payload);

		return payload.data ?? null;
	}

	/**
	 * Get a random key.
	 * @since 2.0.0
	 * @returns The random key or `null`.
	 */
	public async randomKey(): Promise<string | null> {
		let payload: RandomKeyPayload = { method: Method.RandomKey, trigger: Trigger.PreProvider };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.RandomKey)) payload = await middleware[Method.RandomKey](payload);

		payload = await this.provider.randomKey(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.RandomKey)) payload = await middleware[Method.RandomKey](payload);

		return payload.data ?? null;
	}

	public async remove(keyPath: KeyPath, value: Primitive): Promise<this>;
	public async remove<Value = StoredValue>(keyPath: KeyPath, hook: RemoveHook<Value>): Promise<this>;
	public async remove<Value = StoredValue>(keyPath: KeyPath, valueOrHook: Primitive | RemoveHook<Value>): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);

		if (!isFunction(valueOrHook)) {
			if (!isPrimitive(valueOrHook))
				throw new JoshError({ identifier: Josh.Identifiers.RemoveInvalidValue, message: 'The "value" parameter was not of a primitive type.' });
		}

		let payload: RemovePayload<Value> = {
			method: Method.Remove,
			trigger: Trigger.PreProvider,
			type: isFunction(valueOrHook) ? Payload.Type.Hook : Payload.Type.Value,
			key,
			path
		};

		if (isFunction(valueOrHook)) payload.hook = valueOrHook;
		else payload.value = valueOrHook;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Remove)) payload = await middleware[Method.Remove](payload);

		payload = await this.provider[Method.Remove](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Remove)) payload = await middleware[Method.Remove](payload);

		return this;
	}

	public async set(key: string, value: StoredValue): Promise<this>;
	public async set<Value = StoredValue>(keyPath: KeyPathArray, value: Value): Promise<this>;
	public async set<Value = StoredValue>(keyPath: KeyPath, value: Value): Promise<this> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: SetPayload<Value> = { method: Method.Set, trigger: Trigger.PreProvider, key, path, value };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Set)) payload = await middleware[Method.Set](payload);

		payload = await this.provider[Method.Set](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Set)) payload = await middleware[Method.Set](payload);

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
	public async setMany(keys: StringArray, value: StoredValue): Promise<this> {
		let payload: SetManyPayload<StoredValue> = { method: Method.SetMany, trigger: Trigger.PreProvider, keys, value };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.SetMany)) payload = await middleware[Method.SetMany](payload);

		payload = await this.provider[Method.SetMany](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.SetMany)) payload = await middleware[Method.SetMany](payload);

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
	public async size(): Promise<number> {
		let payload: SizePayload = { method: Method.Size, trigger: Trigger.PreProvider, data: 0 };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Size)) payload = await middleware[Method.Size](payload);

		payload = await this.provider[Method.Size](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Size)) payload = await middleware[Method.Size](payload);

		return payload.data;
	}

	/**
	 * Verify if a path's value matches a value.
	 * @since 2.0.0
	 * @param path A path to the value for equality check.
	 * @param value The value to check equality.
	 */
	public async some(path: StringArray, value: Primitive): Promise<boolean>;

	/**
	 * Verify if a stored value matches with a hook function,
	 * @since 2.0.0
	 * @param hook The hook to check equality.
	 */
	public async some(hook: SomeHook<StoredValue>): Promise<boolean>;
	public async some(pathOrHook: StringArray | SomeHook<StoredValue>, value?: Primitive): Promise<boolean> {
		if (!isFunction(pathOrHook)) {
			if (value === undefined)
				throw new JoshError({ identifier: Josh.Identifiers.SomeMissingValue, message: 'The "value" parameter was not found.' });
			if (!isPrimitive(value))
				throw new JoshError({ identifier: Josh.Identifiers.SomeInvalidValue, message: 'The "value" parameter must be a primitive type.' });
		}

		let payload: SomePayload<StoredValue> = {
			method: Method.Some,
			trigger: Trigger.PreProvider,
			type: isFunction(pathOrHook) ? Payload.Type.Hook : Payload.Type.Value,
			data: false
		};

		if (isFunction(pathOrHook)) payload.hook = pathOrHook;
		else {
			payload.path = pathOrHook;
			payload.value = value;
		}

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Some)) payload = await middleware[Method.Some](payload);

		payload = await this.provider[Method.Some](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Some)) payload = await middleware[Method.Some](payload);

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
	public async update<HookValue = StoredValue, Value = HookValue>(keyPath: KeyPath, hook: UpdateHook<HookValue, Value>): Promise<StoredValue | null> {
		const [key, path] = this.getKeyPath(keyPath);
		let payload: UpdatePayload<StoredValue, HookValue, Value> = { method: Method.Update, trigger: Trigger.PreProvider, key, path, hook };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Update)) payload = await middleware[Method.Update](payload);

		payload = await this.provider[Method.Update](payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Update)) payload = await middleware[Method.Update](payload);

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
	public async values(): Promise<StoredValue[]> {
		let payload: ValuesPayload<StoredValue> = { method: Method.Values, trigger: Trigger.PreProvider, data: [] };

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPreMiddlewares(Method.Values)) payload = await middleware[Method.Values](payload);

		payload = await this.provider.values(payload);
		payload.trigger = Trigger.PostProvider;

		if (payload.error) throw payload.error;

		for (const middleware of this.middlewares.array()) await middleware.run(payload);
		for (const middleware of this.getPostMiddlewares(Method.Values)) payload = await middleware[Method.Values](payload);

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
	public async init(): Promise<this> {
		await this.middlewares.loadAll();

		const context = await this.provider.init({ name: this.name, instance: this });

		if (context.error) throw context.error;

		return this;
	}

	/**
	 * Enables a middleware that was not enabled by default.
	 * @since 2.0.0
	 * @param name The name of the middleware to enable.
	 */
	public use(name: string): this {
		const middleware = this.middlewares.get(name);

		if (!middleware) throw new JoshError({ identifier: Josh.Identifiers.MiddlewareNotFound, message: `The middleware "${name}" does not exist.` });

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
	private convertBulkData<Value = StoredValue, K extends keyof ReturnBulk<Value> = Bulk.Object>(
		data: ReturnBulk<Value>[Bulk.Object],
		returnBulkType?: K
	): ReturnBulk<Value>[K] {
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
	private getKeyPath(keyPath: KeyPath): [string, StringArray] {
		return typeof keyPath === 'string' ? [keyPath, []] : [keyPath[0], keyPath[1] ?? []];
	}

	/**
	 * Filters pre-provider middlewares by a method.
	 * @since 2.0.0
	 * @param method The method to filter by.
	 * @returns The filtered middlewares.
	 */
	private getPreMiddlewares(method: Method): Middleware[] {
		return this.middlewares.filterByCondition(method, Trigger.PreProvider);
	}

	/**
	 * Filters post-provider middlewares by a method.
	 * @param method The method to filter by.
	 * @returns The filtered middlewares.
	 */
	private getPostMiddlewares(method: Method): Middleware[] {
		return this.middlewares.filterByCondition(method, Trigger.PostProvider);
	}

	/**
	 * A static method to create multiple instances of {@link Josh}.
	 * @since 2.0.0
	 * @param names The names to give each instance of {@link Josh}
	 * @param options The options to give all the instances.
	 * @returns
	 */
	public static multi<Instances extends Record<string, Josh> = Record<string, Josh>>(
		names: string[],
		options: Omit<Josh.Options, 'name'> = {}
	): Instances {
		const instances: Record<string, Josh> = {};

		for (const [name, instance] of names.map((name) => [name, new Josh({ ...options, name })]) as [string, Josh][]) instances[name] = instance;

		// @ts-expect-error 2322
		return instances;
	}
}

export namespace Josh {
	/**
	 * The options for {@link Josh}.
	 * @since 2.0.0
	 */
	export interface Options<StoredValue = unknown> {
		/**
		 * The name for the Josh instance.
		 * @since 2.0.0
		 */
		name?: string;

		/**
		 * The provider instance.
		 * @since 2.0.0
		 */
		provider?: JoshProvider<StoredValue>;

		/**
		 * The middleware directory.
		 * @since 2.0.0
		 */
		middlewareDirectory?: string;

		/**
		 * The middleware context data.
		 * @since 2.0.0
		 */
		middlewareContextData?: MiddlewareContextData<StoredValue>;
	}

	export enum Identifiers {
		EveryInvalidValue = 'everyInvalidValue',

		EveryMissingValue = 'everyMissingValue',

		FilterInvalidValue = 'filterInvalidValue',

		FilterMissingValue = 'filterMissingValue',

		FindInvalidValue = 'findInvalidValue',

		FindMissingValue = 'findMissingValue',

		InvalidProvider = 'invalidProvider',

		MiddlewareNotFound = 'middlewareNotFound',

		MissingName = 'missingName',

		PartitionInvalidValue = 'partitionInvalidValue',

		PartitionMissingValue = 'partitionMissingValue',

		RemoveInvalidValue = 'removeInvalidValue',

		SomeInvalidValue = 'someInvalidValue',

		SomeMissingValue = 'someMissingValue'
	}
}

export enum Bulk {
	Object,

	Map,

	OneDimensionalArray,

	TwoDimensionalArray
}

export interface ReturnBulk<Value = unknown> {
	[Bulk.Object]: Record<string, Value>;

	[Bulk.Map]: Map<string, Value>;

	[Bulk.OneDimensionalArray]: Value[];

	[Bulk.TwoDimensionalArray]: [string, Value][];

	[K: string]: Record<string, Value> | Map<string, Value> | Value[] | [string, Value][];
}

/**
 * The context data for middlewares. Indexed by their keys being the name of the middleware.
 * @since 2.0.0
 */
export interface MiddlewareContextData<Value = unknown> {
	[BuiltInMiddleware.AutoEnsure]?: AutoEnsureContext<Value>;

	[K: string]: Middleware.Context | undefined;
}