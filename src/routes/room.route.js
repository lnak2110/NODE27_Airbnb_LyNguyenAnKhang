const express = require('express');
const { roomSchema, validateBody } = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const uploadSingle = require('../utils/uploadImage');
const {
  getAllRooms,
  getRoomDetail,
  updateRoomDetail,
  deleteRoom,
  createRoom,
  uploadRoomImage,
  getRoomsByLocation,
  getRoomsByNameSearchedPagination,
} = require('../controllers/room.controller');
const {
  checkRoomPermission,
  checkPermissionLoggedIn,
} = require('../utils/permission');

const roomRoute = express.Router();

roomRoute.get('/', checkToken, checkPermissionLoggedIn(), getAllRooms);

roomRoute.get(
  '/location',
  checkToken,
  checkPermissionLoggedIn(),
  getRoomsByLocation
);

roomRoute.get(
  '/search/pagination',
  checkToken,
  checkPermissionLoggedIn(),
  getRoomsByNameSearchedPagination
);

roomRoute.get('/:roomId', checkToken, checkPermissionLoggedIn(), getRoomDetail);

roomRoute.put(
  '/:roomId',
  checkToken,
  checkRoomPermission(),
  validateBody(roomSchema),
  updateRoomDetail
);

roomRoute.delete('/:roomId', checkToken, checkRoomPermission(), deleteRoom);

roomRoute.post(
  '/',
  checkToken,
  checkPermissionLoggedIn(),
  uploadSingle,
  validateBody(roomSchema),
  createRoom
);

roomRoute.post(
  '/:roomId/upload-room-image',
  checkToken,
  checkRoomPermission(),
  uploadSingle,
  uploadRoomImage
);

module.exports = roomRoute;
