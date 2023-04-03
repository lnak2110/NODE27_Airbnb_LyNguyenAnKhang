const {
  findAllComments,
  findManyCommentsByRoom,
  createOneComment,
  findOneComment,
  updateOneComment,
  deleteOneComment,
} = require('../services/comment.service');
const { findOneRoom } = require('../services/room.service');
const { verifyToken } = require('../utils/jwtoken');
const { successCode, errorCode, notFoundCode } = require('../utils/response');

const getAllComments = async (_req, res) => {
  try {
    const result = await findAllComments();

    if (result) {
      return successCode(res, 'Get all comments detail successfully!', result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getCommentsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (roomId && Number.isInteger(+roomId)) {
      const roomFound = await findOneRoom(+roomId);

      if (!roomFound) {
        return notFoundCode(res);
      }

      const result = await findManyCommentsByRoom(+roomId);

      if (result) {
        return successCode(
          res,
          `Get all comments detail with room id ${roomId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find room with id ${roomId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const createComment = async (req, res) => {
  try {
    const userCommentId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;

    const { content, roomCommentedId } = req.body;

    const roomFound = await findOneRoom(roomCommentedId);

    if (roomFound) {
      const newCommentData = {
        content,
        roomCommentedId,
        userCommentId,
      };

      const result = await createOneComment(newCommentData);

      if (result) {
        return successCode(res, `Create a new comment successfully!`, result);
      } else {
        return errorCode(res);
      }
    } else {
      return notFoundCode(res, `Cannot find room with id ${roomCommentedId}!`);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateCommentDetail = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (commentId && Number.isInteger(+commentId)) {
      const commentFound = await findOneComment(+commentId);

      if (commentFound) {
        const { content } = req.body;

        const newCommentData = { content };

        const result = await updateOneComment(+commentId, newCommentData);

        return successCode(
          res,
          `Update comment with id ${commentId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find comment with id ${commentId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (commentId && Number.isInteger(+commentId)) {
      const commentFound = await findOneComment(+commentId);

      if (commentFound) {
        const result = await deleteOneComment(+commentId);

        return successCode(
          res,
          `Delete comment with id ${commentId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find comment with id ${commentId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getAllComments,
  getCommentsByRoom,
  createComment,
  updateCommentDetail,
  deleteComment,
};
