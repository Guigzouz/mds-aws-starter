const request = require("supertest");
const app = require("./index");
const http = require("http");

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});

describe("GET /GET /", () => {
  it("should respond with Hello, World!", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });
});
