import * as _sapphire_pieces from '@sapphire/pieces';
import { PieceOptions, Store, Piece, PieceContext } from '@sapphire/pieces';
import { Primitive, Awaited } from '@sapphire/utilities';

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

declare type StringArray = string[];

declare type KeyPathArray = [string, StringArray | undefined];
declare type KeyPath = string | KeyPathArray;

declare enum MathOperator {
    Addition = "addition",
    Subtraction = "subtraction",
    Multiplication = "multiplication",
    Division = "division",
    Remainder = "remainder",
    Exponent = "exponent"
}

declare enum Method {
    AutoKey = "autoKey",
    Clear = "clear",
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
    Keys = "keys",
    Map = "map",
    Math = "math",
    Partition = "partition",
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
     * The method this payload is for.
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
        path: StringArray;
    }
    /**
     * The data extension for {@link Payload}.
     * @since 2.0.0
     */
    interface Data<DataValue> {
        /**
         * The data for this extension.
         * @since 2.0.0
         */
        data: DataValue;
    }
    /**
     * The optional data extension for {@link Payload}.
     * @see {@link Data}
     * @since 2.0.0
     */
    type OptionalData<DataValue> = Partial<Data<DataValue>>;
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
     * The byValue extension for {@link Payload}.
     * @since 2.0.0
     */
    interface ByValue {
        /**
         * The type for this extension.
         * @since 2.0.0
         */
        type: Type.Value;
    }
    /**
     * The type enum for {@link Payload}.
     * @see {@link ByHook}
     * @see {@link ByPath}
     * @see {@link ByValue}
     * @since 2.0.0
     */
    enum Type {
        /**
         * The hook type.
         * @since 2.0.0
         */
        Hook = "HOOK",
        /**
         * The path type.
         * @since 2.0.0
         */
        Path = "PATH",
        /**
         * The value type.
         * @since 2.0.0
         */
        Value = "VALUE"
    }
}

/**
 * The payload for {@link Method.AutoKey}
 * @since 2.0.0
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface AutoKeyPayload extends Payload, Payload.Data<string> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.AutoKey;
}

/**
 * The payload for {@link Method.Clear}
 * @since 2.0.0
 * @see {@link Payload}
 * @since 2.0.0
 */
interface ClearPayload extends Payload {
    /**
     * The method.this payload is for.
     * @since 2.0.0
     */
    method: Method.Clear;
}

/**
 * The payload for {@link Method.Dec}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface DecPayload extends Payload, Payload.KeyPath {
    /**
     * The method this payload is for.
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
     * The method this payload is for.
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
interface EnsurePayload<StoredValue> extends Payload, Payload.Data<StoredValue> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Ensure;
    /**
     * The key to get or set.
     * @since 2.0.0
     */
    key: string;
    /**
     * The default value to store if {@link EnsurePayload.key} doesn't exist.
     * @since 2.0.0
     */
    defaultValue: StoredValue;
}

/**
 * The union payload for {@link Method.Every}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EveryPayload<HookValue> extends Payload, Payload.Data<boolean> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Every;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Value;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook?: EveryHook<HookValue>;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value?: Primitive;
    /**
     * A path to the value for equality check.
     * @since 2.0.0
     */
    path?: StringArray;
}
/**
 * The hook payload for {@link Method.Every}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EveryByHookPayload<HookValue> extends Payload, Payload.ByHook, Payload.Data<boolean> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Every;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook: EveryHook<HookValue>;
}
/**
 * The value payload for {@link Method.Every}
 * @see {@link Payload}
 * @see {@link Payload.ByValue}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface EveryByValuePayload extends Payload, Payload.ByValue, Payload.Data<boolean> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Every;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value: Primitive;
    /**
     * A path to the value for equality check.
     * @since 2.0.0
     */
    path: StringArray;
}
/**
 * The hook for {@link EveryByHookPayload}
 * @since 2.0.0
 */
declare type EveryHook<Value> = (value: Value) => Awaited<boolean>;

/**
 * The union payload for {@link Method.Filter}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface FilterPayload<DataValue> extends Payload, Payload.Data<Record<string, DataValue>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Filter;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Value;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook?: FilterHook<DataValue>;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value?: Primitive;
    /**
     * A path to the value for equality check.
     * @since 2.0.0
     */
    path?: StringArray;
}
/**
 * The hook payload for {@link Method.Filter}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface FilterByHookPayload<DataValue> extends Payload, Payload.ByHook, Payload.Data<Record<string, DataValue>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Filter;
    /**
     * The hook for this payload.
     * @since 2.0.0
     */
    hook: FilterHook<DataValue>;
}
/**
 * The value payload for {@link Method.Filter}
 * @see {@link Payload}
 * @see {@link Payload.ByValue}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface FilterByValuePayload<DataValue> extends Payload, Payload.ByValue, Payload.Data<Record<string, DataValue>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Filter;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value: Primitive;
    /**
     * A path to the value for equality check.
     * @since 2.0.0
     */
    path: StringArray;
}
/**
 * The hook for {@link FilterByHookPayload}
 * @since 2.0.0
 */
declare type FilterHook<HookValue> = (value: HookValue) => Awaited<boolean>;

/**
 * The union payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface FindPayload<DataValue> extends Payload, Payload.OptionalData<DataValue> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Find;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Value;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook?: FindHook<DataValue>;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value?: Primitive;
    /**
     * A path to the value to check equality.
     * @since 2.0.0
     */
    path?: StringArray;
}
/**
 * The hook payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface FindByHookPayload<DataValue> extends Payload, Payload.ByHook, Payload.OptionalData<DataValue> {
    /**
     * The method for this payload
     * @since 2.0.0
     */
    method: Method.Find;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook: FindHook<DataValue>;
}
/**
 * The value payload for {@link Method.Find}
 * @see {@link Payload}
 * @see {@link Payload.ByValue}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface FindByValuePayload<DataValue> extends Payload, Payload.ByValue, Payload.OptionalData<DataValue> {
    /**
     * The method for this payload
     * @since 2.0.0
     */
    method: Method.Find;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value: Primitive;
    /**
     * A path to the value for equality.
     * @since 2.0.0
     */
    path: StringArray;
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
interface GetPayload<DataValue> extends Payload, Payload.KeyPath, Payload.OptionalData<DataValue> {
    /**
     * The method this payload is for.
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
interface GetAllPayload<DataValue> extends Payload, Payload.Data<Record<string, DataValue>> {
    /**
     * The method this payload is for.
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
interface GetManyPayload<DataValue> extends Payload, Payload.Data<Record<string, DataValue | null>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.GetMany;
    /**
     * The keys to get.
     * @since 2.0.0
     */
    keys: StringArray;
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
     * The method this payload is for.
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
interface IncPayload extends Payload, Payload.KeyPath {
    /**
     * The method this payload is for.
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
interface KeysPayload extends Payload, Payload.Data<StringArray> {
    /**
     * The method this payload is for.
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
interface MapPayload<DataValue, HookValue = DataValue> extends Payload, Payload.Data<DataValue[]> {
    /**
     * The method this payload is for.
     *  @since 2.0.0
     */
    method: Method.Map;
    /**
     *  The type for this payload.
     *  @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Path;
    /**
     * The hook to map by.
     *  @since 2.0.0
     */
    hook?: MapHook<DataValue, HookValue>;
    /**
     * The path to map by.
     *  @since 2.0.0
     */
    path?: StringArray;
}
/**
 * The hook payload for {@link Method.Map}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface MapByHookPayload<DataValue, HookValue = DataValue> extends Payload, Payload.ByHook, Payload.Data<DataValue[]> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Map;
    /**
     * The hook to map by.
     * @since 2.0.0
     */
    hook: MapHook<DataValue, HookValue>;
}
/**
 *  The path payload for {@link Method.Map}
 *  @see {@link Payload}
 *  @see {@link Payload.ByPath}
 *  @see {@link Payload.Data}
 *  @since 2.0.0
 */
interface MapByPathPayload<DataValue> extends Payload, Payload.ByPath, Payload.Data<DataValue[]> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Map;
    /**
     *  The path to map by.
     * @since 2.0.0
     */
    path: StringArray;
}
/**
 * The hook for {@link MapByHookPayload}
 * @since 2.0.0
 */
declare type MapHook<Value, HookValue = Value> = (data: HookValue) => Awaited<Value>;

/**
 * The payload for {@link Method.Math}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface MathPayload extends Payload, Payload.KeyPath {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Math;
    /**
     * The operator to apply to the operands.
     * @since 2.0.0
     */
    operator: MathOperator;
    /**
     * The operand to apply to the operator.
     * @since 2.0.0
     */
    operand: number;
}

/**
 * The union payload for {@link Method.Partition}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface PartitionPayload<DataValue> extends Payload, Payload.Data<PartitionData<DataValue>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Partition;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Value;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook?: PartitionHook<DataValue>;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value?: Primitive;
    /**
     * A path to the value for equality check.
     * @since 2.0.0
     */
    path?: StringArray;
}
/**
 * The hook payload for {@link Method.Partition}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface PartitionByHookPayload<DataValue> extends Payload, Payload.ByHook, Payload.Data<PartitionData<DataValue>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Partition;
    /**
     * The hook for this payload
     * @since 2.0.0
     */
    hook: PartitionHook<DataValue>;
}
/**
 * The value payload for {@link Method.Partition}
 * @see {@link Payload}
 * @see {@link Payload.ByValue}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface PartitionByValuePayload<DataValue> extends Payload, Payload.ByValue, Payload.Data<PartitionData<DataValue>> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Partition;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value: Primitive;
    /**
     * A path to the value for equality check.
     * @since 2.0.0
     */
    path: StringArray;
}
/**
 * The data for {@link PartitionPayload}
 * @since 2.0.0
 */
interface PartitionData<DataValue> {
    truthy: Record<string, DataValue>;
    falsy: Record<string, DataValue>;
}
/**
 * The hook for {@link PartitionByHookPayload}
 * @since 2.0.0
 */
declare type PartitionHook<HookValue> = (value: HookValue) => Awaited<boolean>;

/**
 * The payload for {@link Method.Push}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface PushPayload<Value> extends Payload, Payload.KeyPath {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Push;
    /**
     * The value to push to an array.
     * @since 2.0.0
     */
    value: Value;
}

/**
 * The payload for {@link Method.Random}
 * @see {@link Payload}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface RandomPayload<DataValue> extends Payload, Payload.OptionalData<DataValue> {
    /**
     * The method this payload is for.
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
     * The method this payload is for.
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
interface RemovePayload<HookValue> extends Payload, Payload.KeyPath {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Remove;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Value;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook?: RemoveHook<HookValue>;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value?: Primitive;
}
/**
 * The hook payload for {@link Method.Remove}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.KeyPath}
 */
interface RemoveByHookPayload<HookValue> extends Payload, Payload.ByHook, Payload.KeyPath {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Remove;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook: RemoveHook<HookValue>;
}
/**
 * The data payload for {@link Method.Remove}
 * @see {@link Payload}
 * @see {@link Payload.ByValue}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface RemoveByValuePayload extends Payload, Payload.ByValue, Payload.KeyPath {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Remove;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Value;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value: Primitive;
}
/**
 * The hook for {@link RemoveByHookPayload}
 * @since 2.0.0
 */
declare type RemoveHook<Value> = (value: Value) => Awaited<boolean>;

/**
 * The payload for {@link Method.Set}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @since 2.0.0
 */
interface SetPayload<Value> extends Payload, Payload.KeyPath {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Set;
    /**
     * The value to set.
     * @since 2.0.0
     */
    value: Value;
}

/**
 * The payload for {@link Method.SetMany}
 * @see {@link Payload}
 * @since 2.0.0
 */
interface SetManyPayload<Value> extends Payload {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.SetMany;
    /**
     * The keys to set.
     * @since 2.0.0
     */
    keys: StringArray;
    /**
     * The value to set at each key.
     * @since 2.0.0
     */
    value: Value;
}

/**
 * The payload for {@link Method.Size}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SizePayload extends Payload, Payload.Data<number> {
    /**
     * The method this payload is for.
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
interface SomePayload<HookValue> extends Payload, Payload.Data<boolean> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Some;
    /**
     * The type for this payload.
     * @since 2.0.0
     */
    type: Payload.Type.Hook | Payload.Type.Value;
    /**
     * The hook to check equality.
     * @since 2.0.0
     */
    hook?: SomeHook<HookValue>;
    /**
     * The value to check equality.
     * @since 2.0.0
     */
    value?: Primitive;
    /**
     * A path to the value to check equality.
     * @since 2.0.0
     */
    path?: StringArray;
}
/**
 * The hook payload for {@link Method.Some}
 * @see {@link Payload}
 * @see {@link Payload.ByHook}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SomeByHookPayload<HookValue> extends Payload, Payload.ByHook, Payload.Data<boolean> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Some;
    /**
     * The input hook for this payload.
     * @since 2.0.0
     */
    hook: SomeHook<HookValue>;
}
/**
 * The data payload for {@link Method.Some}
 * @see {@link Payload}
 * @see {@link Payload.ByValue}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface SomeByValuePayload extends Payload, Payload.ByValue, Payload.Data<boolean> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Some;
    /**
     * The input data for this payload.
     * @since 2.0.0
     */
    value: Primitive;
    /**
     * A path to the value to check equality.
     * @since 2.0.0
     */
    path: StringArray;
}
/**
 * The hook for {@link SomeByHookPayload}
 * @since 2.0.0
 */
declare type SomeHook<Value> = (value: Value) => Awaited<boolean>;

/**
 * The union payload for {@link Method.Update}
 * @see {@link Payload}
 * @see {@link Payload.KeyPath}
 * @see {@link Payload.OptionalData}
 * @since 2.0.0
 */
interface UpdatePayload<DataValue, HookValue = DataValue, Value = DataValue> extends Payload, Payload.KeyPath, Payload.OptionalData<DataValue> {
    /**
     * The method this payload is for.
     * @since 2.0.0
     */
    method: Method.Update;
    /**
     * The hook to update stored value.
     * @since 2.0.0
     */
    hook: UpdateHook<HookValue, Value>;
}
/**
 * The hook for {@link UpdateByHookPayload}
 * @since 2.0.0
 */
declare type UpdateHook<HookValue, Value> = (value: HookValue) => Awaited<Value>;

/**
 * The payload for {@link Method.Values}
 * @see {@link Payload}
 * @see {@link Payload.Data}
 * @since 2.0.0
 */
interface ValuesPayload<DataValue> extends Payload, Payload.Data<DataValue[]> {
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
declare class MiddlewareStore<StoredValue = unknown> extends Store<Middleware> {
    /**
     * The {@link Josh} instance for this store.
     */
    instance: Josh<StoredValue>;
    constructor(options: MiddlewareStoreOptions<StoredValue>);
    array(): Middleware[];
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
interface MiddlewareStoreOptions<StoredValue = unknown> {
    /**
     * The {@link Josh} instance for this store.
     * @since 2.0.0
     */
    instance: Josh<StoredValue>;
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
declare class Middleware<Context extends Middleware.Context = Middleware.Context> extends Piece {
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
    [Method.Clear](payload: ClearPayload): Awaited<ClearPayload>;
    [Method.Dec](payload: DecPayload): Awaited<DecPayload>;
    [Method.Delete](payload: DeletePayload): Awaited<DeletePayload>;
    [Method.Ensure]<StoredValue>(payload: EnsurePayload<StoredValue>): Awaited<EnsurePayload<StoredValue>>;
    [Method.Every]<HookValue>(payload: EveryByHookPayload<HookValue>): Awaited<EveryByHookPayload<HookValue>>;
    [Method.Every](payload: EveryByValuePayload): Awaited<EveryByValuePayload>;
    [Method.Every]<HookValue>(payload: EveryPayload<HookValue>): Awaited<EveryPayload<HookValue>>;
    [Method.Filter]<StoredValue>(payload: FilterByHookPayload<StoredValue>): Awaited<FilterByHookPayload<StoredValue>>;
    [Method.Filter]<StoredValue>(payload: FilterByValuePayload<StoredValue>): Awaited<FilterByValuePayload<StoredValue>>;
    [Method.Filter]<StoredValue>(payload: FilterPayload<StoredValue>): Awaited<FilterPayload<StoredValue>>;
    [Method.Find]<StoredValue>(payload: FindByHookPayload<StoredValue>): Awaited<FindByHookPayload<StoredValue>>;
    [Method.Find]<StoredValue>(payload: FindByValuePayload<StoredValue>): Awaited<FindByValuePayload<StoredValue>>;
    [Method.Find]<StoredValue>(payload: FindPayload<StoredValue>): Awaited<FindPayload<StoredValue>>;
    [Method.Get]<DataValue>(payload: GetPayload<DataValue>): Awaited<GetPayload<DataValue>>;
    [Method.GetAll]<DataValue>(payload: GetAllPayload<DataValue>): Awaited<GetAllPayload<DataValue>>;
    [Method.GetMany]<DataValue>(payload: GetManyPayload<DataValue>): Awaited<GetManyPayload<DataValue>>;
    [Method.Has](payload: HasPayload): Awaited<HasPayload>;
    [Method.Inc](payload: IncPayload): Awaited<IncPayload>;
    [Method.Keys](payload: KeysPayload): Awaited<KeysPayload>;
    [Method.Map]<Value, HookValue>(payload: MapByHookPayload<Value, HookValue>): Awaited<MapByHookPayload<Value, HookValue>>;
    [Method.Map]<Value>(payload: MapByPathPayload<Value>): Awaited<MapByPathPayload<Value>>;
    [Method.Map]<Value, HookValue>(payload: MapPayload<Value, HookValue>): Awaited<MapPayload<Value, HookValue>>;
    [Method.Math](payload: MathPayload): Awaited<MathPayload>;
    [Method.Partition]<StoredValue>(payload: PartitionByHookPayload<StoredValue>): Awaited<PartitionByHookPayload<StoredValue>>;
    [Method.Partition]<StoredValue>(payload: PartitionByValuePayload<StoredValue>): Awaited<PartitionByValuePayload<StoredValue>>;
    [Method.Partition]<StoredValue>(payload: PartitionPayload<StoredValue>): Awaited<PartitionPayload<StoredValue>>;
    [Method.Push]<Value>(payload: PushPayload<Value>): Awaited<PushPayload<Value>>;
    [Method.Random]<StoredValue>(payload: RandomPayload<StoredValue>): Awaited<RandomPayload<StoredValue>>;
    [Method.RandomKey](payload: RandomKeyPayload): Awaited<RandomKeyPayload>;
    [Method.Remove]<HookValue>(payload: RemoveByHookPayload<HookValue>): Awaited<RemoveByHookPayload<HookValue>>;
    [Method.Remove](payload: RemoveByValuePayload): Awaited<RemoveByValuePayload>;
    [Method.Remove]<HookValue>(payload: RemovePayload<HookValue>): Awaited<RemovePayload<HookValue>>;
    [Method.Set]<Value>(payload: SetPayload<Value>): Awaited<SetPayload<Value>>;
    [Method.SetMany]<StoredValue>(payload: SetManyPayload<StoredValue>): Awaited<SetManyPayload<StoredValue>>;
    [Method.Size](payload: SizePayload): Awaited<SizePayload>;
    [Method.Some]<HookValue>(payload: SomeByHookPayload<HookValue>): Awaited<SomeByHookPayload<HookValue>>;
    [Method.Some]<Value>(payload: SomeByValuePayload): Awaited<SomeByValuePayload>;
    [Method.Some]<HookValue>(payload: SomePayload<HookValue>): Awaited<SomePayload<HookValue>>;
    [Method.Update]<StoredValue, Value, HookValue>(payload: UpdatePayload<StoredValue, Value, HookValue>): Awaited<UpdatePayload<StoredValue, Value, HookValue>>;
    [Method.Values]<StoredValue>(payload: ValuesPayload<StoredValue>): Awaited<ValuesPayload<StoredValue>>;
    run<P extends Payload>(payload: P): Awaited<unknown>;
    toJSON(): {
        position: number | undefined;
        conditions: Middleware.Condition[];
        use: boolean;
        location: _sapphire_pieces.PieceLocationJSON;
        name: string;
        enabled: boolean;
    };
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
declare class Josh<StoredValue = unknown> {
    /**
     * This Josh's name. Used for middleware and/or provider information.
     * @since 2.0.0
     */
    name: string;
    /**
     * This Josh's options. Used throughout the instance.
     * @since 2.0.0
     */
    options: Josh.Options<StoredValue>;
    /**
     * The middleware store.
     *
     * NOTE: Do not use this unless you know what your doing.
     * @since 2.0.0
     */
    middlewares: MiddlewareStore<StoredValue>;
    /**
     * This Josh's provider instance.
     *
     * NOTE: Do not use this unless you know what your doing.
     */
    provider: JoshProvider<StoredValue>;
    constructor(options: Josh.Options<StoredValue>);
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
    clear(): Promise<this>;
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
    ensure(key: string, defaultValue: StoredValue): Promise<StoredValue>;
    every(path: StringArray, value: Primitive): Promise<boolean>;
    every(hook: EveryHook<StoredValue>): Promise<boolean>;
    /**
     * Filter stored values using a path and value.
     * @since 2.0.0
     * @param path A path to the value for equality check.
     * @param value The value to check equality.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.filter(['path'], 'value'); // { key: { path: 'value' } }
     * // Using a return bulk type.
     * await josh.filter(['path'], 'value', Bulk.OneDimensionalArray); // [{ path: 'value' }]
     * ```
     */
    filter<BulkType extends keyof ReturnBulk<StoredValue>>(path: StringArray, value: Primitive, returnBulkType?: BulkType): Promise<ReturnBulk<StoredValue>[BulkType]>;
    /**
     * Filter stored data using a hook function.
     * @since 2.0.0
     * @param hook The hook function to check equality.
     * @param _value Unused.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.filter((value) => value === 'value'); // { key: { path: 'value' } }
     * // Using a return bulk type.
     * await josh.filter((value) => value === 'value', undefined, Bulk.TwoDimensionalArray); // [['key', 'value']]
     * ```
     */
    filter<BulkType extends keyof ReturnBulk<StoredValue>>(hook: FilterHook<StoredValue>, _value: undefined, returnBulkType?: BulkType): Promise<ReturnBulk<StoredValue>[BulkType]>;
    /**
     * Find a stored value using a path and value.
     * @since 2.0.0
     * @param path A path to the value for equality check.
     * @param value The value to check equality.
     * @returns The found value or null.
     */
    find(path: StringArray, value: Primitive): Promise<StoredValue | null>;
    /**
     * Find a stored value using a hook function.
     * @since 2.0.0
     * @param hook The hook to check equality.
     * @returns The found value or null.
     */
    find(hook: FindHook<StoredValue>): Promise<StoredValue | null>;
    /**
     * Get a value using a key.
     * @since 2.0.0
     * @param key A key at which a value is.
     * @returns The value gotten or null.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.get('key'); // 'value'
     * ```
     */
    get(key: string): Promise<StoredValue | null>;
    /**
     * Get a value using a key and/or path.
     * @since 2.0.0
     * @param keyPath A key and/or path at which a value is.
     * @returns The value gotten or null.
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.get(['key', ['path']]); // 'value'
     * ```
     */
    get<Value = StoredValue>(keyPath: KeyPathArray): Promise<Value | null>;
    /**
     * Get all stored values.
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
    getAll<BulkType extends keyof ReturnBulk<StoredValue> = Bulk.Object>(returnBulkType?: BulkType): Promise<ReturnBulk<StoredValue>[BulkType]>;
    /**
     * Get stored values at multiple keys.
     * @since 2.0.0
     * @param keys An array of keys to get values from.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns The bulk data.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await this.getMany(['key']); // { key: 'value' }
     * // Using a return bulk type.
     * await this.getMany(['key'], Bulk.OneDimensionalArray); // ['value']
     * ```
     */
    getMany<BulkType extends keyof ReturnBulk<StoredValue | null>>(keys: StringArray, returnBulkType?: BulkType): Promise<ReturnBulk<StoredValue | null>[BulkType]>;
    /**
     * Check if a key and/or path exists.
     * @since 2.0.0
     * @param keyPath A key and/or path to the value to check for.
     * @returns Validation boolean.
     *
     * @example
     * ```typescript
     * await josh.has('key'); // false
     *
     * await josh.set('key', 'value');
     *
     * await josh.has('key'); // true
     * ```
     */
    has(keyPath: KeyPath): Promise<boolean>;
    /**
     * Increment an integer by `1`.
     * @since 2.0.0
     * @param keyPath The key and/or path to an integer value for incrementing.
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
     * Returns all stored value keys.
     * @since 2.0.0
     * @returns The array of stored value keys.
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
     * Map stored values by path or hook function.
     * @since 2.0.0
     * @param pathOrHook The path or hook to map by.
     * @returns The mapped values.
     *
     * @example
     * ```typescript
     * await josh.set('key', { path: 'value' });
     *
     * await josh.map(['path']); // ['value']
     * ```
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.map((value) => value.toUpperCase()); // ['VALUE']
     * ```
     */
    map<Value = StoredValue>(pathOrHook: StringArray | MapHook<Value, StoredValue>): Promise<Value[]>;
    math(keyPath: KeyPath, operator: MathOperator, operand: number): Promise<this>;
    /**
     * Filter stored values and get both truthy and falsy results.
     * @since 2.0.0
     * @param hook The hook function to check equality.
     * @param _value Unused.
     * @param returnBulkType The return bulk type, Defaults to {@link Bulk.Object}
     * @returns A partition of filtered bulk data. First bulk data is the truthy filter and the second bulk data is the falsy filter.
     */
    partition<BulkType extends keyof ReturnBulk<StoredValue>>(hook: PartitionHook<StoredValue>, _value: undefined, returnBulkType: BulkType): Promise<[ReturnBulk<StoredValue>[BulkType], ReturnBulk<StoredValue>[BulkType]]>;
    /**
     * Filter stored values and get both truthy and falsy results.
     * @since 2.0.0
     * @param path A path to the value for equality check.
     * @param value The value to check equality.
     * @param returnBulkType The return bulk type. Defaults to {@link Bulk.Object}
     * @returns A partition of filtered bulk data. First bulk data is the truthy filter and the second bulk data is the falsy filter.
     */
    partition<BulkType extends keyof ReturnBulk<StoredValue>>(path: StringArray, value: Primitive, returnBulkType: BulkType): Promise<[ReturnBulk<StoredValue>[BulkType], ReturnBulk<StoredValue>[BulkType]]>;
    /**
     * Push a value to an array.
     * @since 2.0.0
     * @param keyPath A key and/or path to the array.
     * @param value The value to push.
     * @returns The {@link Josh} instance.
     *
     * @example
     * ```typescript
     * await josh.set('key', []);
     *
     * await josh.push('key', 'value');
     *
     * await josh.get('key'); // ['value']
     * ```
     */
    push<Value = StoredValue>(keyPath: KeyPath, value: Value): Promise<this>;
    /**
     * Get a random value.
     * @since 2.0.0
     * @returns The random data or `null`.
     */
    random(): Promise<StoredValue | null>;
    /**
     * Get a random key.
     * @since 2.0.0
     * @returns The random key or `null`.
     */
    randomKey(): Promise<string | null>;
    remove(keyPath: KeyPath, value: Primitive): Promise<this>;
    remove<Value = StoredValue>(keyPath: KeyPath, hook: RemoveHook<Value>): Promise<this>;
    set(key: string, value: StoredValue): Promise<this>;
    set<Value = StoredValue>(keyPath: KeyPathArray, value: Value): Promise<this>;
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
    setMany(keys: StringArray, value: StoredValue): Promise<this>;
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
     * Verify if a path's value matches a value.
     * @since 2.0.0
     * @param path A path to the value for equality check.
     * @param value The value to check equality.
     */
    some(path: StringArray, value: Primitive): Promise<boolean>;
    /**
     * Verify if a stored value matches with a hook function,
     * @since 2.0.0
     * @param hook The hook to check equality.
     */
    some(hook: SomeHook<StoredValue>): Promise<boolean>;
    /**
     * Update a stored value using a hook function.
     * @param keyPath The key and/or path to the stored value for updating.
     * @param hook The hook to update the stored value.
     * @returns The updated value or null.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     *
     * await josh.update('key', (value) => value.toUpperCase()); // 'VALUE'
     * ```
     */
    update<HookValue = StoredValue, Value = HookValue>(keyPath: KeyPath, hook: UpdateHook<HookValue, Value>): Promise<StoredValue | null>;
    /**
     * Get all stored values.
     * @since 2.0.0
     * @returns An array of stored values.
     *
     * @example
     * ```typescript
     * await josh.set('key', 'value');
     * await josh.set('anotherKey', 'anotherValue');
     *
     * await josh.values(); // ['value', 'anotherValue']
     * ```
     */
    values(): Promise<StoredValue[]>;
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
     * Simple utility function to extract from a key/path.
     * @since 2.0.0
     * @param keyPath The {@link KeyPath} to extract
     * @returns The extract key/path
     */
    private getKeyPath;
    /**
     * Filters pre-provider middlewares by a method.
     * @since 2.0.0
     * @param method The method to filter by.
     * @returns The filtered middlewares.
     */
    private getPreMiddlewares;
    /**
     * Filters post-provider middlewares by a method.
     * @param method The method to filter by.
     * @returns The filtered middlewares.
     */
    private getPostMiddlewares;
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
    interface Options<StoredValue = unknown> {
        /**
         * The name for the Josh instance.
         * @since 2.0.0
         */
        name?: string;
        /**
         * The provider instance.
         * @since 2.0.0
         */
        provider?: JoshProvider<StoredValue>;
        /**
         * The middleware directory.
         * @since 2.0.0
         */
        middlewareDirectory?: string;
        /**
         * The middleware context data.
         * @since 2.0.0
         */
        middlewareContextData?: MiddlewareContextData<StoredValue>;
    }
    enum Identifiers {
        EveryInvalidValue = "everyInvalidValue",
        EveryMissingValue = "everyMissingValue",
        FilterInvalidValue = "filterInvalidValue",
        FilterMissingValue = "filterMissingValue",
        FindInvalidValue = "findInvalidValue",
        FindMissingValue = "findMissingValue",
        InvalidProvider = "invalidProvider",
        MiddlewareNotFound = "middlewareNotFound",
        MissingName = "missingName",
        PartitionInvalidValue = "partitionInvalidValue",
        PartitionMissingValue = "partitionMissingValue",
        RemoveInvalidValue = "removeInvalidValue",
        SomeInvalidValue = "someInvalidValue",
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
declare abstract class JoshProvider<StoredValue = unknown> {
    /**
     * The name for this provider.
     * @since 2.0.0
     */
    name?: string;
    /**
     * The {@link Josh} instance for this provider.
     * @since 2.0.0
     */
    instance?: Josh<StoredValue>;
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
    init(context: JoshProvider.Context<StoredValue>): Promise<JoshProvider.Context<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.AutoKey](payload: AutoKeyPayload): Awaited<AutoKeyPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Clear](payload: ClearPayload): Awaited<ClearPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Dec](payload: DecPayload): Awaited<DecPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Delete](payload: DeletePayload): Awaited<DeletePayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Ensure](payload: EnsurePayload<StoredValue>): Awaited<EnsurePayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Every]<HookValue>(payload: EveryByHookPayload<HookValue>): Awaited<EveryByHookPayload<HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Every]<Value>(payload: EveryByValuePayload): Awaited<EveryByValuePayload>;
    abstract [Method.Every]<HookValue>(payload: EveryPayload<HookValue>): Awaited<EveryPayload<HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Filter](payload: FilterByHookPayload<StoredValue>): Awaited<FilterByHookPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Filter](payload: FilterByValuePayload<StoredValue>): Awaited<FilterByValuePayload<StoredValue>>;
    abstract [Method.Filter](payload: FilterPayload<StoredValue>): Awaited<FilterPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Find](payload: FindByHookPayload<StoredValue>): Awaited<FindByHookPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Find](payload: FindByValuePayload<StoredValue>): Awaited<FindByValuePayload<StoredValue>>;
    abstract [Method.Find](payload: FindPayload<StoredValue>): Awaited<FindPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Get]<DataValue>(payload: GetPayload<DataValue>): Awaited<GetPayload<DataValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.GetAll](payload: GetAllPayload<StoredValue>): Awaited<GetAllPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.GetMany](payload: GetManyPayload<StoredValue>): Awaited<GetManyPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Has](payload: HasPayload): Awaited<HasPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Inc](payload: IncPayload): Awaited<IncPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Keys](payload: KeysPayload): Awaited<KeysPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Map]<Value, HookValue>(payload: MapByHookPayload<Value, HookValue>): Awaited<MapByHookPayload<Value, HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Map]<Value = StoredValue>(payload: MapByPathPayload<Value>): Awaited<MapByPathPayload<Value>>;
    abstract [Method.Map]<Value = StoredValue, HookValue = Value>(payload: MapPayload<Value, HookValue>): Awaited<MapPayload<Value, HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Math](payload: MathPayload): Awaited<MathPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Partition](payload: PartitionByHookPayload<StoredValue>): Awaited<PartitionByHookPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Partition](payload: PartitionByValuePayload<StoredValue>): Awaited<PartitionByValuePayload<StoredValue>>;
    abstract [Method.Partition](payload: PartitionPayload<StoredValue>): Awaited<PartitionPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Push]<Value>(payload: PushPayload<Value>): Awaited<PushPayload<Value>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Random](payload: RandomPayload<StoredValue>): Awaited<RandomPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.RandomKey](payload: RandomKeyPayload): Awaited<RandomKeyPayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Remove]<HookValue>(payload: RemoveByHookPayload<HookValue>): Awaited<RemoveByHookPayload<HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Remove]<Value>(payload: RemoveByValuePayload): Awaited<RemoveByValuePayload>;
    abstract [Method.Remove]<HookValue>(payload: RemovePayload<HookValue>): Awaited<RemovePayload<HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Set]<Value = StoredValue>(payload: SetPayload<Value>): Awaited<SetPayload<Value>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.SetMany](payload: SetManyPayload<StoredValue>): Awaited<SetManyPayload<StoredValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Size](payload: SizePayload): Awaited<SizePayload>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Some]<HookValue>(payload: SomeByHookPayload<HookValue>): Awaited<SomeByHookPayload<HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Some]<Value>(payload: SomeByValuePayload): Awaited<SomeByValuePayload>;
    abstract [Method.Some]<HookValue>(payload: SomePayload<HookValue>): Awaited<SomePayload<HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Update]<Value, HookValue>(payload: UpdatePayload<StoredValue, Value, HookValue>): Awaited<UpdatePayload<StoredValue, Value, HookValue>>;
    /**
     * @since 2.0.0
     * @param payload The payload sent by this provider's {@link Josh} instance.
     * @returns The payload (modified), originally sent by this provider's {@link Josh} instance.
     */
    abstract [Method.Values](payload: ValuesPayload<StoredValue>): Awaited<ValuesPayload<StoredValue>>;
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
declare class MapProvider<StoredValue = unknown> extends JoshProvider<StoredValue> {
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
    [Method.AutoKey](payload: AutoKeyPayload): AutoKeyPayload;
    [Method.Clear](payload: ClearPayload): ClearPayload;
    [Method.Dec](payload: DecPayload): DecPayload;
    [Method.Delete](payload: DeletePayload): DeletePayload;
    [Method.Ensure](payload: EnsurePayload<StoredValue>): EnsurePayload<StoredValue>;
    [Method.Every](payload: EveryByHookPayload<StoredValue>): Promise<EveryByHookPayload<StoredValue>>;
    [Method.Every](payload: EveryByValuePayload): Promise<EveryByValuePayload>;
    [Method.Filter](payload: FilterByHookPayload<StoredValue>): Promise<FilterByHookPayload<StoredValue>>;
    [Method.Filter](payload: FilterByValuePayload<StoredValue>): Promise<FilterByValuePayload<StoredValue>>;
    [Method.Find](payload: FindByHookPayload<StoredValue>): Promise<FindByHookPayload<StoredValue>>;
    [Method.Find](payload: FindByValuePayload<StoredValue>): Promise<FindByValuePayload<StoredValue>>;
    [Method.Get]<Value = StoredValue>(payload: GetPayload<Value>): GetPayload<Value>;
    [Method.GetAll](payload: GetAllPayload<StoredValue>): GetAllPayload<StoredValue>;
    [Method.GetMany](payload: GetManyPayload<StoredValue>): GetManyPayload<StoredValue>;
    [Method.Has](payload: HasPayload): HasPayload;
    [Method.Inc](payload: IncPayload): IncPayload;
    [Method.Keys](payload: KeysPayload): KeysPayload;
    [Method.Map]<DataValue = StoredValue, HookValue = DataValue>(payload: MapByHookPayload<DataValue, HookValue>): Promise<MapByHookPayload<DataValue, HookValue>>;
    [Method.Map]<DataValue = StoredValue>(payload: MapByPathPayload<DataValue>): Promise<MapByPathPayload<DataValue>>;
    [Method.Math](payload: MathPayload): MathPayload;
    [Method.Partition](payload: PartitionByHookPayload<StoredValue>): Promise<PartitionByHookPayload<StoredValue>>;
    [Method.Partition](payload: PartitionByValuePayload<StoredValue>): Promise<PartitionByValuePayload<StoredValue>>;
    [Method.Push]<Value = StoredValue>(payload: PushPayload<Value>): PushPayload<Value>;
    [Method.Random](payload: RandomPayload<StoredValue>): RandomPayload<StoredValue>;
    [Method.RandomKey](payload: RandomKeyPayload): RandomKeyPayload;
    [Method.Remove]<HookValue = StoredValue>(payload: RemoveByHookPayload<HookValue>): Promise<RemoveByHookPayload<HookValue>>;
    [Method.Remove](payload: RemoveByValuePayload): Promise<RemoveByValuePayload>;
    [Method.Set]<Value = StoredValue>(payload: SetPayload<Value>): SetPayload<Value>;
    [Method.SetMany](payload: SetManyPayload<StoredValue>): SetManyPayload<StoredValue>;
    [Method.Size](payload: SizePayload): SizePayload;
    [Method.Some](payload: SomeByHookPayload<StoredValue>): Promise<SomeByHookPayload<StoredValue>>;
    [Method.Some](payload: SomeByValuePayload): Promise<SomeByValuePayload>;
    [Method.Update]<HookValue = StoredValue, Value = HookValue>(payload: UpdatePayload<StoredValue, HookValue, Value>): Promise<UpdatePayload<StoredValue, HookValue, Value>>;
    [Method.Values](payload: ValuesPayload<StoredValue>): ValuesPayload<StoredValue>;
}
declare namespace MapProvider {
    enum Identifiers {
        DecInvalidType = "decInvalidType",
        DecMissingData = "decMissingData",
        FilterInvalidValue = "filterInvalidValue",
        FindInvalidValue = "findInvalidValue",
        IncInvalidType = "incInvalidType",
        IncMissingData = "incMissingData",
        MathInvalidType = "mathInvalidType",
        MathMissingData = "mathMissingData",
        PartitionInvalidValue = "partitionInvalidValue",
        PushInvalidType = "pushInvalidType",
        PushMissingData = "pushMissingData",
        RemoveInvalidType = "removeInvalidType",
        RemoveMissingData = "removeMissingData"
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
 * Validates whether the given payload is {@link EveryByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isEveryByHookPayload<HookValue>(payload: EveryPayload<HookValue>): payload is EveryByHookPayload<HookValue>;
/**
 * Validates whether the given payload is {@link EveryByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isEveryByValuePayload<HookPayload>(payload: EveryPayload<HookPayload>): payload is EveryByValuePayload;

/**
 * Validates whether the given payload is {@link FilterByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isFilterByHookPayload<DataValue>(payload: FilterPayload<DataValue>): payload is FilterByHookPayload<DataValue>;
/**
 * Validates whether the given payload is {@link FilterByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isFilterByValuePayload<DataValue>(payload: FilterPayload<DataValue>): payload is FilterByValuePayload<DataValue>;

/**
 * Validates whether the given payload is {@link FindByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isFindByHookPayload<DataValue>(payload: FindPayload<DataValue>): payload is FindByHookPayload<DataValue>;
/**
 * Validates whether the given payload is {@link FindByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isFindByValuePayload<DataValue>(payload: FindPayload<DataValue>): payload is FindByValuePayload<DataValue>;

/**
 * Validates whether the given payload is {@link MapByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isMapByHookPayload<DataValue, HookValue>(payload: MapPayload<DataValue, HookValue>): payload is MapByHookPayload<DataValue, HookValue>;
/**
 * Validates whether the given payload is {@link MapByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isMapByPathPayload<DataValue, HookValue>(payload: MapPayload<DataValue, HookValue>): payload is MapByPathPayload<DataValue>;

/**
 * Validates whether the given payload is {@link PartitionByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isPartitionByHookPayload<DataValue>(payload: PartitionPayload<DataValue>): payload is PartitionByHookPayload<DataValue>;
/**
 * Validates whether the given payload is {@link PartitionByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isPartitionByValuePayload<DataValue>(payload: PartitionPayload<DataValue>): payload is PartitionByValuePayload<DataValue>;

/**
 * Validates whether the given payload is {@link RemoveByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isRemoveByHookPayload<HookValue>(payload: RemovePayload<HookValue>): payload is RemoveByHookPayload<HookValue>;
/**
 * Validates whether the given payload is {@link RemoveByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isRemoveByValuePayload<HookValue>(payload: RemovePayload<HookValue>): payload is RemoveByValuePayload;

/**
 * Validates whether the given payload is {@link SomeByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isSomeByHookPayload<HookValue>(payload: SomePayload<HookValue>): payload is SomeByHookPayload<HookValue>;
/**
 * Validates whether the given payload is {@link SomeByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
declare function isSomeByValuePayload<HookValue>(payload: SomePayload<HookValue>): payload is SomeByValuePayload;

declare const version = "[VI]{version}[/VI]";

export { ApplyOptions, AutoKeyPayload, BuiltInMiddleware, Bulk, ClearPayload, DecPayload, DeletePayload, EnsurePayload, EveryByHookPayload, EveryByValuePayload, EveryHook, EveryPayload, FilterByHookPayload, FilterByValuePayload, FilterHook, FilterPayload, FindByHookPayload, FindByValuePayload, FindHook, FindPayload, GetAllPayload, GetManyPayload, GetPayload, HasPayload, IncPayload, Josh, JoshError, JoshProvider, JoshProviderError, KeyPath, KeyPathArray, KeysPayload, MapByHookPayload, MapByPathPayload, MapHook, MapPayload, MapProvider, MapProviderError, MathOperator, MathPayload, Method, Middleware, MiddlewareContextData, MiddlewareStore, MiddlewareStoreOptions, PartitionByHookPayload, PartitionByValuePayload, PartitionData, PartitionHook, PartitionPayload, Payload, PushPayload, RandomKeyPayload, RandomPayload, RemoveByHookPayload, RemoveByValuePayload, RemoveHook, RemovePayload, ReturnBulk, SetManyPayload, SetPayload, SizePayload, SomeByHookPayload, SomeByValuePayload, SomeHook, SomePayload, StringArray, Trigger, UpdateHook, UpdatePayload, ValuesPayload, isEveryByHookPayload, isEveryByValuePayload, isFilterByHookPayload, isFilterByValuePayload, isFindByHookPayload, isFindByValuePayload, isMapByHookPayload, isMapByPathPayload, isPartitionByHookPayload, isPartitionByValuePayload, isRemoveByHookPayload, isRemoveByValuePayload, isSomeByHookPayload, isSomeByValuePayload, version };
