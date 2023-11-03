const router = require("express").Router();

const { Todo } = require("../models");
const { isLoggedIn } = require("./middlewares");

/**
 * @swagger
 * paths:
 *   /todo:
 *     get:
 *       summary: 할일 목록 조회
 *       tags:
 *         - Todo
 *       responses:
 *         '200':
 *           description: 성공적으로 할일 목록을 받아왔을 때의 응답입니다.
 *           content:
 *             application/json:
 *               example:
 *                 - id: 6
 *                   content: "밥먹기"
 *                   isChecked: false
 *                   createdAt: "2023-11-03T15:20:46.000Z"
 *                   updatedAt: "2023-11-03T15:20:46.000Z"
 *                   userId: 3
 *                 - id: 7
 *                   content: "잠자기"
 *                   isChecked: true
 *                   createdAt: "2023-11-03T15:20:57.000Z"
 *                   updatedAt: "2023-11-03T15:20:57.000Z"
 *                   userId: 3
 *                 - id: 8
 *                   content: "공부하기"
 *                   isChecked: false
 *                   createdAt: "2023-11-03T15:21:08.000Z"
 *                   updatedAt: "2023-11-03T15:21:08.000Z"
 *                   userId: 3
 */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const TodoLists = await Todo.findAll({ where: { userId: req.user.id } });
    console.log(TodoLists);
    res.json(TodoLists);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /todo:
 *     post:
 *       summary: 할일 추가
 *       tags:
 *         - Todo
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   example: "공부하기"
 *                 isChecked:
 *                   type: boolean
 *                   example: false
 *       responses:
 *         '201':
 *           description: 할일이 성공적으로 추가되었을 때의 응답입니다.
 */

router.post("/", isLoggedIn, async (req, res, next) => {
  const { content, isChecked } = req.body;
  try {
    await Todo.create({
      userId: req.user.id,
      content,
      isChecked,
    });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /todos/{id}:
 *     patch:
 *       summary: 할일 상태 수정
 *       tags:
 *         - Todo
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: 수정할 할일의 ID
 *           schema:
 *             type: integer
 *         - in: body
 *           name: body
 *           required: true
 *           description: 수정할 내용
 *           schema:
 *             type: object
 *             properties:
 *               isChecked:
 *                 type: boolean
 *                 example: true
 *       responses:
 *         '201':
 *           description: 할일 상태가 성공적으로 업데이트되었을 때의 응답입니다.
 */

router.patch("/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { isChecked } = req.body;
  try {
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: "조회 일정이 없습니다." });
    }

    await todo.update({ isChecked });

    res.status(201).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
