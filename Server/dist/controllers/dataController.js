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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createData = exports.getAllData = void 0;
const Data_1 = __importDefault(require("../models/Data"));
// Get all data
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield Data_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(allData);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server error while fetching data' });
    }
});
exports.getAllData = getAllData;
// Create new data
const createData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        // Validate input
        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }
        // Create new data document
        const newData = new Data_1.default({
            title,
            description
        });
        // Save to database
        const savedData = yield newData.save();
        res.status(201).json(savedData);
    }
    catch (error) {
        console.error('Error creating data:', error);
        res.status(500).json({ message: 'Server error while creating data' });
    }
});
exports.createData = createData;
//# sourceMappingURL=dataController.js.map