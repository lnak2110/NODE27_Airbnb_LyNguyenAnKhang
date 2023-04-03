const express = require('express');
const {
  commentSchema,
  updateCommentSchema,
  validateBody,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  checkPermissionOnlyAdmin,
  checkCommentPermission,
  checkPermissionLoggedIn,
} = require('../utils/permission');
const {
  getAllComments,
  getCommentsByRoom,
  createComment,
  updateCommentDetail,
  deleteComment,
} = require('../controllers/comment.controller');

const commentRoute = express.Router();

commentRoute.get('/', checkToken, checkPermissionOnlyAdmin(), getAllComments);

commentRoute.get(
  '/room-commented/:roomId',
  checkToken,
  checkPermissionLoggedIn(),
  getCommentsByRoom
);

commentRoute.post(
  '/',
  checkToken,
  checkPermissionLoggedIn(),
  validateBody(commentSchema),
  createComment
);

commentRoute.put(
  '/:commentId',
  checkToken,
  checkCommentPermission(),
  validateBody(updateCommentSchema),
  updateCommentDetail
);

commentRoute.delete(
  '/:commentId',
  checkToken,
  checkCommentPermission(),
  deleteComment
);

module.exports = commentRoute;
