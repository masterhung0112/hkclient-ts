"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_persist_node_storage_1 = require("redux-persist-node-storage");
var redux_persist_1 = require("redux-persist");
var store_1 = tslib_1.__importDefault(require("../store"));
function testConfigureStore(preloadedState) {
    if (preloadedState === void 0) { preloadedState = null; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var storageTransform, offlineConfig, store, wait;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storageTransform = redux_persist_1.createTransform(function () { return ({}); }, function () { return ({}); });
                    offlineConfig = {
                        detectNetwork: function (callback) { return callback(true); },
                        persist: function (store, options) {
                            return redux_persist_1.persistStore(store, tslib_1.__assign({ storage: new redux_persist_node_storage_1.AsyncNodeStorage('./.tmp') }, options));
                        },
                        persistOptions: {
                            debounce: 1000,
                            transforms: [storageTransform],
                            whitelist: [],
                        },
                        retry: function (action, retries) { return 200 * (retries + 1); },
                        discard: function (error, action, retries) {
                            if (action.meta && Object.prototype.hasOwnProperty.call(action.meta.offline, 'maxRetry')) {
                                return retries >= action.meta.offline.maxRetry;
                            }
                            return retries >= 1;
                        },
                    };
                    store = store_1.default(preloadedState, {}, offlineConfig, function () { return ({}); }, { enableBuffer: false });
                    wait = function () { return new Promise(function (resolve) { return setTimeout(resolve, 300); }); };
                    return [4, wait()];
                case 1:
                    _a.sent();
                    return [2, store];
            }
        });
    });
}
exports.default = testConfigureStore;
//# sourceMappingURL=test_store.js.map