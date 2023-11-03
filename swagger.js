const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "라이브코딩 연습용 투두리스트 API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "dladncks1217",
        url: "https://github.com/dladncks1217",
        email: "dlaxodud1217@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = options;
