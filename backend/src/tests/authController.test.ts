import request from "supertest";
import app from "../index"; // Import your Express app
import mongoose from "mongoose";
import User from "../models/User";
import { ArtisanInfo } from "../models/Artisan";
import jwt from "jsonwebtoken";

// Mock User model
jest.mock("../models/User");
jest.mock("../models/Artisan");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

describe("Auth Controller Tests", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-db");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Register new customer", async () => {
    const userMock = {
      _id: new mongoose.Types.ObjectId(),
      fname: "John",
      lname: "Doe",
      email: "johndoe@example.com",
      password: "hashedpassword",
      role: "customer",
    };

    (User.prototype.save as jest.Mock).mockResolvedValue(userMock);
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post("/api/auth/register").send({
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
  });

  test("Register existing user should fail", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      email: "existinguser@example.com",
    });

    const res = await request(app).post("/api/auth/register").send({
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
  });

  test("Login with valid credentials", async () => {
    const userMock = {
      _id: new mongoose.Types.ObjectId(),
      email: "johndoe@example.com",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    (User.findOne as jest.Mock).mockResolvedValue(userMock);
    (jwt.sign as jest.Mock).mockReturnValue("mocked_token");

    const res = await request(app).post("/api/auth/login").send({
      email: "johndoe@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("mocked_token");
  });

  test("Login with invalid credentials should fail", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "wronguser@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("Get profile with valid token", async () => {
    const userMock = {
      _id: new mongoose.Types.ObjectId(),
      fname: "John",
      lname: "Doe",
      email: "johndoe@example.com",
    };

    (User.findById as jest.Mock).mockResolvedValue(userMock);

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", "Bearer valid_token");

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("johndoe@example.com");
  });

  test("Get profile with invalid token should fail", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", "Bearer invalid_token");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});


