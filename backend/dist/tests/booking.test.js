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
const index_1 = __importDefault(require("../index")); // Import Express app
const mongoose_1 = __importDefault(require("mongoose"));
const Booking_1 = require("../models/Booking");
const User_1 = __importDefault(require("../models/User"));
const Artisan_1 = require("../models/Artisan");
const mongodb_memory_server_1 = require("mongodb-memory-server");
// Declare variables for test data
let mongoServer;
let customerToken;
let customerId;
let artisanId;
let serviceId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Start in-memory MongoDB
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    yield mongoose_1.default.connect(uri);
    // Create a customer
    const customer = yield User_1.default.create({
        fname: "John",
        lname: "Doe",
        email: "customer@example.com",
        phone: "1234567890",
        city: "Lagos",
        address: "123 Street",
        state: "Lagos",
        password: "password",
        role: "customer",
    });
    //   customerId = customer._id.toString();
    // Create an artisan
    const artisan = yield User_1.default.create({
        fname: "Jane",
        lname: "Smith",
        email: "artisan@example.com",
        phone: "0987654321",
        city: "Abuja",
        address: "456 Street",
        state: "Abuja",
        password: "password",
        role: "artisan",
    });
    //   artisanId = artisan._id.toString();
    // Create an artisan service
    const artisanService = yield Artisan_1.ArtisanInfo.create({
        user: artisanId,
        skills: ["Plumbing"],
        images: [],
        verified: true,
    });
    //   serviceId = artisanService._id.toString();
    // Generate JWT Token for customer
    const loginResponse = yield (0, supertest_1.default)(index_1.default)
        .post("/api/auth/login")
        .send({ email: "customer@example.com", password: "password" });
    customerToken = loginResponse.body.token;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
describe("Booking API Integration Tests", () => {
    test("Should create a booking", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({
            artisanId,
            serviceId,
            bookingDate: new Date().toISOString(),
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("booking");
        expect(res.body.booking.customer).toBe(customerId);
        expect(res.body.booking.artisan).toBe(artisanId);
    }));
    test("Should get a booking by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a booking
        const booking = yield Booking_1.Booking.create({
            customer: customerId,
            artisan: artisanId,
            service: serviceId,
            booking_date: new Date(),
            status: "pending",
        });
        const res = yield (0, supertest_1.default)(index_1.default)
            .get(`/api/bookings/${booking._id}`)
            .set("Authorization", `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.customer._id).toBe(customerId);
    }));
});
