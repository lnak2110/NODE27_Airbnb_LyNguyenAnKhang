const express = require('express');
const { userSchema, validateBody } = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const uploadSingle = require('../utils/uploadImage');
const {
  getAllUsers,
  getUsersByNameSearched,
  getUserDetail,
  updateUserDetail,
  deleteUser,
  uploadUserAvatar,
  getUsersByNameSearchedPagination,
} = require('../controllers/user.controller');
const {
  checkUserPermission,
  checkPermissionLoggedIn,
} = require('../utils/permission');

const userRoute = express.Router();

userRoute.get('/', checkToken, checkPermissionLoggedIn(), getAllUsers);

userRoute.get(
  '/search',
  checkToken,
  checkPermissionLoggedIn(),
  getUsersByNameSearched
);

userRoute.get(
  '/search/pagination',
  checkToken,
  checkPermissionLoggedIn(),
  getUsersByNameSearchedPagination
);

userRoute.get('/:userId', checkToken, checkPermissionLoggedIn(), getUserDetail);

userRoute.post(
  '/:userId/upload-avatar',
  checkToken,
  checkUserPermission(),
  uploadSingle,
  uploadUserAvatar
);

userRoute.put(
  '/:userId',
  checkToken,
  checkUserPermission(),
  validateBody(userSchema),
  updateUserDetail
);

userRoute.delete('/:userId', checkToken, checkUserPermission(), deleteUser);

module.exports = userRoute;
