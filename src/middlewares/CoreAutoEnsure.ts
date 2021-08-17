import { ApplyOptions } from '../lib/decorators/ApplyOptions';
import type {
	DecPayload,
	GetManyPayload,
	GetPayload,
	IncPayload,
	PushPayload,
	SetPayload,
	UpdateByDataPayload,
	UpdateByHookPayload,
	UpdatePayload
} from '../lib/payloads';
import type { SetManyPayload } from '../lib/payloads/SetMany';
import { Middleware } from '../lib/structures/Middleware';
import { BuiltInMiddleware, Method, Trigger } from '../lib/types';

@ApplyOptions<Middleware.Options>({
	name: BuiltInMiddleware.AutoEnsure,
	position: 0,
	conditions: [
		{
			methods: [Method.Get, Method.GetMany, Method.Update],
			trigger: Trigger.PostProvider
		},
		{
			methods: [Method.Dec, Method.Inc, Method.Push, Method.Set, Method.SetMany],
			trigger: Trigger.PreProvider
		}
	],
	use: false
})
export class CoreAutoEnsure extends Middleware<AutoEnsureContext> {
	public async [Method.Dec](payload: DecPayload): Promise<DecPayload> {
		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;

		await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		return payload;
	}

	public async [Method.Get]<Value = unknown>(payload: GetPayload<Value>): Promise<GetPayload<Value>> {
		if (payload.data !== undefined) return payload;

		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;
		const { data } = await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		Reflect.set(payload, 'data', data);

		return payload;
	}

	public async [Method.GetMany]<Value = unknown>(payload: GetManyPayload<Value>): Promise<GetManyPayload<Value>> {
		if (Object.keys(payload.data).length !== 0) return payload;

		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;

		for (const [key] of payload.keyPaths) {
			if (payload.data[key] !== undefined) continue;

			const { data } = await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

			Reflect.set(payload, 'data', data);
		}

		return payload;
	}

	public async [Method.Inc](payload: IncPayload): Promise<IncPayload> {
		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;

		await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		return payload;
	}

	public async [Method.Push](payload: PushPayload): Promise<PushPayload> {
		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;

		await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

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

	public async [Method.Update]<Value = unknown>(payload: UpdateByDataPayload<Value>): Promise<UpdateByDataPayload<Value>>;
	public async [Method.Update]<Value = unknown>(payload: UpdateByHookPayload<Value>): Promise<UpdateByHookPayload<Value>>;
	public async [Method.Update]<Value = unknown>(payload: UpdatePayload<Value>): Promise<UpdatePayload<Value>> {
		const context = this.getContext();

		if (!context) return payload;

		const { defaultValue } = context;
		const { key } = payload;

		await this.provider.ensure({ method: Method.Ensure, key, data: defaultValue, defaultValue });

		return payload;
	}
}

export interface AutoEnsureContext<Value = unknown> extends Middleware.Context {
	defaultValue: Value;
}