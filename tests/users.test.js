const request = require("supertest");
const { app, setupApp } = require("../app");

beforeAll(async () => {
  await setupApp();
});

describe("GET /api/users", () => {
  test("should return 200 and results containing 4 names with salary range [0, 4000]", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Eve", salary: 3200 },
        { name: "Emma", salary: 3500.4 },
        { name: "Lucas", salary: 2700.15 },
        { name: "Olivia", salary: 1500.6 },
      ],
    });
  });
});

describe("GET /api/users?min=6500&max=10000", () => {
  test("should return 200 and results containing 3 names with salary range [6500, 10000]", async () => {
    const res = await request(app).get("/api/users?min=6500&max=10000");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "John", salary: 8000.5 },
        { name: "James", salary: 7200.3 },
        { name: "Minseo", salary: 9000.1 },
      ],
    });
  });
});

describe("GET /api/users?min=five", () => {
  test("should return 400 - invalid query params for 'min'", async () => {
    const res = await request(app).get("/api/users?min=five");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid params for 'min'.",
    });
  });
});

describe("GET /api/users?min=4000&max=10000&sort=name", () => {
  test("should return 200 and results containing 6 names with salary range [4000, 10000], sorted by name (ascending)", async () => {
    const res = await request(app).get(
      "/api/users?min=4000&max=10000&sort=name"
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Alice", salary: 4500.75 },
        { name: "James", salary: 7200.3 },
        { name: "John", salary: 8000.5 },
        { name: "Mark", salary: 5400.2 },
        { name: "Minseo", salary: 9000.1 },
        { name: "Sophia", salary: 6100 },
      ],
    });
  });
});

describe("GET /api/users?min=4000&max=10000&sort=NAME", () => {
  test("should also return 200 and results containing 6 names with salary range [4000, 10000], sorted by name (ascending) - non-case sensitive", async () => {
    const res = await request(app).get(
      "/api/users?min=4000&max=10000&sort=NAME"
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Alice", salary: 4500.75 },
        { name: "James", salary: 7200.3 },
        { name: "John", salary: 8000.5 },
        { name: "Mark", salary: 5400.2 },
        { name: "Minseo", salary: 9000.1 },
        { name: "Sophia", salary: 6100 },
      ],
    });
  });
});

describe("GET /api/users?min=4000&max=10000&sort=salary", () => {
  test("should return 200 and results containing 6 names with salary range [4000, 10000], sorted by salary (ascending)", async () => {
    const res = await request(app).get(
      "/api/users?min=4000&max=10000&sort=salary"
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Alice", salary: 4500.75 },
        { name: "Mark", salary: 5400.2 },
        { name: "Sophia", salary: 6100 },
        { name: "James", salary: 7200.3 },
        { name: "John", salary: 8000.5 },
        { name: "Minseo", salary: 9000.1 },
      ],
    });
  });
});

describe("GET /api/users?min=4000&max=10000&sort=age", () => {
  test("should return 400 - invalid query params for sort", async () => {
    const res = await request(app).get(
      "/api/users?min=4000&max=10000&sort=age"
    );
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error:
        "Invalid params for 'sort'. Accepted values are 'name' and 'salary'.",
    });
  });
});

describe("GET /api/users?min=4000&max=10000&sort=salary&limit=3", () => {
  test("should return 200 and results containing first 3 names with salary range [4000, 10000], sorted by salary (ascending)", async () => {
    const res = await request(app).get(
      "/api/users?min=4000&max=10000&sort=salary&limit=3"
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "Alice", salary: 4500.75 },
        { name: "Mark", salary: 5400.2 },
        { name: "Sophia", salary: 6100 },
      ],
    });
  });
});

describe("GET /api/users?min=4000&max=10000&sort=salary&limit=3&offset=3", () => {
  test("should return 200 and results containing next 3 with salary range [4000, 10000], sorted by salary (ascending)", async () => {
    const res = await request(app).get(
      "/api/users?min=4000&max=10000&sort=salary&limit=3&offset=3"
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      results: [
        { name: "James", salary: 7200.3 },
        { name: "John", salary: 8000.5 },
        { name: "Minseo", salary: 9000.1 },
      ],
    });
  });
});
