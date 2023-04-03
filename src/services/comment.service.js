const { userWithoutPassword } = require('../utils/exclude');
const prisma = require('../utils/prisma');

const findAllComments = async () => {
  const result = await prisma.comment.findMany({
    include: {
      userComment: { select: userWithoutPassword },
      roomCommented: true,
    },
  });

  return result;
};

const findManyCommentsByRoom = async (roomId) => {
  const result = await prisma.comment.findMany({
    where: { roomCommentedId: roomId },
    include: {
      userComment: { select: userWithoutPassword },
      roomCommented: true,
    },
  });

  return result;
};

const findOneComment = async (commentId) => {
  const result = await prisma.comment.findUnique({
    where: { commentId },
    include: {
      userComment: { select: userWithoutPassword },
      roomCommented: true,
    },
  });

  return result;
};

const createOneComment = async (newCommentData) => {
  const result = await prisma.comment.create({
    data: newCommentData,
  });

  return result;
};

const updateOneComment = async (commentId, newCommentData) => {
  const result = await prisma.comment.update({
    where: { commentId },
    data: newCommentData,
  });

  return result;
};

const deleteOneComment = async (commentId) => {
  const result = await prisma.comment.delete({
    where: { commentId },
  });

  return result;
};

module.exports = {
  findAllComments,
  findManyCommentsByRoom,
  findOneComment,
  createOneComment,
  updateOneComment,
  deleteOneComment,
};
