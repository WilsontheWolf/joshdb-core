"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProviderError = void 0;
const errors_1 = require("../../errors");
/**
 * The error class for the MapProvider.
 * @since 2.0.0
 */
class MapProviderError extends errors_1.JoshProviderError {
    /**
     * The name for this error.
     */
    get name() {
        return 'MapProviderError';
    }
}
exports.MapProviderError = MapProviderError;
//# sourceMappingURL=MapProviderError.js.map