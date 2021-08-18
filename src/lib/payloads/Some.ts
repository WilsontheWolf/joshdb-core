import type { Awaited } from '@sapphire/utilities';
import type { Method } from '../types';
import type { Payload } from './Payload';

/**
 * The {@link Payload} for `some` using {@link Payload.Data}
 * @since 2.0.0
 */
export interface SomePayload<Value = unknown> extends Payload, Payload.Data<boolean> {
	/**
	 * The method for this payload.
	 * @since 2.0.0
	 */
	method: Method.Some;

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
	inputHook?: SomeHook<Value>;

	/**
	 * The path for this payload.
	 * @since 2.0.0
	 */
	path?: string[];
}

/**
 * The {@link Payload} for `some` using {@link Payload.ByData} and {@link Payload.Data}
 * @since 2.0.0
 */
export interface SomeByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.Data<boolean> {
	/**
	 * The method for this payload.
	 * @since 2.0.0
	 */
	method: Method.Some;

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
 * The {@link Payload} for `some` using {@link Payload.ByHook} and {@link Payload.Data}
 * @since 2.0.0
 */
export interface SomeByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<boolean> {
	/**
	 * The method for this payload.
	 * @since 2.0.0
	 */
	method: Method.Some;

	/**
	 * The input hook for this payload.
	 * @since 2.0.0
	 */ inputHook: SomeHook<Value>;

	/**
	 * The path for this payload.
	 * @since 2.0.0
	 */
	path?: string[];
}

/**
 * The hook for {@link SomeByHookPayload}
 * @since 2.0.0
 */
export type SomeHook<Value = unknown> = (data: Value) => Awaited<boolean>;
