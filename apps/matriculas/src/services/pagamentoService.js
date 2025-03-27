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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagamentoService = void 0;
var supabase_1 = require("../lib/supabase");
exports.pagamentoService = {
    listarPagamentos: function (matriculaId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from('pagamentos')
                            .select('*')
                            .eq('matricula_id', matriculaId)
                            .order('data_vencimento', { ascending: true })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    buscarPagamento: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from('pagamentos')
                            .select('*')
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    criarPagamento: function (pagamento) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from('pagamentos')
                            .insert([pagamento])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    criarPagamentosMatricula: function (matriculaId, valorTotal, numeroParcelas, diaVencimento, dataInicio) {
        return __awaiter(this, void 0, void 0, function () {
            var pagamentos, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pagamentos = Array.from({ length: numeroParcelas }, function (_, i) {
                            var dataVencimento = new Date(dataInicio);
                            dataVencimento.setMonth(dataVencimento.getMonth() + i);
                            dataVencimento.setDate(diaVencimento);
                            return {
                                matricula_id: matriculaId,
                                valor: valorTotal / numeroParcelas,
                                data_vencimento: dataVencimento.toISOString().split('T')[0],
                                status: 'pendente'
                            };
                        });
                        return [4 /*yield*/, supabase_1.supabase
                                .from('pagamentos')
                                .insert(pagamentos)
                                .select()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    registrarPagamento: function (id, formaPagamento, comprovante) {
        return __awaiter(this, void 0, void 0, function () {
            var comprovanteUrl, path, _a, data_1, error_1, publicUrl, _b, data, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!comprovante) return [3 /*break*/, 2];
                        path = "comprovantes/".concat(id, "/").concat(comprovante.name);
                        return [4 /*yield*/, supabase_1.supabase.storage
                                .from('pagamentos')
                                .upload(path, comprovante)];
                    case 1:
                        _a = _c.sent(), data_1 = _a.data, error_1 = _a.error;
                        if (error_1)
                            throw error_1;
                        publicUrl = supabase_1.supabase.storage
                            .from('pagamentos')
                            .getPublicUrl(data_1.path).data.publicUrl;
                        comprovanteUrl = publicUrl;
                        _c.label = 2;
                    case 2: return [4 /*yield*/, supabase_1.supabase
                            .from('pagamentos')
                            .update({
                            status: 'aprovado',
                            data_pagamento: new Date().toISOString(),
                            forma_pagamento: formaPagamento,
                            comprovante_url: comprovanteUrl
                        })
                            .eq('id', id)
                            .select()
                            .single()];
                    case 3:
                        _b = _c.sent(), data = _b.data, error = _b.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    estornarPagamento: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from('pagamentos')
                            .update({
                            status: 'reembolsado',
                            data_pagamento: null,
                            forma_pagamento: null,
                            comprovante_url: null
                        })
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    }
};
