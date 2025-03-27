"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matriculaService = exports.matriculaKeys = void 0;
var errors_1 = require("../lib/errors");
var ITEMS_PER_PAGE = 10;
exports.matriculaKeys = {
    all: ['matriculas'],
    lists: function () { return __spreadArray(__spreadArray([], exports.matriculaKeys.all, true), ['list'], false); },
    list: function (filters) { return __spreadArray(__spreadArray([], exports.matriculaKeys.lists(), true), [filters], false); },
    details: function () { return __spreadArray(__spreadArray([], exports.matriculaKeys.all, true), ['detail'], false); },
    detail: function (id) { return __spreadArray(__spreadArray([], exports.matriculaKeys.details(), true), [id], false); },
};
exports.matriculaService = {
    listarMatriculas: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var page, perPage, queryParams;
            return __generator(this, function (_a) {
                try {
                    page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
                    perPage = (filters === null || filters === void 0 ? void 0 : filters.perPage) || 10;
                    queryParams = new URLSearchParams();
                    if (filters === null || filters === void 0 ? void 0 : filters.alunoId) {
                        queryParams.append('alunoId', filters.alunoId);
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.cursoId) {
                        queryParams.append('cursoId', filters.cursoId);
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.status) {
                        queryParams.append('status', filters.status);
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.dataInicio) {
                        queryParams.append('dataInicio', filters.dataInicio.toISOString());
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.dataFim) {
                        queryParams.append('dataFim', filters.dataFim.toISOString());
                    }
                    queryParams.append('page', page.toString());
                    queryParams.append('perPage', perPage.toString());
                    // TODO: Implementar chamada à API
                    return [2 /*return*/, {
                            items: [],
                            total: 0,
                            page: page,
                            perPage: perPage,
                            totalPages: 0
                        }];
                }
                catch (error) {
                    throw new errors_1.AppError('Erro ao listar matrículas', error);
                }
                return [2 /*return*/];
            });
        });
    },
    buscarMatricula: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // TODO: Implementar chamada à API
                    return [2 /*return*/, null];
                }
                catch (error) {
                    throw new errors_1.AppError('Erro ao buscar matrícula', error);
                }
                return [2 /*return*/];
            });
        });
    },
    criarMatricula: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // TODO: Implementar chamada à API
                    return [2 /*return*/, null];
                }
                catch (error) {
                    throw new errors_1.AppError('Erro ao criar matrícula', error);
                }
                return [2 /*return*/];
            });
        });
    },
    atualizarMatricula: function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // TODO: Implementar chamada à API
                    return [2 /*return*/, null];
                }
                catch (error) {
                    throw new errors_1.AppError('Erro ao atualizar matrícula', error);
                }
                return [2 /*return*/];
            });
        });
    },
    cancelarMatricula: function (id, observacoes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // TODO: Implementar chamada à API
                    return [2 /*return*/, null];
                }
                catch (error) {
                    throw new errors_1.AppError('Erro ao cancelar matrícula', error);
                }
                return [2 /*return*/];
            });
        });
    }
};
