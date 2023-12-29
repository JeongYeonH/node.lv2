import express from "express";

import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

//댓글 등록 API
router.post("/reviews/:reviewId/comments", async (req, res, next) => {
  const { reviewId } = req.params;
  const { author, content, password } = req.body;

  if (!author || !reviewId || !content || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  const comment = await prisma.comments.create({
    data: { author, reviewId: +reviewId, content, password },
  });

  return res.status(201).json({ message: "댓글을 등록하였습니다." });
});

//댓글 목록 조회 API
router.get("/reviews/:reviewId/comments", async (req, res, next) => {
  const { reviewId } = req.params;
  const comment = await prisma.comments.findFirst({
    where: { reviewId: +reviewId },
  });
  if (!comment) {
    return res.status(404).json({ errorMessage: "존재하지 않는 리뷰입니다." });
  }
  const comments = await prisma.comments.findMany({
    where: { reviewId: +reviewId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: comments });
});

//댓글 수정 API
router.put("/reviews/:reviewId/comments/:commentId", async (req, res, next) => {
  const { commentId } = req.params;
  const { content, password } = req.body;
  const comment = await prisma.comments.findUnique({
    where: { id: +commentId },
  });
  if (!content && !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  if (!content) {
    return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." });
  }

  if (!comment) {
    return res.status(404).json({ errorMessage: "존재하지 않는 리뷰입니다." });
  }
  if (comment.password !== password) {
    return res
      .status(401)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
  }

  await prisma.comments.update({
    data: { content, updatedAt: new Date() },
    where: { id: +commentId },
  });

  return res.status(200).json({ message: "댓글을 수정하였습니다." });
});

//댓글 삭제 API
router.delete(
  "/reviews/:reviewId/comments/:commentId",
  async (req, res, next) => {
    const { commentId } = req.params;
    const { password } = req.body;
    const comment = await prisma.comments.findUnique({
      where: { id: +commentId },
    });
    if (!password) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    if (!comment) {
      return res
        .status(404)
        .json({ errorMessage: "존재하지 않는 리뷰입니다." });
    }
    if (comment.password !== password) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    await prisma.comments.delete({
      where: { id: +commentId },
    });

    return res.status(200).json({ message: "댓글을 삭제하였습니다." });
  }
);

export default router;
