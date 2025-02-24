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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index")); // Import your Express app
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock User model
jest.mock("../models/User");
jest.mock("../models/Artisan");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
describe("Auth Controller Tests", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb://127.0.0.1:27017/test-db");
    }));
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    test("Register new customer", () => __awaiter(void 0, void 0, void 0, function* () {
        const userMock = {
            _id: new mongoose_1.default.Types.ObjectId(),
            fname: "John",
            lname: "Doe",
            email: "johndoe@example.com",
            password: "hashedpassword",
            role: "customer",
        };
        User_1.default.prototype.save.mockResolvedValue(userMock);
        User_1.default.findOne.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(index_1.default).post("/api/auth/register").send({
            fname: "John",
            lname: "Doe",
            email: "johndoe@example.com",
            password: "password123",
            phone: "1234567890",
            city: "New York",
            address: "123 Main St",
            state: "NY",
            role: "customer",
        });
        expect(res.status).toBe(201);
        expect(res.body.message).toContain("customer registered successfully");
        expect(res.body.token).toBeDefined();
    }));
    test("Register existing user should fail", () => __awaiter(void 0, void 0, void 0, function* () {
        User_1.default.findOne.mockResolvedValue({
            email: "existinguser@example.com",
        });
        const res = yield (0, supertest_1.default)(index_1.default).post("/api/auth/register").send({
            fname: "Jane",
            lname: "Doe",
            email: "existinguser@example.com",
            password: "password123",
            phone: "1234567890",
            city: "Los Angeles",
            address: "456 Elm St",
            state: "CA",
            role: "customer",
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    }));
    test("Login with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const userMock = {
            _id: new mongoose_1.default.Types.ObjectId(),
            email: "johndoe@example.com",
            comparePassword: jest.fn().mockResolvedValue(true),
        };
        User_1.default.findOne.mockResolvedValue(userMock);
        jsonwebtoken_1.default.sign.mockReturnValue("mocked_token");
        const res = yield (0, supertest_1.default)(index_1.default).post("/api/auth/login").send({
            email: "johndoe@example.com",
            password: "password123",
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBe("mocked_token");
    }));
    test("Login with invalid credentials should fail", () => __awaiter(void 0, void 0, void 0, function* () {
        User_1.default.findOne.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(index_1.default).post("/api/auth/login").send({
            email: "wronguser@example.com",
            password: "wrongpassword",
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid credentials");
    }));
    test("Get profile with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const userMock = {
            _id: new mongoose_1.default.Types.ObjectId(),
            fname: "John",
            lname: "Doe",
            email: "johndoe@example.com",
        };
        User_1.default.findById.mockResolvedValue(userMock);
        const res = yield (0, supertest_1.default)(index_1.default)
            .get("/api/auth/profile")
            .set("Authorization", "Bearer valid_token");
        expect(res.status).toBe(200);
        expect(res.body.email).toBe("johndoe@example.com");
    }));
    test("Get profile with invalid token should fail", () => __awaiter(void 0, void 0, void 0, function* () {
        User_1.default.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(index_1.default)
            .get("/api/auth/profile")
            .set("Authorization", "Bearer invalid_token");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");
    }));
});
