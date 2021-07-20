import { Piece, PieceContext, PieceOptions } from '@sapphire/pieces';
import type { Awaited } from '@sapphire/utilities';
import { Condition, Method, Trigger } from '../types';
import { JoshError } from './JoshError';
import type { GetAllPayload, GetPayload, SetPayload } from './payloads';
import type { HasPayload } from './payloads/Has';

export abstract class Middleware extends Piece {
	public readonly position?: number;

	public readonly conditions: Condition[];

	public constructor(context: PieceContext, options: MiddlewareOptions = {}) {
		super(context, options);

		const { position, conditions } = options;

		if (!conditions) throw new JoshError('Missing condition option.', 'JoshMiddlewareError');

		for (const condition of conditions) {
			condition.methods ??= [];
			condition.trigger ??= Trigger.PostProvider;
		}

		this.position = position;
		this.conditions = conditions;
	}

	public [Method.Get]<V = unknown>(payload: GetPayload<V>): Awaited<GetPayload<V>> {
		return payload;
	}

	public [Method.GetAll]<V = unknown>(payload: GetAllPayload<V>): Awaited<GetAllPayload<V>> {
		return payload;
	}

	public [Method.Has](payload: HasPayload): Awaited<HasPayload> {
		return payload;
	}

	public [Method.Set](payload: SetPayload): Awaited<SetPayload> {
		return payload;
	}
}

export interface MiddlewareOptions extends PieceOptions {
	position?: number;

	conditions?: Condition[];
}
