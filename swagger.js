const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "라이브코딩 연습용 투두리스트 API",
      version: "0.1.0",
      description: "안녕하세요?",
      contact: {
        name: "dladncks1217",
        url: "https://github.com/dladncks1217",
        email: "dlaxodud1217@gmail.com",
      },
    },
    servers: [
      {
        url: "http://slinky.kro.kr",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = options;
