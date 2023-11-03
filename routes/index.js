const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

require("dotenv").config();

/**
 * @swagger
 * paths:
 *  /join:
 *    post:
 *      summary: 회원가입
 *      tags:
 *        - Auth
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
 */

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, name, password, nick } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });

    if (exUser) {
      return res.status(403).json("이미 가입된 이메일입니다.");
    } else {
      const hashedpassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
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
 *  /login:
 *    post:
 *      summary: 로그인
 *      tags:
 *        - Auth
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
 *        '403':
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
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(403).json("아이디 또는 비밀번호가 틀립니다.");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      return res.status(200).json("로그인 성공");
    });
  })(req, res, next);
});

/**
 * @swagger
 * paths:
 *  /auth/logout:
 *    delete:
 *      summary: 로그아웃
 *      tags:
 *        - Auth
 *      responses:
 *        '204':
 *          description: 로그아웃 성공
 */

router.delete("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(204).end();
});

module.exports = router;
