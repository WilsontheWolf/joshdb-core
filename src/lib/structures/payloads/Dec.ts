import type { Payload } from './Payload';

export interface DecPayload extends Payload, Payload.KeyPath, Payload.Data<number> {}
