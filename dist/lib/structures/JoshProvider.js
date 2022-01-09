"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoshProvider = void 0;
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
class JoshProvider {
    constructor(options) {
        this.options = options;
    }
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
    async init(context) {
        const { name, instance } = context;
        this.name = name;
        this.instance = instance;
        return Promise.resolve(context);
    }
}
exports.JoshProvider = JoshProvider;
(function (JoshProvider) {
    let CommonIdentifiers;
    (function (CommonIdentifiers) {
        CommonIdentifiers["DecMissingData"] = "decMissingData";
        CommonIdentifiers["DecInvalidType"] = "decInvalidType";
        CommonIdentifiers["FilterInvalidValue"] = "filterInvalidValue";
        CommonIdentifiers["FindInvalidValue"] = "findInvalidValue";
        CommonIdentifiers["IncInvalidType"] = "incInvalidType";
        CommonIdentifiers["IncMissingData"] = "incMissingData";
        CommonIdentifiers["MathInvalidType"] = "mathInvalidType";
        CommonIdentifiers["MathMissingData"] = "mathMissingData";
        CommonIdentifiers["PartitionInvalidValue"] = "partitionInvalidValue";
        CommonIdentifiers["PushInvalidType"] = "pushInvalidType";
        CommonIdentifiers["PushMissingData"] = "pushMissingData";
        CommonIdentifiers["RemoveInvalidType"] = "removeInvalidType";
        CommonIdentifiers["RemoveMissingData"] = "removeMissingData";
    })(CommonIdentifiers = JoshProvider.CommonIdentifiers || (JoshProvider.CommonIdentifiers = {}));
})(JoshProvider = exports.JoshProvider || (exports.JoshProvider = {}));
//# sourceMappingURL=JoshProvider.js.map