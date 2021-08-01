import { ApplyOptions } from '../structures/decorators/ApplyOptions';
import { Middleware, MiddlewareContext, MiddlewareOptions } from '../structures/Middleware';
import type { GetManyPayload, GetPayload, SetPayload } from '../structures/payloads';
import type { SetManyPayload } from '../structures/payloads/SetMany';
import { BuiltInMiddleware, Method, Trigger } from '../types';

@ApplyOptions<MiddlewareOptions>({
	name: BuiltInMiddleware.AutoEnsure,
	position: 0,
	conditions: [
		{
			methods: [Method.Get, Method.GetMany],
			trigger: Trigger.PostProvider
		},
		{
			methods: [Method.Set, Method.SetMany],
			trigger: Trigger.PreProvider
		}
	],
	use: false
})
export class CoreAutoEnsure extends Middleware<AutoEnsureContext> {
	public async [Method.Get]<V = unknown>(payload: GetPayload<V>): Promise<GetPayload<V>> {
		if (payload.data !== null) return payload;

		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;
		const { data } = await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		Reflect.set(payload, 'data', data);

		return payload;
	}

	public async [Method.GetMany]<V = unknown>(payload: GetManyPayload<V>): Promise<GetManyPayload<V>> {
		if (Object.keys(payload.data).length !== 0) return payload;

		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;

		for (const [key] of payload.keyPaths) {
			if (payload.data[key] !== null) continue;

			const { data } = await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

			Reflect.set(payload, 'data', data);
		}

		return payload;
	}

	public async [Method.Set](payload: SetPayload): Promise<SetPayload> {
		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;

		await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		return payload;
	}

	public async [Method.SetMany](payload: SetManyPayload): Promise<SetManyPayload> {
		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;

		for (const [key] of payload.keyPaths) await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		return payload;
	}
}

export interface AutoEnsureContext<T = unknown> extends MiddlewareContext {
	defaultValue: T;
}
