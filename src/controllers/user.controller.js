const {
  findAllUsers,
  findOneUser,
  updateAvatarOfOneUser,
  deleteOneUser,
  updateOneUser,
  findManyUsersByName,
  findOneUserSelectRoomsOwned,
  findManyUsersByNamePagination,
} = require('../services/user.service');
const config = require('../utils/config');
const { removeImage } = require('../utils/removeImage');
const {
  successCode,
  errorCode,
  failCode,
  notFoundCode,
} = require('../utils/response');
const { validatePaginationQueries } = require('../utils/validation');

const getAllUsers = async (_req, res) => {
  try {
    const result = await findAllUsers();

    if (result) {
      return successCode(res, 'Get all users detail successfully!', result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getUsersByNameSearched = async (req, res) => {
  try {
    const { userName } = req.query;

    if (userName) {
      const result = await findManyUsersByName(userName);

      if (result) {
        return successCode(
          res,
          `Get all users detail with name ${userName} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find user with name ${userName}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getUsersByNameSearchedPagination = async (req, res) => {
  try {
    const { name, page, size } = req.query;

    if (!validatePaginationQueries(page, size)) {
      return failCode(res);
    }

    if (name) {
      const result = await findManyUsersByNamePagination(name, +page, +size);

      if (result) {
        return successCode(
          res,
          `Get page ${page} of users detail with name ${name} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find user with name ${name}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && Number.isInteger(+userId)) {
      const result = await findOneUser(+userId);

      if (result) {
        return successCode(
          res,
          `Get user detail with id ${userId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find user with id ${userId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const uploadUserAvatar = async (req, res) => {
  try {
    if (req.file) {
      const { filename } = req.file;
      const { userId } = req.params;

      if (userId && Number.isInteger(+userId)) {
        const userFound = await findOneUser(+userId);

        if (userFound) {
          const newUserAvatar = `${config.IMG_URL}/avatar/${filename}`;

          const result = await updateAvatarOfOneUser(+userId, newUserAvatar);

          if (result) {
            await removeImage(userFound.avatar);

            return successCode(
              res,
              'Update your avatar image successfully!',
              result
            );
          } else {
            return failCode(res, 'Cannot upload your image!');
          }
        } else {
          return notFoundCode(res, `Cannot find user with id ${userId}!`);
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

const updateUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && Number.isInteger(+userId)) {
      const userFound = await findOneUser(+userId);

      if (userFound) {
        const { userName, email, phone, birthday, gender } = req.body;

        const newUserData = {
          userName,
          email,
          phone,
          birthday: new Date(birthday),
          gender,
        };

        const result = await updateOneUser(+userId, newUserData);

        if (result) {
          return successCode(
            res,
            `Update user with id ${userId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
      } else {
        return notFoundCode(res, `Cannot find user with id ${userId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && Number.isInteger(+userId)) {
      const userFound = await findOneUserSelectRoomsOwned(+userId);

      if (userFound) {
        const result = await deleteOneUser(+userId);

        if (result) {
          userFound?.roomsOwned?.forEach(
            async (room) => await removeImage(room.roomImage)
          );

          await removeImage(userFound.avatar);

          return successCode(
            res,
            `Delete user with id ${userId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
      } else {
        return notFoundCode(res, `Cannot find user with id ${userId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getAllUsers,
  getUsersByNameSearched,
  getUsersByNameSearchedPagination,
  getUserDetail,
  uploadUserAvatar,
  updateUserDetail,
  deleteUser,
};
