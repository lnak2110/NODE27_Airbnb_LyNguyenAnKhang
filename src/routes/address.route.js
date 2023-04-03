const express = require('express');
const { addressSchema, validateBody } = require('../utils/validation');
const { checkPermissionLoggedIn } = require('../utils/permission');
const {
  createAddress,
  getAllAddresses,
  getAddressesByNameSearchedPagination,
  getAddressDetail,
  uploadAddressImage,
  updateAddressDetail,
  deleteAddress,
} = require('../controllers/address.controller');
const { checkToken } = require('../utils/jwtoken');
const uploadSingle = require('../utils/uploadImage');

const addressRoute = express.Router();

addressRoute.get('/', checkToken, checkPermissionLoggedIn(), getAllAddresses);

addressRoute.get(
  '/search/pagination',
  checkToken,
  checkPermissionLoggedIn(),
  getAddressesByNameSearchedPagination
);

addressRoute.get(
  '/:addressId',
  checkToken,
  checkPermissionLoggedIn(),
  getAddressDetail
);

addressRoute.put(
  '/:addressId',
  checkToken,
  checkPermissionLoggedIn(),
  validateBody(addressSchema),
  updateAddressDetail
);

addressRoute.delete(
  '/:addressId',
  checkToken,
  checkPermissionLoggedIn(),
  deleteAddress
);

addressRoute.post(
  '/',
  checkToken,
  checkPermissionLoggedIn(),
  uploadSingle,
  validateBody(addressSchema),
  createAddress
);

addressRoute.post(
  '/:addressId/upload-address-image',
  checkToken,
  checkPermissionLoggedIn(),
  uploadSingle,
  uploadAddressImage
);

module.exports = addressRoute;
