import { PieceOptions, Store, Piece, PieceContext } from '@sapphire/pieces';
import { Stopwatch } from '@sapphire/stopwatch';
import { Awaited } from '@sapphire/utilities';

declare function ApplyOptions<T extends PieceOptions>(options: T): ClassDecorator;

declare class JoshError extends Error {
    identifier: string;
    constructor(options: JoshError.Options);
    get name(): string;
}
declare namespace JoshError {
    interface Options {
        identifier: string;
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
    Filter = "filter",
    Find = "find",
    Get = "get",
    GetAll = "getAll",
    GetMany = "getMany",
    Has = "has",
    Inc = "inc",
    Init = "init",
    Keys = "keys",
    Push = "push",
    Random = "random",
    RandomKey = "randomKey",
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

declare class JoshProviderError extends JoshError {
    method: Method;
    constructor(options: JoshProviderError.Options);
    get name(): string;
}
declare namespace JoshProviderError {
    interface Options extends JoshError.Options {
        method: Method;
    }
}

interface Payload {
    method: Method;
    trigger?: Trigger;
    stopwatch?: Stopwatch;
    error?: JoshProviderError;
}
declare namespace Payload {
    interface KeyPath {
        key: string;
        path?: string[];
    }
    interface Data<Value = unknown> {
        data: Value;
    }
    type OptionalData<Value = unknown> = Partial<Data<Value>>;
    interface ByData {
        type: Type.Data;
    }
    interface ByHook {
        type: Type.Hook;
    }
    enum Type {
        Data = "DATA",
        Hook = "HOOK"
    }
}

interface AutoKeyPayload extends Payload, Payload.Data<string> {
}

interface DecPayload extends Payload, Payload.KeyPath, Payload.OptionalData<number> {
}

interface DeletePayload extends Payload, Payload.KeyPath {
}

interface EnsurePayload<Value = unknown> extends Payload, Payload.Data<Value> {
    key: string;
    defaultValue: Value;
}

interface FilterPayload<Value = unknown> extends Payload, Payload.OptionalData<Record<string, Value | null>> {
    type: Payload.Type;
    inputData?: Value;
    inputHook?: FilterHook<Value>;
    path?: string[];
}
interface FilterByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.Data<Record<string, Value>> {
    inputData: Value;
    path?: string[];
}
interface FilterByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<Record<string, Value>> {
    inputHook: FilterHook<Value>;
    path?: string[];
}
declare type FilterHook<Value = unknown> = (data: Value) => Awaited<Value>;

interface FindPayload<Value = unknown> extends Payload, Payload.OptionalData<Value> {
    type: Payload.Type;
    inputData?: Value;
    inputHook?: FindHook<Value>;
    path?: string[];
}
interface FindByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.OptionalData<Value> {
    inputData: Value;
    path?: string[];
}
interface FindByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.OptionalData<Value> {
    inputHook: FindHook<Value>;
    path?: string[];
}
declare type FindHook<Value = unknown> = (data: Value) => Awaited<boolean>;

interface GetPayload<Value = unknown> extends Payload, Payload.KeyPath, Payload.OptionalData<Value> {
}

interface GetAllPayload<Value = unknown> extends Payload, Payload.Data<Record<string, Value>> {
}

interface GetManyPayload<Value = unknown> extends Payload, Payload.Data<Record<string, Value | null>> {
    keyPaths: KeyPathArray[];
}

interface HasPayload extends Payload, Payload.KeyPath, Payload.Data<boolean> {
}

interface IncPayload extends Payload, Payload.KeyPath, Payload.OptionalData<number> {
}

interface KeysPayload extends Payload, Payload.Data<string[]> {
}

interface PushPayload extends Payload, Payload.KeyPath {
}

interface RandomPayload<Value = unknown> extends Payload, Payload.OptionalData<Value> {
}

interface RandomKeyPayload extends Payload, Partial<Payload.Data<string>> {
}

interface SetPayload extends Payload, Payload.KeyPath {
}

interface SetManyPayload extends Payload {
    keyPaths: KeyPathArray[];
}

interface SizePayload extends Payload, Payload.Data<number> {
}

interface SomePayload<Value = unknown> extends Payload, Payload.Data<boolean> {
    type: Payload.Type;
    inputData?: Value;
    inputHook?: SomeHook<Value>;
    path?: string[];
}
interface SomeByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.Data<boolean> {
    inputData: Value;
    path?: string[];
}
interface SomeByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.Data<boolean> {
    inputHook: SomeHook<Value>;
    path?: string[];
}
declare type SomeHook<Value = unknown> = (data: Value) => Awaited<boolean>;

interface UpdatePayload<Value = unknown> extends Payload, Payload.KeyPath, Payload.OptionalData<Value> {
    type: Payload.Type;
    inputData?: Value;
    inputHook?: UpdateHook<Value>;
}
interface UpdateByDataPayload<Value = unknown> extends Payload, Payload.ByData, Payload.KeyPath, Payload.OptionalData<Value> {
    inputData: Value;
}
interface UpdateByHookPayload<Value = unknown> extends Payload, Payload.ByHook, Payload.KeyPath, Payload.OptionalData<Value> {
    inputHook: UpdateHook<Value>;
}
declare type UpdateHook<Value = unknown> = (currentData: Value) => Awaited<Value>;

interface ValuesPayload<Value = unknown> extends Payload, Payload.Data<Value[]> {
}

declare class MiddlewareStore<Value = unknown> extends Store<Middleware> {
    instance: Josh<Value>;
    constructor(options: MiddlewareStoreOptions<Value>);
    filterByCondition(method: Method, trigger: Trigger): Middleware[];
}
interface MiddlewareStoreOptions<Value = unknown> {
    instance: Josh<Value>;
}

declare abstract class Middleware<Context extends Middleware.Context = Middleware.Context> extends Piece {
    store: MiddlewareStore;
    readonly position?: number;
    readonly conditions: Middleware.Condition[];
    use: boolean;
    constructor(context: PieceContext, options?: Middleware.Options);
    [Method.AutoKey](payload: AutoKeyPayload): Awaited<AutoKeyPayload>;
    [Method.Dec](payload: DecPayload): Awaited<DecPayload>;
    [Method.Delete](payload: DeletePayload): Awaited<DeletePayload>;
    [Method.Ensure]<Value = unknown>(payload: EnsurePayload<Value>): Awaited<EnsurePayload<Value>>;
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
    [Method.Push](payload: PushPayload): Awaited<PushPayload>;
    [Method.Random]<Value = unknown>(payload: RandomPayload<Value>): Awaited<RandomPayload<Value>>;
    [Method.RandomKey](payload: RandomKeyPayload): Awaited<RandomKeyPayload>;
    [Method.Set](payload: SetPayload): Awaited<SetPayload>;
    [Method.SetMany](payload: SetManyPayload): Awaited<SetManyPayload>;
    [Method.Size](payload: SizePayload): Awaited<SizePayload>;
    [Method.Some]<Value = unknown>(payload: SomeByDataPayload<Value>): Awaited<SomeByDataPayload<Value>>;
    [Method.Some]<Value = unknown>(payload: SomeByHookPayload<Value>): Awaited<SomeByHookPayload<Value>>;
    [Method.Update]<Value = unknown>(payload: UpdateByDataPayload<Value>): Awaited<UpdateByDataPayload<Value>>;
    [Method.Update]<Value = unknown>(payload: UpdateByHookPayload<Value>): Awaited<UpdateByHookPayload<Value>>;
    [Method.Values]<Value = unknown>(payload: ValuesPayload<Value>): Awaited<ValuesPayload<Value>>;
    toJSON(): Record<string, any>;
    protected getContext<C extends Middleware.Context = Context>(): C | undefined;
    protected get instance(): Josh<unknown>;
    protected get provider(): JoshProvider<unknown>;
}
declare namespace Middleware {
    interface Options extends PieceOptions {
        position?: number;
        conditions?: Condition[];
        use?: boolean;
    }
    interface Context {
    }
    interface Condition {
        methods: Method[];
        trigger: Trigger;
    }
    enum Identifiers {
        MissingConditions = "missingConditions"
    }
}

interface AutoEnsureContext<Value = unknown> extends Middleware.Context {
    defaultValue: Value;
}

declare class Josh<Value = unknown> {
    name: string;
    options: Josh.Options<Value>;
    middlewares: MiddlewareStore;
    provider: JoshProvider<Value>;
    constructor(options: Josh.Options<Value>);
    autoKey(): Promise<string>;
    dec(keyPath: KeyPath): Promise<this>;
    delete(keyPath: KeyPath): Promise<this>;
    ensure<CustomValue = Value>(key: string, defaultValue: CustomValue): Promise<CustomValue>;
    filter<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(path: string[], value: CustomValue, returnBulkType?: K): Promise<ReturnBulk<CustomValue>[K]>;
    filter<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(hook: FilterHook<CustomValue>, path?: string[], returnBulkType?: K): Promise<ReturnBulk<CustomValue>[K]>;
    find<CustomValue = Value>(path: string[], value: CustomValue): Promise<CustomValue>;
    find<CustomValue = Value>(hook: FindHook<CustomValue>, path?: string[]): Promise<CustomValue | null>;
    get<CustomValue = Value>(keyPath: KeyPath): Promise<CustomValue | null>;
    getAll<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(returnBulkType?: K): Promise<ReturnBulk<CustomValue>[K]>;
    getMany<CustomValue = Value, K extends keyof ReturnBulk<CustomValue> = Bulk.Object>(keyPaths: KeyPathArray[], returnBulkType?: K): Promise<ReturnBulk<CustomValue | null>[K]>;
    has(keyPath: KeyPath): Promise<boolean>;
    inc(keyPath: KeyPath): Promise<this>;
    keys(): Promise<string[]>;
    push<CustomValue = Value>(keyPath: KeyPath, value: CustomValue): Promise<this>;
    random<CustomValue = Value>(): Promise<CustomValue | null>;
    randomKey(): Promise<string | null>;
    set<CustomValue = Value>(keyPath: KeyPath, value: CustomValue): Promise<this>;
    setMany<CustomValue = Value>(keyPaths: [string, string[]][], value: CustomValue): Promise<this>;
    size(): Promise<number>;
    some<CustomValue = Value>(path: string[], value: CustomValue): Promise<boolean>;
    some<CustomValue = Value>(hook: SomeHook<CustomValue>, path?: string[]): Promise<boolean>;
    update<CustomValue = Value>(keyPath: KeyPath, inputDataOrHook: CustomValue | UpdateHook<CustomValue>): Promise<CustomValue | null>;
    values<CustomValue = Value>(): Promise<CustomValue[]>;
    init(): Promise<this>;
    use(name: string): this;
    private convertBulkData;
    private getKeyPath;
    static multi<Instances extends Record<string, Josh> = Record<string, Josh>>(names: string[], options?: Omit<Josh.Options, 'name'>): Instances;
}
declare namespace Josh {
    interface Options<Value = unknown> {
        name?: string;
        provider?: JoshProvider<Value>;
        middlewareDirectory?: string;
        middlewareContextData?: MiddlewareContextData<Value>;
    }
    enum Identifiers {
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
interface MiddlewareContextData<Value = unknown> {
    [BuiltInMiddleware.AutoEnsure]?: AutoEnsureContext<Value>;
    [K: string]: Middleware.Context | undefined;
}

declare abstract class JoshProvider<Value = unknown> {
    name?: string;
    instance?: Josh<Value>;
    options: JoshProvider.Options;
    constructor(options?: JoshProvider.Options);
    init(context: JoshProvider.Context<Value>): Promise<JoshProvider.Context<Value>>;
    abstract autoKey(payload: AutoKeyPayload): Awaited<AutoKeyPayload>;
    abstract dec(payload: DecPayload): Awaited<DecPayload>;
    abstract delete(payload: DeletePayload): Awaited<DeletePayload>;
    abstract ensure<CustomValue = Value>(payload: EnsurePayload<CustomValue>): Awaited<EnsurePayload<CustomValue>>;
    abstract filterByData<CustomValue = Value>(payload: FilterByDataPayload<CustomValue>): Awaited<FilterByDataPayload<CustomValue>>;
    abstract filterByHook<CustomValue = Value>(payload: FilterByHookPayload<CustomValue>): Awaited<FilterByHookPayload<CustomValue>>;
    abstract findByData<CustomValue = Value>(payload: FindByDataPayload<CustomValue>): Awaited<FindByDataPayload<CustomValue>>;
    abstract findByHook<CustomValue = Value>(payload: FindByHookPayload<CustomValue>): Awaited<FindByHookPayload<CustomValue>>;
    abstract get<CustomValue = Value>(payload: GetPayload<CustomValue>): Awaited<GetPayload<CustomValue>>;
    abstract getAll<CustomValue = Value>(payload: GetAllPayload<CustomValue>): Awaited<GetAllPayload<CustomValue>>;
    abstract getMany<CustomValue = Value>(payload: GetManyPayload<CustomValue>): Awaited<GetManyPayload<CustomValue>>;
    abstract has(payload: HasPayload): Awaited<HasPayload>;
    abstract inc(payload: IncPayload): Awaited<IncPayload>;
    abstract keys(payload: KeysPayload): Awaited<KeysPayload>;
    abstract push<CustomValue = Value>(payload: PushPayload, value: CustomValue): Awaited<PushPayload>;
    abstract random<CustomValue = Value>(payload: RandomPayload<CustomValue>): Awaited<RandomPayload<CustomValue>>;
    abstract randomKey(payload: RandomKeyPayload): Awaited<RandomKeyPayload>;
    abstract set<CustomValue = Value>(payload: SetPayload, value: CustomValue): Awaited<SetPayload>;
    abstract setMany<CustomValue = Value>(payload: SetManyPayload, value: CustomValue): Awaited<SetManyPayload>;
    abstract size(payload: SizePayload): Awaited<SizePayload>;
    abstract someByData<CustomValue = Value>(payload: SomeByDataPayload<CustomValue>): Awaited<SomeByDataPayload<CustomValue>>;
    abstract someByHook<CustomValue = Value>(payload: SomeByHookPayload<CustomValue>): Awaited<SomeByHookPayload<CustomValue>>;
    abstract updateByData<CustomValue = Value>(payload: UpdateByDataPayload<CustomValue>): Awaited<UpdateByDataPayload<CustomValue>>;
    abstract updateByHook<CustomValue = Value>(payload: UpdateByHookPayload<CustomValue>): Awaited<UpdateByHookPayload<CustomValue>>;
    abstract values<CustomValue = Value>(payload: ValuesPayload<CustomValue>): Awaited<ValuesPayload<CustomValue>>;
}
declare namespace JoshProvider {
    interface Options {
    }
    interface Context<Value = unknown> {
        name: string;
        instance?: Josh<Value>;
        error?: JoshProviderError;
    }
}

declare class MapProvider<Value = unknown> extends JoshProvider<Value> {
    private cache;
    private autoKeyCount;
    autoKey(payload: AutoKeyPayload): AutoKeyPayload;
    dec(payload: DecPayload): DecPayload;
    delete(payload: DeletePayload): DeletePayload;
    ensure<CustomValue = Value>(payload: EnsurePayload<CustomValue>): EnsurePayload<CustomValue>;
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
    push<CustomValue = Value>(payload: PushPayload, value: CustomValue): PushPayload;
    random<CustomValue = Value>(payload: RandomPayload<CustomValue>): RandomPayload<CustomValue>;
    randomKey(payload: RandomKeyPayload): RandomKeyPayload;
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
        SetMissingData = "setMissingData"
    }
}

declare class MapProviderError extends JoshProviderError {
    get name(): string;
}

declare function isFilterByDataPayload<Value = unknown>(payload: FilterPayload<Value>): payload is FilterByDataPayload<Value>;
declare function isFilterByHookPayload<Value = unknown>(payload: FilterPayload<Value>): payload is FilterByHookPayload<Value>;

declare function isFindByDataPayload<Value = unknown>(payload: FindPayload<Value>): payload is FindByDataPayload<Value>;
declare function isFindByHookPayload<Value = unknown>(payload: FindPayload<Value>): payload is FindByHookPayload<Value>;

declare function isSomeByDataPayload<Value = unknown>(payload: SomePayload<Value>): payload is SomeByDataPayload<Value>;
declare function isSomeByHookPayload<Value = unknown>(payload: SomePayload<Value>): payload is SomeByHookPayload<Value>;

declare function isUpdateByDataPayload<Value = unknown>(payload: UpdatePayload<Value>): payload is UpdateByDataPayload<Value>;
declare function isUpdateByHookPayload<Value = unknown>(payload: UpdatePayload<Value>): payload is UpdateByHookPayload<Value>;

declare const version = "[VI]{version}[/VI]";

export { ApplyOptions, AutoKeyPayload, BuiltInMiddleware, Bulk, DecPayload, DeletePayload, EnsurePayload, FilterByDataPayload, FilterByHookPayload, FilterHook, FilterPayload, FindByDataPayload, FindByHookPayload, FindHook, FindPayload, GetAllPayload, GetManyPayload, GetPayload, HasPayload, IncPayload, Josh, JoshError, JoshProvider, JoshProviderError, KeyPath, KeyPathArray, KeysPayload, MapProvider, MapProviderError, Method, Middleware, MiddlewareContextData, MiddlewareStore, MiddlewareStoreOptions, Payload, PushPayload, RandomKeyPayload, RandomPayload, ReturnBulk, SetManyPayload, SetPayload, SizePayload, SomeByDataPayload, SomeByHookPayload, SomeHook, SomePayload, Trigger, UpdateByDataPayload, UpdateByHookPayload, UpdateHook, UpdatePayload, ValuesPayload, isFilterByDataPayload, isFilterByHookPayload, isFindByDataPayload, isFindByHookPayload, isSomeByDataPayload, isSomeByHookPayload, isUpdateByDataPayload, isUpdateByHookPayload, version };
