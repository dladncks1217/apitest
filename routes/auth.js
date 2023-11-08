const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

require("dotenv").config();

/**
 * @swagger
 * paths:
 *  /auth/join:
 *    post:
 *      summary: 회원가입
 *      tags:
 *        - User
 *      requestBody:
 *        content:
 *          form-data:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: dlaxodud1217@gmail.com
 *                password:
 *                  type: string
 *                  example: asdf1234
 *                name:
 *                  type: string
 *                  example: 임우찬
 *                nick:
 *                  type: string
 *                  example: 슬링키
 *      responses:
 *        '200':
 *          description: 회원가입 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    example: dlaxodud1217@gmail.com
 *                  name:
 *                    type: string
 *                    example: 임우찬
 *                  nick:
 *                    type: string
 *                    example: 슬링키
 *        '409':
 *          description: 이미 가입된 이메일
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 이미 가입된 이메일입니다.
 */

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, name, password, nick } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });

    if (exUser) {
      return res.status(409).json("이미 가입된 이메일입니다.");
    } else {
      const hashedpassword = await bcrypt.hash(password, 12);
      await User.create({
        email,
        name,
        password: hashedpassword,
        nick,
      });
      const returnedUser = {
        email,
        name,
        nick,
      };
      return res.status(200).json(returnedUser);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      summary: 로그인
 *      tags:
 *        - User
 *      requestBody:
 *        content:
 *          form-data:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: dlaxodud1217@gmail.com
 *                password:
 *                  type: string
 *                  example: hello1234
 *      responses:
 *        '200':
 *          description: 로그인 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 로그인 성공
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: "connect.sid=s%3AtGk5Am_rjtU8HLaAsBT_C0B0o5nwkJBo.xLU4cVy6VTAtXVgbMn%2BVbDRrVqxHk5k7sYn%2FrrbMYSY; Path=/; HttpOnly"
 *        '401':
 *          description: 아이디 또는 비밀번호가 틀립니다.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 아이디 또는 비밀번호가 틀립니다.
 */

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 틀립니다." });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      return res.status(200).json({ message: "로그인 성공" });
    });
  })(req, res, next);
});

/**
 * @swagger
 * paths:
 *  /auth/me:
 *    get:
 *      summary: 내 정보 조회
 *      tags:
 *        - User
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *          description: 내 정보 조회 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: 임우찬
 *                  email:
 *                    type: string
 *                    example: dlaxodud1217@gmail.com
 *                  nick:
 *                    type: string
 *                    example: 슬링키
 *        '401':
 *          description: 인증되지 않음
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 로그인 필요
 */

router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const UserData = await User.findOne({ where: { id: req.user.id } });

    const responseData = {
      name: UserData.name,
      email: UserData.email,
      nick: UserData.nick,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * @swagger
 * paths:
 *  /auth/logout:
 *    delete:
 *      summary: 로그아웃
 *      tags:
 *        - User
 *      responses:
 *        '204':
 *          description: 로그아웃 성공
 */

router.delete("/logout", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.status(204).end();
    });
  });
});

module.exports = router;
