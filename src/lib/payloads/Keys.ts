import type { Method } from '../types';
import type { Payload } from './Payload';

/**
 * The {@link Payload} for `keys` using {@link Payload.Data}
 * @since 2.0.0
 */
export interface KeysPayload extends Payload, Payload.Data<string[]> {
	/**
	 * THe method for this payload.
	 * @since 2.0.0
	 */
	method: Method.Keys;
}
