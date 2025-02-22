import request from "supertest";
import  app  from "../index"; // Import Express app
import mongoose from "mongoose";
import { Booking } from "../models/Booking";
import User, { IUser } from "../models/User";
import { ArtisanInfo } from "../models/Artisan";
import { MongoMemoryServer } from "mongodb-memory-server";

// Declare variables for test data
let mongoServer: MongoMemoryServer;
let customerToken: string;
let customerId: string;
let artisanId: string;
let serviceId: string;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a customer
  const customer = await User.create({
    fname: "John",
    lname: "Doe",
    email: "customer@example.com",
    phone: "1234567890",
    city: "Lagos",
    address: "123 Street",
    state: "Lagos",
    password: "password",
    role: "customer",
  }) 

//   customerId = customer._id.toString();

  // Create an artisan
  const artisan = await User.create({
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
  const artisanService = await ArtisanInfo.create({
    user: artisanId,
    skills: ["Plumbing"],
    images: [],
    verified: true,
  });

//   serviceId = artisanService._id.toString();

  // Generate JWT Token for customer
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "customer@example.com", password: "password" });

  customerToken = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Booking API Integration Tests", () => {
  test("Should create a booking", async () => {
    const res = await request(app)
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
  });

  test("Should get a booking by ID", async () => {
    // Create a booking
    const booking = await Booking.create({
      customer: customerId,
      artisan: artisanId,
      service: serviceId,
      booking_date: new Date(),
      status: "pending",
    });

    const res = await request(app)
      .get(`/api/bookings/${booking._id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.customer._id).toBe(customerId);
  });
});
