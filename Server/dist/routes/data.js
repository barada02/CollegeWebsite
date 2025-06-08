"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataController_1 = require("../controllers/dataController");
const router = express_1.default.Router();
// GET all data
router.get('/', dataController_1.getAllData);
// POST create new data
router.post('/', dataController_1.createData);
exports.default = router;
//# sourceMappingURL=data.js.map