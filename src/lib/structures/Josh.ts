import { classExtends, Constructor } from '@sapphire/utilities';
import { get } from 'lodash';
import { join } from 'path';
import { Method } from '../types/Method';
import { JoshError } from './JoshError';
import { JoshProvider, JoshProviderOptions } from './JoshProvider';
import { MapProvider } from './MapProvider';
import { MiddlewareStore } from './MiddlewareStore';

export class Josh<T = unknown> {
	public name: string;

	private middlewares: MiddlewareStore;

	private provider: JoshProvider<T>;

	public constructor(options: JoshOptions<T>) {
		const { name, provider, middlewareDirectory } = options;

		if (!name) throw new JoshError('Name option not found.', 'JoshOptionsError');

		const Provider = provider ?? Josh.defaultProvider;

		if (!classExtends(Provider, JoshProvider as Constructor<JoshProvider<T>>)) throw new JoshError('Provider class must extend JoshProvider.');

		const initializedProvider = new Provider({ name, instance: this, options: options.providerOptions });

		this.provider = initializedProvider;
		this.name = name;
		this.middlewares = new MiddlewareStore({ instance: this }).registerPath(middlewareDirectory ?? join(__dirname, '..', 'middleware', this.name));
	}

	public async get<V = T>(keyOrPath: string): Promise<V | null> {
		const [key, path] = this.getKeyAndPath(keyOrPath);
		let payload = await this.provider.get<V>(key, path);

		const middlewares = this.middlewares.findByMethod(Method.Get);

		for (const middleware of middlewares) payload = await middleware.run(payload);

		return (path.length ? get(payload.data, path) : payload.data) ?? null;
	}

	public async getAll<V = T>(): Promise<ReturnBulk<V>> {
		let payload = await this.provider.getAll<V>();

		const middlewares = this.middlewares.findByMethod(Method.GetAll);

		for (const middleware of middlewares) payload = await middleware.run(payload);

		return payload.data;
	}

	public async set<V = T>(keyOrPath: string, value: V): Promise<this> {
		const [key, path] = this.getKeyAndPath(keyOrPath);
		const payload = await this.provider.set<V>(key, path, value);

		const middlewares = this.middlewares.findByMethod(Method.Set);

		for (const middleware of middlewares) await middleware.run(payload);

		return this;
	}

	public async init(): Promise<this> {
		await this.middlewares.loadAll();

		const success = await this.provider.init();

		if (!success) throw new JoshError('Initiating provider was unsuccessful.');

		return this;
	}

	protected getKeyAndPath(keyOrPath: string): [string, string] {
		const [key, ...path] = keyOrPath.split('.');
		return [key, path.join('.')];
	}

	public static defaultProvider: Constructor<JoshProvider> = MapProvider;
}

export interface JoshOptions<T = unknown> {
	name?: string;

	provider?: Constructor<JoshProvider<T>>;

	providerOptions?: JoshProviderOptions;

	middlewareDirectory?: string;

	returnBulkType: JoshReturnBulk;
}

export enum JoshReturnBulk {
	Object,

	Map,

	OneDimensionalArray,

	TwoDimensionalArray
}

export type ReturnBulk<T = unknown> = Record<string, T> | Map<string, T> | T[] | [string, T][];
