import type { Method } from '../types';
import type { Payload } from './Payload';

/**
 * The payload for {@link Method.Dec}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
export interface DecPayload extends Payload, Payload.KeyPath {
	/**
	 * The method this payload is for.
	 * @since 2.0.0
	 */
	method: Method.Dec;
}