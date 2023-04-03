const express = require('express');
const { bookRoomSchema, validateBody } = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  checkBookRoomPermission,
  checkPermissionOnlyAdmin,
  checkPermissionLoggedIn,
  checkUserPermission,
} = require('../utils/permission');
const {
  getAllBookRooms,
  getBookRoomDetail,
  createBookRoom,
  updateBookRoomDetail,
  deleteBookRoom,
  getBookRoomsByUserBook,
} = require('../controllers/bookRoom.controller');

const bookRoomRoute = express.Router();

bookRoomRoute.get('/', checkToken, checkPermissionOnlyAdmin(), getAllBookRooms);

bookRoomRoute.get(
  '/user-book/:userId',
  checkToken,
  checkUserPermission(),
  getBookRoomsByUserBook
);

bookRoomRoute.get(
  '/:bookRoomId',
  checkToken,
  checkBookRoomPermission(2),
  getBookRoomDetail
);

bookRoomRoute.post(
  '/',
  checkToken,
  checkPermissionLoggedIn(),
  validateBody(bookRoomSchema),
  createBookRoom
);

bookRoomRoute.put(
  '/:bookRoomId',
  checkToken,
  checkBookRoomPermission(1),
  validateBody(bookRoomSchema),
  updateBookRoomDetail
);

bookRoomRoute.delete(
  '/:bookRoomId',
  checkToken,
  checkBookRoomPermission(1),
  deleteBookRoom
);

module.exports = bookRoomRoute;
