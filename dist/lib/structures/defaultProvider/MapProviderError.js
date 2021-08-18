"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProviderError = void 0;
const errors_1 = require("../../errors");
class MapProviderError extends errors_1.JoshProviderError {
    get name() {
        return 'MapProviderError';
    }
}
exports.MapProviderError = MapProviderError;
//# sourceMappingURL=MapProviderError.js.map