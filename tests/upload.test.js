const request = require("supertest");
const fs = require("fs").promises;
const { app, setupApp } = require("../app");

beforeAll(async () => {
  await setupApp();
});

afterAll(async () => {
  try {
    await fs.unlink("./database/database.sqlite");
    console.log("Database deleted successfully.");
  } catch (err) {
    console.error("Error deleting database", err);
  }
});

describe("POST /api/upload", () => {
  test("POST - should return 200 with success: 1", async () => {
    const csvData = "Name,Salary\nTerry,2500.05\nJane,3000.00";
    const encodedCsvData = encodeURIComponent(csvData);
    const res = await request(app)
      .post("/api/upload")
      .type("form")
      .send({ file: encodedCsvData });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(1);
  });

  test("GET - should return 200 with newly-added entries", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Eve", salary: 3200 },
        { name: "Emma", salary: 3500.4 },
        { name: "Lucas", salary: 2700.15 },
        { name: "Olivia", salary: 1500.6 },
        { name: "Terry", salary: 2500.05 },
        { name: "Jane", salary: 3000 },
      ],
    });
  });

  test("POST with duplicate name - should return 200 with success: 1", async () => {
    const csvData = "Name,Salary\nTerry,3200.15";
    const encodedCsvData = encodeURIComponent(csvData);
    const res = await request(app)
      .post("/api/upload")
      .type("form")
      .send({ file: encodedCsvData });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(1);
  });

  test("GET - should return 200 with updated salary", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Eve", salary: 3200 },
        { name: "Emma", salary: 3500.4 },
        { name: "Lucas", salary: 2700.15 },
        { name: "Olivia", salary: 1500.6 },
        { name: "Terry", salary: 3200.15 },
        { name: "Jane", salary: 3000 },
      ],
    });
  });

  test("POST with negative salary - should return 200 with success: 1", async () => {
    const csvData = "Name,Salary\nTerry,-500\nBryan,-3000\nAlex,0";
    const encodedCsvData = encodeURIComponent(csvData);
    const res = await request(app)
      .post("/api/upload")
      .type("form")
      .send({ file: encodedCsvData });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(1);
  });

  test("GET - should not contain Terry and Bryan, but contain Alex", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.results).not.toContainEqual({
      name: "Terry",
      salary: -500,
    });
    expect(res.body.results).not.toContainEqual({
      name: "Bryan",
      salary: -3000,
    });
    expect(res.body.results).toContainEqual({
      name: "Alex",
      salary: 0,
    });
  });

  test("POST with invalid csv - should return 400 with success: 0", async () => {
    const csvData = "Name,Salary\nDonald,2200\nSally,five thousand";
    const encodedCsvData = encodeURIComponent(csvData);
    const res = await request(app)
      .post("/api/upload")
      .type("form")
      .send({ file: encodedCsvData });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(0);
  });

  test("GET - should not include Donald and Sally's data", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.results).not.toContainEqual({
      name: "Donald",
      salary: 2200,
    });
    expect(res.body.results).not.toContainEqual({
      name: "Sally",
      salary: "five thousand",
    });
  });
});
