"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SERVER = void 0;
var tslib_1 = require("tslib");
var nock_1 = tslib_1.__importDefault(require("nock"));
var hkclient_1 = tslib_1.__importDefault(require("hkclient/hkclient"));
var helpers_1 = require("utils/helpers");
var constants_1 = require("../constants");
exports.DEFAULT_SERVER = 'http://localhost:8065';
var PASSWORD = 'password1';
var TestHelper = (function () {
    function TestHelper() {
        var _this = this;
        this.basicClient = null;
        this.basicUser = null;
        this.createClient = function () {
            var client = new hkclient_1.default();
            client.url = exports.DEFAULT_SERVER;
            return client;
        };
        this.initBasic = function (hkClient) {
            if (hkClient === void 0) { hkClient = _this.createClient(); }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    hkClient.url = exports.DEFAULT_SERVER;
                    this.basicClient = hkClient;
                    this.activateMocking();
                    this.initMockEntities();
                    return [2, {
                            hkclient: this.basicClient,
                        }];
                });
            });
        };
        this.tearDown = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                nock_1.default.restore();
                this.basicClient = null;
                return [2];
            });
        }); };
        this.generateId = function () {
            return helpers_1.generateId();
        };
        this.fakeEmail = function () {
            return 'success' + _this.generateId() + '@simulator.amazonses.com';
        };
        this.fakeUser = function () {
            return {
                email: _this.fakeEmail(),
                allow_marketing: true,
                password: PASSWORD,
                locale: constants_1.General.DEFAULT_LOCALE,
                username: _this.generateId(),
                first_name: _this.generateId(),
                last_name: _this.generateId(),
                create_at: Date.now(),
                delete_at: 0,
                roles: 'system_user',
            };
        };
        this.fakeUserWithId = function (id) {
            if (id === void 0) { id = _this.generateId(); }
            return tslib_1.__assign(tslib_1.__assign({}, _this.fakeUser()), { id: id, create_at: 1507840900004, update_at: 1507840900004, delete_at: 0 });
        };
        this.initMockEntities = function () {
            _this.basicUser = _this.fakeUserWithId();
            _this.basicUser.roles = 'system_user system_admin';
        };
    }
    TestHelper.prototype.activateMocking = function () {
        if (!nock_1.default.isActive()) {
            nock_1.default.activate();
        }
    };
    return TestHelper;
}());
exports.default = new TestHelper();
//# sourceMappingURL=test_helper.js.map