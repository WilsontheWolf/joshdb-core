import type { Awaited } from '@sapphire/utilities';
import type { Method } from '../types';
import type { Payload } from './Payload';

/**
 * The union payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
export interface FindPayload<Value = unknown> extends Payload, Payload.OptionalData<Value> {
	/**
	 * The method for this payload.
	 * @since 2.0.0
	 */
	method: Method.Find;

	/**
	 * The type for this payload.
	 * @since 2.0.0
	 */
	type: Payload.Type;

	/**
	 * The input data for this payload.
	 * @since 2.0.0
	 */
	inputData?: Value;

	/**
	 * The input hook for this payload.
	 * @since 2.0.0
	 */
	inputHook?: FindHook<Value>;

	/**
	 * The path for this payload.
	 * @since 2.0.0
	 */
	path?: string[];
}

/**
 * The data payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.ByData}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
export interface FindByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.OptionalData<Value> {
	/**
	 * The method for this payload
	 * @since 2.0.0
	 */
	method: Method.Find;

	/**
	 * The input data for this payload.
	 * @since 2.0.0
	 */
	inputData: Value;

	/**
	 * The path for this payload.
	 * @since 2.0.0
	 */
	path?: string[];
}

/**
 * The hook payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
export interface FindByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.OptionalData<Value> {
	/**
	 * The method for this payload
	 * @since 2.0.0
	 */
	method: Method.Find;

	/**
	 * The input hook for this payload.
	 * @since 2.0.0
	 */
	inputHook: FindHook<Value>;

	/**
	 * The path for this payload.
	 */
	path?: string[];
}

/**
 * The hook for {@link FindByHookPayload}
 * @since 2.0.0
 */
export type FindHook<Value = unknown> = (data: Value) => Awaited<boolean>;
