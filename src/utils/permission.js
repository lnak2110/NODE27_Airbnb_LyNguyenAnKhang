const {
  findOneUserSelectRole,
  findOneUser,
} = require('../services/user.service');
const { verifyToken } = require('./jwtoken');
const { forbiddenCode, notFoundCode, errorCode } = require('./response');
const { findOneRoom } = require('../services/room.service');
const { findOneBookRoom } = require('../services/bookRoom.service');
const { findOneComment } = require('../services/comment.service');

const checkRoomPermission = () => async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const userId = verifyToken(req.headers.authorization.split(' ')[1]).content;

    const userRequest = await findOneUserSelectRole(userId);

    if (roomId && Number.isInteger(+roomId)) {
      const roomFound = await findOneRoom(+roomId);

      if (roomFound && userRequest) {
        if (userId === roomFound.ownerId || userRequest.role === 'ADMIN') {
          next();
        } else {
          return forbiddenCode(res);
        }
      } else {
        return notFoundCode(res);
      }
    } else {
      return notFoundCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkUserPermission = () => async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userRequestId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;

    const userRequest = await findOneUserSelectRole(userRequestId);

    if (userRequest) {
      if (+userId === userRequest.userId || userRequest.role === 'ADMIN') {
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkBookRoomPermission =
  (permissionNumber) => async (req, res, next) => {
    try {
      const { bookRoomId } = req.params;

      const userId = verifyToken(
        req.headers.authorization.split(' ')[1]
      ).content;

      const userRequest = await findOneUserSelectRole(userId);

      if (bookRoomId && Number.isInteger(+bookRoomId)) {
        const bookRoomFound = await findOneBookRoom(+bookRoomId);

        if (bookRoomFound && userRequest) {
          switch (permissionNumber) {
            case 1:
              if (
                userId === bookRoomFound.userBookId ||
                userRequest.role === 'ADMIN'
              ) {
                next();
              } else {
                return forbiddenCode(res);
              }
              break;

            case 2:
              if (
                userId === bookRoomFound.userBookId ||
                userId === bookRoomFound.roomBooked.ownerId ||
                userRequest.role === 'ADMIN'
              ) {
                next();
              } else {
                return forbiddenCode(res);
              }
              break;

            default:
              return errorCode(res, '');
          }
        } else {
          return notFoundCode(res);
        }
      } else {
        return notFoundCode(res);
      }
    } catch (error) {
      console.log(error);
      return errorCode(res);
    }
  };

const checkCommentPermission = () => async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const userId = verifyToken(req.headers.authorization.split(' ')[1]).content;

    const userRequest = await findOneUserSelectRole(userId);

    if (commentId && Number.isInteger(+commentId)) {
      const commentFound = await findOneComment(+commentId);

      if (commentFound && userRequest) {
        if (
          userId === commentFound.userCommentId ||
          userRequest.role === 'ADMIN'
        ) {
          next();
        } else {
          return forbiddenCode(res);
        }
      } else {
        return notFoundCode(res);
      }
    } else {
      return notFoundCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkPermissionOnlyAdmin = () => async (req, res, next) => {
  try {
    const userId = verifyToken(req.headers.authorization.split(' ')[1]).content;

    const userRequest = await findOneUserSelectRole(userId);

    if (userRequest) {
      if (userRequest.role === 'ADMIN') {
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

// All roles
const checkPermissionLoggedIn = () => async (req, res, next) => {
  try {
    const userId = verifyToken(req.headers.authorization.split(' ')[1]).content;

    const userFound = await findOneUser(userId);

    if (userFound) {
      next();
    } else {
      return forbiddenCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  checkRoomPermission,
  checkUserPermission,
  checkBookRoomPermission,
  checkCommentPermission,
  checkPermissionOnlyAdmin,
  checkPermissionLoggedIn,
};
