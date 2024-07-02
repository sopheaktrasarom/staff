"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Hello Crud Node Express" });
});
const staffData = [];
//Endpoint to get all staff members
app.get("/api/staff", (req, res) => {
    var _a;
    let filteredStaffData = staffData;
    const gender = (_a = req.query.gender) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (req.query.gender) {
        filteredStaffData = filteredStaffData.filter((item) => (item === null || item === void 0 ? void 0 : item.gender.toLowerCase()) == gender);
    }
    if (req.query.id) {
        filteredStaffData = filteredStaffData.filter((item) => item.id.includes(req.query.id));
    }
    if (req.query.startedAt && req.query.endedAt) {
        filteredStaffData = filteredStaffData.filter((item) => {
            const birthday = (0, dayjs_1.default)(item.birthDate);
            return ((birthday === null || birthday === void 0 ? void 0 : birthday.isSame(req.query.startedAt)) ||
                (birthday === null || birthday === void 0 ? void 0 : birthday.isSame(req.query.endedAt)));
        });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const newStaffData = filteredStaffData.map((item) => {
        return Object.assign(Object.assign({}, item), { birthDate: (0, dayjs_1.default)(item.birthDate) });
    });
    const paginatedData = newStaffData.slice(startIndex, endIndex);
    const meta = {
        page,
        limit,
        totalItems: newStaffData.length,
        totalPages: Math.ceil(newStaffData.length / limit),
    };
    res.status(200).json({ message: "success", data: paginatedData, meta });
});
app.post("/api/staff", (req, res) => {
    const newStaff = {
        id: (0, uuid_1.v4)().slice(0, 8),
        fullName: req.body.fullName,
        birthDate: (0, dayjs_1.default)(req.body.birthDate),
        gender: req.body.gender,
    };
    staffData.unshift(newStaff);
    res.status(200).json(newStaff);
});
app.delete("/api/staff/:id", (req, res) => {
    const currentStaff = staffData.find((item) => item.id == req.params.id);
    const indexToDelete = staffData.indexOf(currentStaff);
    staffData.splice(indexToDelete, 1);
    res.status(200).json(currentStaff);
});
app.put("/api/staff/:id", (req, res) => {
    const index = staffData.findIndex((item) => item.id == req.params.id);
    const { fullName, birthDate, gender } = req.body;
    const updateStaff = {
        id: req.params.id,
        birthDate,
        fullName,
        gender,
    };
    staffData[index] = updateStaff;
    res.status(200).json(updateStaff);
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
