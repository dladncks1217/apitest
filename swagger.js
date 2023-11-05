const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "라이브코딩 연습용 투두리스트 API",
      version: "0.1.0",
      description:
        "서브도메인만 와일드카드로 CORS 풀어놓는건 불가능해서 localhost3000만 풀어놨습니다... 코더패드에서 쓸거면 DM주세요",
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
