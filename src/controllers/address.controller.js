const {
  createOneAddress,
  updateImageOfOneAddress,
  findAllAddresses,
  findOneAddress,
  updateOneAddress,
  deleteOneAddress,
  findManyAddressesByNamePagination,
} = require('../services/address.service');
const config = require('../utils/config');
const { removeImage } = require('../utils/removeImage');
const {
  successCode,
  errorCode,
  failCode,
  notFoundCode,
} = require('../utils/response');
const { validatePaginationQueries } = require('../utils/validation');

const getAllAddresses = async (_req, res) => {
  try {
    const result = await findAllAddresses();

    if (result) {
      return successCode(res, 'Get all addresses detail successfully!', result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getAddressesByNameSearchedPagination = async (req, res) => {
  try {
    const { name, page, size } = req.query;

    if (!validatePaginationQueries(page, size)) {
      return failCode(res);
    }

    if (name) {
      const result = await findManyAddressesByNamePagination(
        name,
        +page,
        +size
      );

      if (result) {
        return successCode(
          res,
          `Get page ${page} of addresses detail with name ${name} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find addresses with name ${name}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getAddressDetail = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (addressId && Number.isInteger(+addressId)) {
      const result = await findOneAddress(+addressId);

      if (result) {
        return successCode(
          res,
          `Get address detail with id ${addressId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find address with id ${addressId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const createAddress = async (req, res) => {
  try {
    const { addressName, province, country } = req.body;

    if (req.file) {
      const { filename } = req.file;

      const addressImage = `${config.IMG_URL}/address/${filename}`;

      const newAddressData = {
        addressName,
        province,
        country,
        addressImage,
      };

      const result = await createOneAddress(newAddressData);

      if (result) {
        console.log(result);
        return successCode(res, `Create a new address successfully!`, result);
      } else {
        return errorCode(res);
      }
    }

    const newAddressData = {
      addressName,
      province,
      country,
    };

    const result = await createOneAddress(newAddressData);

    if (result) {
      return successCode(res, `Create a new address successfully!`, result);
    } else {
      return errorCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const uploadAddressImage = async (req, res) => {
  try {
    if (req.file) {
      const { filename } = req.file;
      const { addressId } = req.params;

      if (addressId && Number.isInteger(+addressId)) {
        const addressFound = await findOneAddress(+addressId);

        if (addressFound) {
          const newAddressImage = `${config.IMG_URL}/address/${filename}`;

          const result = await updateImageOfOneAddress(
            +addressId,
            newAddressImage
          );

          if (result) {
            await removeImage(addressFound.addressImage);

            return successCode(
              res,
              'Upload an address image successfully!',
              result
            );
          } else {
            return failCode(res, 'Cannot upload your image!');
          }
        } else {
          return notFoundCode(res, `Cannot find address with id ${addressId}!`);
        }
      } else {
        return notFoundCode(res);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateAddressDetail = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (addressId && Number.isInteger(+addressId)) {
      const addressFound = await findOneAddress(+addressId);

      if (addressFound) {
        const { addressName, province, country, addressImage } = req.body;

        const newAddressData = {
          addressName,
          province,
          country,
          addressImage,
        };

        const result = await updateOneAddress(+addressId, newAddressData);

        if (result) {
          addressImage &&
            addressImage !== addressFound.addressImage &&
            (await removeImage(addressFound.addressImage));

          return successCode(
            res,
            `Update address with id ${addressId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
      } else {
        return notFoundCode(res, `Cannot find address with id ${addressId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (addressId && Number.isInteger(+addressId)) {
      const addressFound = await findOneAddress(+addressId);

      if (addressFound) {
        const result = await deleteOneAddress(+addressId);

        if (result) {
          await removeImage(addressFound.addressImage);

          return successCode(
            res,
            `Delete address with id ${addressId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
      } else {
        return notFoundCode(res, `Cannot find address with id ${addressId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getAllAddresses,
  getAddressDetail,
  getAddressesByNameSearchedPagination,
  createAddress,
  uploadAddressImage,
  updateAddressDetail,
  deleteAddress,
};
