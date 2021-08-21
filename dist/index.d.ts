import { PieceOptions, Store, Piece, PieceContext } from '@sapphire/pieces';
import { Awaited } from '@sapphire/utilities';

/**
 * Decorator function that applies given options to {@link Middleware} piece.
 * @since 2.0.0
 * @param options The options to pass to the middleware constructor.
 *
 * @example
 * ```typescript
 * import { ApplyOptions, Middleware } from '@joshdb/core';
 *
 * (at)ApplyOptions<Middleware.Options>({
 *   name: 'name',
 *   position: 0,
 *   conditions: []
 * })
 * export class CoreMiddleware extends Middleware {}
 * ```
 */
declare function ApplyOptions<T extends PieceOptions>(options: T): ClassDecorator;

/**
 * The base class for errors in {@link Josh}
 * @since 2.0.0
 */
declare class JoshError extends Error {
    /**
     * The identifier for this error.
     * @since 2.0.0
     */
    identifier: string;
    constructor(options: JoshError.Options);
    /**
     * The name of this error.
     */
    get name(): string;
}
declare namespace JoshError {
    /**
     * The options for {@link JoshError}
     * @since 2.0.0
     */
    interface Options {
        /**
         * The identifier for this error.
         * @since 2.0.0
         */
        identifier: string;
        /**
         * The message for this error.
         * @since 2.0.0
         */
        message?: string;
    }
}

declare enum BuiltInMiddleware {
    AutoEnsure = "autoEnsure"
}

declare type KeyPathArray = [string, string[]];
declare type KeyPath = KeyPathArray | string;

declare enum Method {
    AutoKey = "autoKey",
    Dec = "dec",
    Delete = "delete",
    Ensure = "ensure",
    Every = "every",
    Filter = "filter",
    Find = "find",
    Get = "get",
    GetAll = "getAll",
    GetMany = "getMany",
    Has = "has",
    Inc = "inc",
    Init = "init",
    Keys = "keys",
    Map = "map",
    Push = "push",
    Random = "random",
    RandomKey = "randomKey",
    Remove = "remove",
    Set = "set",
    SetMany = "setMany",
    Size = "size",
    Some = "some",
    Update = "update",
    Values = "values"
}

declare enum Trigger {
    PreProvider = 0,
    PostProvider = 1
}

/**
 * The base class for {@link JoshProvider}.
 * @since 2.0.0
 */
declare class JoshProviderError extends JoshError {
    /**
     * The method this error applies to.
     * @since 2.0.0
     */
    method: Method;
    constructor(options: JoshProviderError.Options);
    /**
     * The name for this error.
     * @since 2.0.0
     */
    get name(): string;
}
declare namespace JoshProviderError {
    /**
     * The options for {@link JoshProviderError}
     * @since 2.0.0
     */
    interface Options extends JoshError.Options {
        /**
         * The method this error applies to.
         * @since 2.0.0
         */
        method: Method;
    }
}

/**
 * The base payload to use for most Josh structures.
 * @since 2.0.0
 */
interface Payload {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method;
    /**
     * The trigger for this payload.
     * @since 2.0.0
     */
    trigger?: Trigger;
    /**
     * The error for this payload.
     * @since 2.0.0
     */
    error?: JoshProviderError;
}
declare namespace Payload {
    /**
     * The key/path extension for {@link Payload}.
     * @since 2.0.0
     */
    interface KeyPath {
        /**
         * The key for this extension.
         * @since 2.0.0
         */
        key: string;
        /**
         * The path for this extension.
         * @since 2.0.0
         */
        path?: string[];
    }
    /**
     * The data extension for {@link Payload}.
     * @since 2.0.0
     */
    interface Data<Value = unknown> {
        /**
         * The data for this extension.
         * @since 2.0.0
         */
        data: Value;
    }
    /**
     * The optional data extension for {@link Payload}.
     * @see {@link Data}
     * @since 2.0.0
     */
    type OptionalData<Value = unknown> = Partial<Data<Value>>;
    /**
     * The byData extension for {@link Payload}.
     * @since 2.0.0
     */
    interface ByData {
        /**
         * The type for this extension.
         * @since 2.0.0
         */
        type: Type.Data;
    }
    /**
     * The byHook extension for {@link Payload}
     * @since 2.0.0
     */
    interface ByHook {
        /**
         * The type for this extension.
         * @since 2.0.0
         */
        type: Type.Hook;
    }
    /**
     * The byPath extension for {@link Payload}
     */
    interface ByPath {
        /**
         * The type for this extension
         * @since 2.0.0
         */
        type: Type.Path;
    }
    /**
     * The type enum for {@link Payload}.
     * @since 2.0.0
     */
    enum Type {
        /**
         * The data type.
         * @since 2.0.0
         */
        Data = "DATA",
        /**
         * The hook type.
         * @since 2.0.0
         */
        Hook = "HOOK",
        /**
         * The path type.
         * @since 2.0.0
         */
        Path = "PATH"
    }
}

/**
 * The payload for {@link Method.AutoKey}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface AutoKeyPayload extends Payload, Payload.Data<string> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.AutoKey;
}

/**
 * The payload for {@link Method.Dec}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface DecPayload extends Payload, Payload.KeyPath, Payload.OptionalData<number> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Dec;
}

/**
 * The payload for {@link Method.Delete}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface DeletePayload extends Payload, Payload.KeyPath {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Delete;
}

/**
 * The payload for {@link Method.Ensure}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EnsurePayload<Value = unknown> extends Payload, Payload.Data<Value> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Ensure;
    /**
     * The key for this payload.
     * @since 2.0.0
     */
    key: string;
    /**
     * The default value for this payload.
     * @since 2.0.0
     */
    defaultValue: Value;
}

/**
 * The union payload for {@link Method.Every}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EveryPayload<Value = unknown> extends Payload, Payload.Data<boolean> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Every;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Data | Payload.Type.Hook;
    /**
     * The input data for this payload.
     * @since 2.0.0
     */
    inputData?: Value;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook?: EveryHook<Value>;
    /**
     * The path for this payload.
     * @since 2.0.0
     */
    path?: string[];
}
/**
 * The data payload for {@link Method.Every}
 * @see {@link Payload}
 * @see {@link Payload.ByData}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EveryByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.Data<boolean> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Every;
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
 * The hook payload for {@link Method.Every}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EveryByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<boolean> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Every;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook: EveryHook<Value>;
    /**
     * The path for this payload.
     * @since 2.0.0
     */
    path?: string[];
}
/**
 * The hook for {@link EveryByHookPayload}
 * @since 2.0.0
 */
declare type EveryHook<Value = unknown> = (data: Value) => Awaited<boolean>;

/**
 * The union payload for {@link Method.Filter}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface FilterPayload<Value = unknown> extends Payload, Payload.OptionalData<Record<string, Value | null>> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Filter;
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
    inputHook?: FilterHook<Value>;
    /**
     * The path for this payload.
     * @since 2.0.0
     */
    path?: string[];
}
/**
 * The data payload for {@link Method.Filter}
 * @see {@link Payload}
 * @see {@link Payload.ByData}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface FilterByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.Data<Record<string, Value>> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Filter;
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
 * The hook payload for {@link Method.Filter}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface FilterByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<Record<string, Value>> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Filter;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook: FilterHook<Value>;
    /**
     * The path for this payload.
     * @since 2.0.0
     */
    path?: string[];
}
/**
 * The hook for {@link FilterByHookPayload}
 * @since 2.0.0
 */
declare type FilterHook<Value = unknown> = (data: Value) => Awaited<Value>;

/**
 * The union payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface FindPayload<Value = unknown> extends Payload, Payload.OptionalData<Value> {
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
interface FindByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.OptionalData<Value> {
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
interface FindByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.OptionalData<Value> {
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
declare type FindHook<Value = unknown> = (data: Value) => Awaited<boolean>;

/**
 * The payload for {@link Method.Get}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface GetPayload<Value = unknown> extends Payload, Payload.KeyPath, Payload.OptionalData<Value> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Get;
}

/**
 * The payload for {@link Method.GetAll}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface GetAllPayload<Value = unknown> extends Payload, Payload.Data<Record<string, Value>> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.GetAll;
}

/**
 * The payload for {@link Method.GetMany}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface GetManyPayload<Value = unknown> extends Payload, Payload.Data<Record<string, Value | null>> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.GetMany;
    /**
     * The key/paths for this payload.
     * @since 2.0.0
     */
    keyPaths: KeyPathArray[];
}

/**
 * The payload for {@link Method.Has}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface HasPayload extends Payload, Payload.KeyPath, Payload.Data<boolean> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Has;
}

/**
 * The payload for {@link Method.Inc}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface IncPayload extends Payload, Payload.KeyPath, Payload.OptionalData<number> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Inc;
}

/**
 * The payload for {@link Method.Keys}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface KeysPayload extends Payload, Payload.Data<string[]> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Keys;
}

/**
 * The union payload for {@link Method.Map}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface MapPayload<Value = unknown> extends Payload, Payload.Data<Value[]> {
    /**
     * The method for this payload.
     *  @since 2.0.0
     */
    method: Method.Map;
    /**
     *  The type for this payload.
     *  @since 2.0.0
     */
    type: Payload.Type.Path | Payload.Type.Hook;
    /**
     * The path for this payload.
     *  @since 2.0.0
     */
    path?: string[];
    /**
     * The hook for this payload.
     *  @since 2.0.0
     */ hook?: MapHook<Value>;
}
/**
 *  The path payload for {@link Method.Map}
 *  @see {@link Payload}
 *  @see {@link Payload.ByPath}
 *  @see {@link Payload.Data}
 *  @since 2.0.0
 */
interface MapByPathPayload<Value = unknown> extends Payload, Payload.ByPath, Payload.Data<Value[]> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Map;
    /**
     *  The path for this payload.
     * @since 2.0.0
     */
    path: string[];
}
/**
 * The hook payload for {@link Method.Map}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface MapByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<Value[]> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Map;
    /**
     * The hook for this payload.
     * @since 2.0.0
     */
    hook: MapHook<Value>;
}
/**
 * The hook for {@link MapByHookPayload}
 * @since 2.0.0
 */
declare type MapHook<Value = unknown> = (data: Value) => Awaited<Value>;

/**
 * The payload for {@link Method.Push}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface PushPayload extends Payload, Payload.KeyPath {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Push;
}

/**
 * The payload for {@link Method.Random}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface RandomPayload<Value = unknown> extends Payload, Payload.OptionalData<Value> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Random;
}

/**
 * The payload for {@link Method.RandomKey}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface RandomKeyPayload extends Payload, Payload.OptionalData<string> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.RandomKey;
}

/**
 * The union payload for {@link Method.Remove}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface RemovePayload<Value = unknown> extends Payload, Payload.KeyPath {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Remove;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Data | Payload.Type.Hook;
    /**
     * The input data for this payload.
     * @since 2.0.0
     */
    inputData?: Value;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook?: RemoveHook<Value>;
}
/**
 * The data payload for {@link Method.Remove}
 * @see {@link Payload}
 * @see {@link Payload.ByData}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface RemoveByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.KeyPath {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Remove;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Data;
    /**
     * The input data for this payload.
     * @since 2.0.0
     */
    inputData: Value;
}
/**
 * The hook payload for {@link Method.Remove}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.KeyPath}
 */
interface RemoveByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.KeyPath {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Remove;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook: RemoveHook<Value>;
}
/**
 * The hook for {@link RemoveByHookPayload}
 * @since 2.0.0
 */
declare type RemoveHook<Value = unknown> = (data: Value) => Awaited<boolean>;

/**
 * The payload for {@link Method.Set}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface SetPayload extends Payload, Payload.KeyPath {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Set;
}

/**
 * The payload for {@link Method.SetMany}
 * @see {@link Payload}
 * @since 2.0.0
 */
interface SetManyPayload extends Payload {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.SetMany;
    /**
     * The key/paths for this payload.
     * @since 2.0.0
     */
    keyPaths: KeyPathArray[];
}

/**
 * The payload for {@link Method.Size}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SizePayload extends Payload, Payload.Data<number> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Size;
}

/**
 * The union payload for {@link Method.Some}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SomePayload<Value = unknown> extends Payload, Payload.Data<boolean> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Some;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Data | Payload.Type.Hook;
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
 * The data payload for {@link Method.Some}
 * @see {@link Payload}
 * @see {@link Payload.ByData}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SomeByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.Data<boolean> {
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
 * The hook payload for {@link Method.Some}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SomeByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<boolean> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Some;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook: SomeHook<Value>;
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
declare type SomeHook<Value = unknown> = (data: Value) => Awaited<boolean>;

/**
 * The union payload for {@link Method.Update}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface UpdatePayload<Value = unknown> extends Payload, Payload.KeyPath, Payload.OptionalData<Value> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Update;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Data | Payload.Type.Hook;
    /**
     * The input data for this payload.
     * @since 2.0.0
     */
    inputData?: Value;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook?: UpdateHook<Value>;
}
/**
 * The data payload for {@link Method.Update}
 * @see {@link Payload}
 * @see {@link Payload.ByData}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface UpdateByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.KeyPath, Payload.OptionalData<Value> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Update;
    /**
     * The input data for this payload.
     * @since 2.0.0
     */
    inputData: Value;
}
/**
 * The hook payload for {@link Method.Update}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface UpdateByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.KeyPath, Payload.OptionalData<Value> {
    /**
     * The method for this payload.
     * @since 2.0.0
     */
    method: Method.Update;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    inputHook: UpdateHook<Value>;
}
/**
 * The hook for {@link UpdateByHookPayload}
 * @since 2.0.0
 */
declare type UpdateHook<Value = unknown> = (currentData: Value) => Awaited<Value>;

/**
 * The payload for {@link Method.Values}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface ValuesPayload<Value = unknown> extends Payload, Payload.Data<Value[]> {
    /**
     * The method for this payload
     * @since 2.0.0
     */
    method: Method.Values;
}

/**
 * The store to contain {@link Middleware} pieces.
 * @since 2.0.0
 */
declare class MiddlewareStore<Value = unknown> extends Store<Middleware> {
    /**
     * The {@link Josh} instance for this store.
     */
    instance: Josh<Value>;
    constructor(options: MiddlewareStoreOptions<Value>);
    /**
     * Filter middlewares by their conditions.
     * @since 2.0.0
     * @param method The method to filter by.
     * @param trigger The trigger to filter by.
     * @returns An array of middleware's in which the method and trigger matched.
     */
    filterByCondition(method: Method, trigger: Trigger): Middleware[];
}
/**
 * The options for {@link MiddlewareStore}
 * @since 2.0.0
 */
interface MiddlewareStoreOptions<Value = unknown> {
    /**
     * The {@link Josh} instance for this store.
     * @since 2.0.0
     */
    instance: Josh<Value>;
}

/**
 * The base class piece for creating middlewares. Extend this piece to create a middleware.
 * @see {@link Middleware.Options} for all available options for middlewares.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * (at)ApplyOptions<MiddlewareOptions>({
 *   name: 'middleware',
 *   // More options...
 * })
 * export class CoreMiddleware extends Middleware {
 *   // Make method implementations...
 * }
 * ```
 */
declare abstract class Middleware<Context extends Middleware.Context = Middleware.Context> extends Piece {
    /**
     * The store for this middleware.
     * @since 2.0.0
     */
    store: MiddlewareStore;
    /**
     * The position of this middleware.
     * @since 2.0.0
     */
    readonly position?: number;
    /**
     * The conditions of this middleware.
     * @since 2.0.0
     */
    readonly conditions: Middleware.Condition[];
    /**
     * Whether to use this middleware or not.
     * @since 2.0.0
     * @default true
     */
    use: boolean;
    constructor(context: PieceContext, options?: Middleware.Options);
    [Method.AutoKey](payload: AutoKeyPayload): Awaited<AutoKeyPayload>;
    [Method.Dec](payload: DecPayload): Awaited<DecPayload>;
    [Method.Delete](payload: DeletePayload): Awaited<DeletePayload>;
    [Method.Ensure]<Value = unknown>(payload: EnsurePayload<Value>): Awaited<EnsurePayload<Value>>;
    [Method.Every]<Value = unknown>(payload: EveryByDataPayload<Value>): Awaited<EveryByDataPayload<Value>>;
    [Method.Every]<Value = unknown>(payload: EveryByHookPayload<Value>): Awaited<EveryByHookPayload<Value>>;
    [Method.Filter]<Value = unknown>(payload: FilterByDataPayload<Value>): Awaited<FilterByDataPayload<Value>>;
    [Method.Filter]<Value = unknown>(payload: FilterByHookPayload<Value>): Awaited<FilterByHookPayload<Value>>;
    [Method.Find]<Value = unknown>(payload: FindByDataPayload<Value>): Awaited<FindByDataPayload<Value>>;
    [Method.Find]<Value = unknown>(payload: FindByHookPayload<Value>): Awaited<FindByHookPayload<Value>>;
    [Method.Get]<Value = unknown>(payload: GetPayload<Value>): Awaited<GetPayload<Value>>;
    [Method.GetAll]<Value = unknown>(payload: GetAllPayload<Value>): Awaited<GetAllPayload<Value>>;
    [Method.GetMany]<Value = unknown>(payload: GetManyPayload<Value>): Awaited<GetManyPayload<Value>>;
    [Method.Has](payload: HasPayload): Awaited<HasPayload>;
    [Method.Inc](payload: IncPayload): Awaited<IncPayload>;
    [Method.Keys](payload: KeysPayload): Awaited<KeysPayload>;
    [Method.Map]<Value = unknown>(payload: MapByPathPayload<Value>): Awaited<MapByPathPayload<Value>>;
    [Method.Map]<Value = unknown>(payload: MapByHookPayload<Value>): Awaited<MapByHookPayload<Value>>;
    [Method.Push](payload: PushPayload): Awaited<PushPayload>;
    [Method.Random]<Value = unknown>(payload: RandomPayload<Value>): Awaited<RandomPayload<Value>>;
    [Method.RandomKey](payload: RandomKeyPayload): Awaited<RandomKeyPayload>;
    [Method.Remove]<Value = unknown>(payload: RemoveByDataPayload<Value>): Awaited<RemoveByDataPayload<Value>>;
    [Method.Remove]<Value = unknown>(payload: RemoveByHookPayload<Value>): Awaited<RemoveByHookPayload<Value>>;
    [Method.Set](payload: SetPayload): Awaited<SetPayload>;
    [Method.SetMany](payload: SetManyPayload): Awaited<SetManyPayload>;
    [Method.Size](payload: SizePayload): Awaited<SizePayload>;
    [Method.Some]<Value = unknown>(payload: SomeByDataPayload<Value>): Awaited<SomeByDataPayload<Value>>;
    [Method.Some]<Value = unknown>(payload: SomeByHookPayload<Value>): Awaited<SomeByHookPayload<Value>>;
    [Method.Update]<Value = unknown>(payload: UpdateByDataPayload<Value>): Awaited<UpdateByDataPayload<Value>>;
    [Method.Update]<Value = unknown>(payload: UpdateByHookPayload<Value>): Awaited<UpdateByHookPayload<Value>>;
    [Method.Values]<Value = unknown>(payload: ValuesPayload<Value>): Awaited<ValuesPayload<Value>>;
    run<P extends Payload>(payload: P): Awaited<unknown>;
    toJSON(): Record<string, any>;
    /**
     * Retrieve this middleware'es context data from the Josh instance.
     * @since 2.0.0
     * @returns The context or `undefined`
     */
    protected getContext<C extends Middleware.Context = Context>(): C | undefined;
    /**
     * Get this middleware's Josh instance.
     * @since 2.0.0
     */
    protected get instance(): Josh<unknown>;
    /**
     * Get this middleware's provider instance.
     * @since 2.0.0
     */
    protected get provider(): JoshProvider<unknown>;
}
declare namespace Middleware {
    /**
     * The options for {@link Middleware}
     * @since 2.0.0
     */
    interface Options extends PieceOptions {
        /**
         * The position at which this middleware runs at.
         * @since 2.0.0
         */
        position?: number;
        /**
         * The conditions for this middleware to run on.
         * @since 2.0.0
         */
        conditions?: Condition[];
        /**
         * Whether this middleware is enabled or not.
         * @since 2.0.0
         */
        use?: boolean;
    }
    /**
     * The middleware context base interface.
     * @since 2.0.0
     */
    interface Context {
    }
    /**
     * A middleware condition to run on.
     * @since 2.0.0
     */
    interface Condition {
        /**
         * The methods for this condition.
         * @since 2.0.0
         */
        methods: Method[];
        /**
         * The trigger for this condition.
         */
        trigger: Trigger;
    }
    enum Identifiers {
        MissingConditions = "missingConditions"
    }
}

interface AutoEnsureContext<Value = unknown> extends Middleware.Context {
    defaultValue: Value;
}

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
declare class Josh<Value = unknown> {
    /**
     * This Josh's name. Used for middleware and/or provider information.
     * @since 2.0.0
     */
    name: string;
    /**
     * This Josh's options. Used throughout the instance.
     * @since 2.0.0
     */
    options: Josh.Options<Value>;
    /**
     * The middleware store.
     *
     * NOTE: Do not use this unless you know what your doing.
     * @since 2.0.0
     */
    middlewares: MiddlewareStore;
    /**
     * This Josh's provider instance.
     *
     * NOTE: Do not use this unless you know what your doing.
     */
    provider: JoshProvider<Value>;
    constructor(options: Josh.Options<Value>);
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
    autoKey(): Promise<string>;
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
    dec(keyPath: KeyPath): Promise<this>;
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
    delete(keyPath: KeyPath): Promise<this>;
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
    ensure<CustomValue = Value>(key: string, defaultValue: CustomValue): Promise<CustomValue>;
    every<CustomValue = Value>(path: string[], value: CustomValue): Promise<boolean>;
    every<CustomValue = Value>(hook: EveryHook<CustomValue>, path?: string[]): Promise<boolean>;
    /**
     * Filter data using a path and value.
     * @since 2.0.0
     * @param path The path array to check on stored data.
     * @param value The value to check against the data at path.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     */
    filter<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(path: string[], value: CustomValue, returnBulkType?: K): Promise<ReturnBulk<CustomValue>[K]>;
    /** Filter data using a function and optional path.
     * @since 2.0.0
     * @param hook The function to run on stored data.
     * @param path The optional path array to get on stored data and pass to the function.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     */
    filter<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(hook: FilterHook<CustomValue>, path?: string[], returnBulkType?: K): Promise<ReturnBulk<CustomValue>[K]>;
    /**
     * Find data using a path and value.
     * @since 2.0.0
     * @param path The path array to check on stored data.
     * @param value The value to check against the data at path.
     * @returns The data found or `null`.
     */
    find<CustomValue = Value>(path: string[], value: CustomValue): Promise<CustomValue>;
    /**
     * Find data using a function and optional path.
     * @since 2.0.0
     * @param hook The function to run on stored data.
     * @param path The optional path array to get on stored data and pass to the function.
     * @returns The data found or `null`.
     */
    find<CustomValue = Value>(hook: FindHook<CustomValue>, path?: string[]): Promise<CustomValue | null>;
    /**
     * Get data at a specific key/path.
     * @since 2.0.0
     * @param keyPath The key/path to get data from.
     * @returns The data found or `null`.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.get('key'); // 'value'
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.get(['key', ['path']]); // 'value'
     * ```
     */
    get<CustomValue = Value>(keyPath: KeyPath): Promise<CustomValue | null>;
    /**
     * Get all data.
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
    getAll<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(returnBulkType?: K): Promise<ReturnBulk<CustomValue>[K]>;
    /**
     * Get data at many key/paths.
     * @since 2.0.0
     * @param keyPaths The key/paths to get from.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.getMany([['key', []]]); // { key: 'value' };
     * // Using a return bulk type.
     * await josh.getMany([['key', []]], Bulk.OneDimensionalArray); // ['value']
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.getMany([['key', ['path']]]); // { key: 'value' }
     * // Using a return bulk type.
     * await josh.getMany([['key', ['path]]], Bulk.TwoDimensionalArray); // [['key', 'value']]
     * ```
     */
    getMany<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(keyPaths: KeyPathArray[], returnBulkType?: K): Promise<ReturnBulk<CustomValue | null>[K]>;
    has(keyPath: KeyPath): Promise<boolean>;
    /**
     * Increment an integer by `1`.
     * @since 2.0.0
     * @param keyPath The key/path to the integer for incrementing.
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
    inc(keyPath: KeyPath): Promise<this>;
    /**
     * Get an array of keys.
     * @since 2.0.0
     * @returns The array of string keys.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.keys(); // ['key']
     * ```
     */
    keys(): Promise<string[]>;
    /**
     * Map all stored data to an array.
     * @since 2.0.0
     * @param pathOrHook A path array or hook function.
     * @returns The mapped data.
     *
     * @example
     * ```typescript
     * await josh.setMany([['key', []], ['anotherKey', []]], { path: 'value' });
     *
     * await josh.map((data) => data.path); // ['value', 'value']
     * ```
     */
    map<CustomValue = Value>(pathOrHook: string[] | MapHook<CustomValue>): Promise<CustomValue[]>;
    /**
     * Push a value to an array at a specific key/value.
     * @since 2.0.0
     * @param keyPath The key/path to the array for pushing.
     * @param value The value to push to the array.
     * @returns The {@link Josh} instance.
     */
    push<CustomValue = Value>(keyPath: KeyPath, value: CustomValue): Promise<this>;
    /**
     * Get a random value.
     * @since 2.0.0
     * @returns The random data or `null`.
     */
    random<CustomValue = Value>(): Promise<CustomValue | null>;
    /**
     * Get a random key.
     * @since 2.0.0
     * @returns The random key or `null`.
     */
    randomKey(): Promise<string | null>;
    remove<CustomValue = Value>(keyPath: KeyPath, inputDataOrHook: CustomValue | RemoveHook<CustomValue>): Promise<this>;
    /**
     * Set data at a specific key/path.
     * @since 2.0.0
     * @param keyPath The key/path to the data for setting.
     * @param value The value to set at the key/path.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.get('key'); // 'value';
     * ```
     */
    set<CustomValue = Value>(keyPath: KeyPath, value: CustomValue): Promise<this>;
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
    setMany<CustomValue = Value>(keyPaths: [string, string[]][], value: CustomValue): Promise<this>;
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
    size(): Promise<number>;
    /**
     * Check if data matches with a path and value.
     * @since 2.0.0
     * @param path The path array to check on stored data.
     * @param value The value to check against the data at path.
     * @returns Whether the data check is `true` or `false`.
     */
    some<CustomValue = Value>(path: string[], value: CustomValue): Promise<boolean>;
    /**
     * Check if data matches with a function and optional path.
     * @since 2.0.0
     * @param hook  The function to run on stored data.
     * @param path The optional path array to get on stored data and pass to the function.
     * @returns Whether the data check is `true` or `false`.
     */
    some<CustomValue = Value>(hook: SomeHook<CustomValue>, path?: string[]): Promise<boolean>;
    /**
     * Update data at a specific key/path.
     * @since 2.0.0
     * @param keyPath The key/path to data for updating.
     * @param inputDataOrHook The input, either a value or a function.
     * @returns The updated value or `null` if the data doesn't exist.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.update('key', 'anotherValue'); // 'anotherValue'
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' })
     *
     * await josh.update('key', (data) => {
     *   data.anotherPath = 'anotherValue';
     *
     *   return data;
     * }); // { path: 'value', anotherPath: 'anotherValue' }
     * ```
     */
    update<CustomValue = Value>(keyPath: KeyPath, inputDataOrHook: CustomValue | UpdateHook<CustomValue>): Promise<CustomValue | null>;
    /**
     * Get all data values.
     * @since 2.0.0
     * @returns An array of data values.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     * await josh.set('anotherKey', 'anotherValue');
     *
     * await josh.values(); // ['value', 'anotherValue']
     * ```
     */
    values<CustomValue = Value>(): Promise<CustomValue[]>;
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
    init(): Promise<this>;
    /**
     * Enables a middleware that was not enabled by default.
     * @since 2.0.0
     * @param name The name of the middleware to enable.
     */
    use(name: string): this;
    /** A private method for converting bulk data.
     * @since 2.0.0
     * @private
     * @param data The data to convert.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     */
    private convertBulkData;
    /**
     * A private method for extracting the key/path from a {@link KeyPath} type.
     * @since 2.0.0
     * @private
     * @param keyPath The key/path to extract from.
     * @returns The extracted key/path data.
     */
    private getKeyPath;
    /**
     * A static method to create multiple instances of {@link Josh}.
     * @since 2.0.0
     * @param names The names to give each instance of {@link Josh}
     * @param options The options to give all the instances.
     * @returns
     */
    static multi<Instances extends Record<string, Josh> = Record<string, Josh>>(names: string[], options?: Omit<Josh.Options, 'name'>): Instances;
}
declare namespace Josh {
    /**
     * The options for {@link Josh}.
     * @since 2.0.0
     */
    interface Options<Value = unknown> {
        /**
         * The name for the Josh instance.
         * @since 2.0.0
         */
        name?: string;
        /**
         * The provider instance.
         * @since 2.0.0
         */
        provider?: JoshProvider<Value>;
        /**
         * The middleware directory.
         * @since 2.0.0
         */
        middlewareDirectory?: string;
        /**
         * The middleware context data.
         * @since 2.0.0
         */
        middlewareContextData?: MiddlewareContextData<Value>;
    }
    enum Identifiers {
        EveryInvalidPath = "everyInvalidPath",
        EveryMissingValue = "everyMissingValue",
        FilterInvalidPath = "filterInvalidPath",
        FilterMissingValue = "filterMissingValue",
        FindInvalidPath = "findInvalidPath",
        FindMissingValue = "findMissingValue",
        MissingName = "missingName",
        InvalidProvider = "invalidProvider",
        MiddlewareNotFound = "middlewareNotFound",
        SomeInvalidPath = "someInvalidPath",
        SomeMissingValue = "someMissingValue"
    }
}
declare enum Bulk {
    Object = 0,
    Map = 1,
    OneDimensionalArray = 2,
    TwoDimensionalArray = 3
}
interface ReturnBulk<Value = unknown> {
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
interface MiddlewareContextData<Value = unknown> {
    [BuiltInMiddleware.AutoEnsure]?: AutoEnsureContext<Value>;
    [K: string]: Middleware.Context | undefined;
}

/**
 * The base provider class. Extend this class to create your own provider.
 *
 * NOTE: If you want an example of how to use this class please see `src/lib/structures/defaultProvider/MapProvider.ts`
 *
 * @see {@link JoshProvider.Options} for all options available to the JoshProvider class.
 *
 * @since 2.0.0
 * @example
 * ```typescript
 * export class Provider extends JoshProvider {
 *   // Implement methods...
 * }
 * ```
 */
declare abstract class JoshProvider<Value = unknown> {
    /**
     * The name for this provider.
     * @since 2.0.0
     */
    name?: string;
    /**
     * The {@link Josh} instance for this provider.
     * @since 2.0.0
     */
    instance?: Josh<Value>;
    /**
     * The options for this provider.
     * @since 2.0.0
     */
    options: JoshProvider.Options;
    constructor(options?: JoshProvider.Options);
    /**
     * Initialize the provider.
     * @since 2.0.0
     * @param context The provider's context sent by this provider's {@link Josh} instance.
     * @returns The provider's context.
     *
     * @example
     * ```typescript
     * public async init(context: JoshProvider.Context<Value>): Promise<JoshProvider.Context<Value>> {
     *   // Initialize provider...
     *   context = await super.init(context);
     *   // Initialize provider...
     *   return context;
     * }
     * ```
     */
    init(context: JoshProvider.Context<Value>): Promise<JoshProvider.Context<Value>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract autoKey(payload: AutoKeyPayload): Awaited<AutoKeyPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract dec(payload: DecPayload): Awaited<DecPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract delete(payload: DeletePayload): Awaited<DeletePayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract ensure<CustomValue = Value>(payload: EnsurePayload<CustomValue>): Awaited<EnsurePayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract everyByData<CustomValue = Value>(payload: EveryByDataPayload<CustomValue>): Awaited<EveryByDataPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract everyByHook<CustomValue = Value>(payload: EveryByHookPayload<CustomValue>): Awaited<EveryByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract filterByData<CustomValue = Value>(payload: FilterByDataPayload<CustomValue>): Awaited<FilterByDataPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract filterByHook<CustomValue = Value>(payload: FilterByHookPayload<CustomValue>): Awaited<FilterByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract findByData<CustomValue = Value>(payload: FindByDataPayload<CustomValue>): Awaited<FindByDataPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract findByHook<CustomValue = Value>(payload: FindByHookPayload<CustomValue>): Awaited<FindByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract get<CustomValue = Value>(payload: GetPayload<CustomValue>): Awaited<GetPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract getAll<CustomValue = Value>(payload: GetAllPayload<CustomValue>): Awaited<GetAllPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract getMany<CustomValue = Value>(payload: GetManyPayload<CustomValue>): Awaited<GetManyPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract has(payload: HasPayload): Awaited<HasPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract inc(payload: IncPayload): Awaited<IncPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract keys(payload: KeysPayload): Awaited<KeysPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract mapByPath<CustomValue = Value>(payload: MapByPathPayload<CustomValue>): Awaited<MapByPathPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract mapByHook<CustomValue = Value>(payload: MapByHookPayload<CustomValue>): Awaited<MapByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract push<CustomValue = Value>(payload: PushPayload, value: CustomValue): Awaited<PushPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract random<CustomValue = Value>(payload: RandomPayload<CustomValue>): Awaited<RandomPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract randomKey(payload: RandomKeyPayload): Awaited<RandomKeyPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract removeByData<CustomValue = Value>(payload: RemoveByDataPayload<CustomValue>): Awaited<RemoveByDataPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract removeByHook<CustomValue = Value>(payload: RemoveByHookPayload<CustomValue>): Awaited<RemoveByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract set<CustomValue = Value>(payload: SetPayload, value: CustomValue): Awaited<SetPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract setMany<CustomValue = Value>(payload: SetManyPayload, value: CustomValue): Awaited<SetManyPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract size(payload: SizePayload): Awaited<SizePayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract someByData<CustomValue = Value>(payload: SomeByDataPayload<CustomValue>): Awaited<SomeByDataPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract someByHook<CustomValue = Value>(payload: SomeByHookPayload<CustomValue>): Awaited<SomeByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract updateByData<CustomValue = Value>(payload: UpdateByDataPayload<CustomValue>): Awaited<UpdateByDataPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract updateByHook<CustomValue = Value>(payload: UpdateByHookPayload<CustomValue>): Awaited<UpdateByHookPayload<CustomValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract values<CustomValue = Value>(payload: ValuesPayload<CustomValue>): Awaited<ValuesPayload<CustomValue>>;
}
declare namespace JoshProvider {
    /**
     * The options to extend for {@link JoshProvider}
     * @since 2.0.0
     *
     * @example
     * ```typescript
     * export namespace Provider {
     *   export interface Options extends JoshProvider.Options {
     *     // Provider options...
     *   }
     * }
     * ```
     */
    interface Options {
    }
    /**
     * The context sent by the {@link Josh} instance.
     * @since 2.0.0
     */
    interface Context<Value = unknown> {
        /**
         * The name of this context.
         * @since 2.0.0
         */
        name: string;
        /**
         * The instance of this context.
         * @since 2.0.0
         */
        instance?: Josh<Value>;
        /**
         * The error of this context.
         * @since 2.0.0
         */
        error?: JoshProviderError;
    }
}

/**
 * A provider that uses the Node.js native [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class.
 * @since 2.0.0
 */
declare class MapProvider<Value = unknown> extends JoshProvider<Value> {
    /**
     * The [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) cache to store data.
     * @since 2.0.0
     * @private
     */
    private cache;
    /**
     * A simple cache for the {@link MapProvider.autoKey} method.
     * @since 2.0.0
     */
    private autoKeyCount;
    autoKey(payload: AutoKeyPayload): AutoKeyPayload;
    dec(payload: DecPayload): DecPayload;
    delete(payload: DeletePayload): DeletePayload;
    ensure<CustomValue = Value>(payload: EnsurePayload<CustomValue>): EnsurePayload<CustomValue>;
    everyByData<CustomValue = Value>(payload: EveryByDataPayload<CustomValue>): EveryByDataPayload<CustomValue>;
    everyByHook<CustomValue = Value>(payload: EveryByHookPayload<CustomValue>): Promise<EveryByHookPayload<CustomValue>>;
    filterByData<CustomValue = Value>(payload: FilterByDataPayload<CustomValue>): FilterByDataPayload<CustomValue>;
    filterByHook<CustomValue = Value>(payload: FilterByHookPayload<CustomValue>): Promise<FilterByHookPayload<CustomValue>>;
    findByData<CustomValue = Value>(payload: FindByDataPayload<CustomValue>): FindByDataPayload<CustomValue>;
    findByHook<CustomValue = Value>(payload: FindByHookPayload<CustomValue>): Promise<FindByHookPayload<CustomValue>>;
    get<CustomValue = Value>(payload: GetPayload<CustomValue>): GetPayload<CustomValue>;
    getAll<CustomValue = Value>(payload: GetAllPayload<CustomValue>): GetAllPayload<CustomValue>;
    getMany<CustomValue = Value>(payload: GetManyPayload<CustomValue>): GetManyPayload<CustomValue>;
    has(payload: HasPayload): HasPayload;
    inc(payload: IncPayload): IncPayload;
    keys(payload: KeysPayload): KeysPayload;
    mapByPath<CustomValue = Value>(payload: MapByPathPayload<CustomValue>): MapByPathPayload<CustomValue>;
    mapByHook<CustomValue = Value>(payload: MapByHookPayload<CustomValue>): Promise<MapByHookPayload<CustomValue>>;
    push<CustomValue = Value>(payload: PushPayload, value: CustomValue): PushPayload;
    random<CustomValue = Value>(payload: RandomPayload<CustomValue>): RandomPayload<CustomValue>;
    randomKey(payload: RandomKeyPayload): RandomKeyPayload;
    removeByData<CustomValue = Value>(payload: RemoveByDataPayload<CustomValue>): RemoveByDataPayload<CustomValue>;
    removeByHook<CustomValue = Value>(payload: RemoveByHookPayload<CustomValue>): Promise<RemoveByHookPayload<CustomValue>>;
    set<CustomValue = Value>(payload: SetPayload, value: CustomValue): SetPayload;
    setMany<CustomValue = Value>(payload: SetManyPayload, value: CustomValue): SetManyPayload;
    size(payload: SizePayload): SizePayload;
    someByData<CustomValue = Value>(payload: SomeByDataPayload<CustomValue>): SomeByDataPayload<CustomValue>;
    someByHook<CustomValue = Value>(payload: SomeByHookPayload<CustomValue>): Promise<SomeByHookPayload<CustomValue>>;
    updateByData<CustomValue = Value>(payload: UpdateByDataPayload<CustomValue>): UpdateByDataPayload<CustomValue>;
    updateByHook<CustomValue = Value>(payload: UpdateByHookPayload<CustomValue>): Promise<UpdateByHookPayload<CustomValue>>;
    values<CustomValue = Value>(payload: ValuesPayload<CustomValue>): ValuesPayload<CustomValue>;
}
declare namespace MapProvider {
    enum Identifiers {
        DecInvalidType = "decInvalidType",
        DecMissingData = "decMissingData",
        DeleteMissingData = "deleteMissingData",
        IncInvalidType = "incInvalidType",
        IncMissingData = "incMissingData",
        PushInvalidType = "pushInvalidType",
        PushMissingData = "pushMissingData",
        RemoveInvalidType = "removeInvalidType",
        RemoveMissingData = "removeMissingData",
        SetMissingData = "setMissingData"
    }
}

/**
 * The error class for the MapProvider.
 * @since 2.0.0
 */
declare class MapProviderError extends JoshProviderError {
    /**
     * The name for this error.
     */
    get name(): string;
}

/**
 * Checks whether the given payload is a {@link FilterByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isFilterByDataPayload<Value = unknown>(payload: FilterPayload<Value>): payload is FilterByDataPayload<Value>;
/**
 * Checks whether the given payload is a {@link FilterByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isFilterByHookPayload<Value = unknown>(payload: FilterPayload<Value>): payload is FilterByHookPayload<Value>;

/**
 * Checks whether the given payload is a {@link FindByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isFindByDataPayload<Value = unknown>(payload: FindPayload<Value>): payload is FindByDataPayload<Value>;
/**
 * Checks whether the given payload is a {@link FindByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isFindByHookPayload<Value = unknown>(payload: FindPayload<Value>): payload is FindByHookPayload<Value>;

/**
 * Checks whether the given payload is a {@link SomeByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isSomeByDataPayload<Value = unknown>(payload: SomePayload<Value>): payload is SomeByDataPayload<Value>;
/**
 * Checks whether the given payload is a {@link SomeByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isSomeByHookPayload<Value = unknown>(payload: SomePayload<Value>): payload is SomeByHookPayload<Value>;

/**
 * Checks whether the given payload is a {@link UpdateByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isUpdateByDataPayload<Value = unknown>(payload: UpdatePayload<Value>): payload is UpdateByDataPayload<Value>;
/**
 * Checks whether the given payload is a {@link UpdateByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
declare function isUpdateByHookPayload<Value = unknown>(payload: UpdatePayload<Value>): payload is UpdateByHookPayload<Value>;

declare const version = "[VI]{version}[/VI]";

export { ApplyOptions, AutoKeyPayload, BuiltInMiddleware, Bulk, DecPayload, DeletePayload, EnsurePayload, EveryByDataPayload, EveryByHookPayload, EveryHook, EveryPayload, FilterByDataPayload, FilterByHookPayload, FilterHook, FilterPayload, FindByDataPayload, FindByHookPayload, FindHook, FindPayload, GetAllPayload, GetManyPayload, GetPayload, HasPayload, IncPayload, Josh, JoshError, JoshProvider, JoshProviderError, KeyPath, KeyPathArray, KeysPayload, MapByHookPayload, MapByPathPayload, MapHook, MapPayload, MapProvider, MapProviderError, Method, Middleware, MiddlewareContextData, MiddlewareStore, MiddlewareStoreOptions, Payload, PushPayload, RandomKeyPayload, RandomPayload, RemoveByDataPayload, RemoveByHookPayload, RemoveHook, RemovePayload, ReturnBulk, SetManyPayload, SetPayload, SizePayload, SomeByDataPayload, SomeByHookPayload, SomeHook, SomePayload, Trigger, UpdateByDataPayload, UpdateByHookPayload, UpdateHook, UpdatePayload, ValuesPayload, isFilterByDataPayload, isFilterByHookPayload, isFindByDataPayload, isFindByHookPayload, isSomeByDataPayload, isSomeByHookPayload, isUpdateByDataPayload, isUpdateByHookPayload, version };
