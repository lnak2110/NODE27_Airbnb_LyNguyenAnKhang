const { findOneAddress } = require('../services/address.service');
const {
  createOneRoom,
  updateImageOfOneRoom,
  findAllRooms,
  findOneRoom,
  updateOneRoom,
  deleteOneRoom,
  findManyRoomsByLocation,
  findManyRoomsByNamePagination,
} = require('../services/room.service');
const config = require('../utils/config');
const { verifyToken } = require('../utils/jwtoken');
const { removeImage } = require('../utils/removeImage');
const {
  successCode,
  errorCode,
  failCode,
  notFoundCode,
} = require('../utils/response');
const { validatePaginationQueries } = require('../utils/validation');

const getAllRooms = async (_req, res) => {
  try {
    const result = await findAllRooms();

    if (result) {
      return successCode(res, 'Get all rooms detail successfully!', result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getRoomsByLocation = async (req, res) => {
  try {
    const { locationId } = req.query;

    if (locationId && Number.isInteger(+locationId)) {
      const result = await findManyRoomsByLocation(+locationId);

      if (result) {
        return successCode(
          res,
          `Get all rooms detail with location id ${locationId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find location with id ${locationId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getRoomsByNameSearchedPagination = async (req, res) => {
  try {
    const { name, page, size } = req.query;

    if (!validatePaginationQueries(page, size)) {
      return failCode(res);
    }

    if (name) {
      const result = await findManyRoomsByNamePagination(name, +page, +size);

      if (result) {
        return successCode(
          res,
          `Get page ${page} of rooms detail with name ${name} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find rooms with name ${name}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getRoomDetail = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (roomId && Number.isInteger(+roomId)) {
      const result = await findOneRoom(+roomId);

      if (result) {
        return successCode(
          res,
          `Get room detail with id ${roomId} successfully!`,
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

const createRoom = async (req, res) => {
  try {
    const ownerId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;

    const {
      roomName,
      description,
      price,
      totalBedrooms,
      totalBeds,
      totalBathrooms,
      hasWashingMachine,
      hasIron,
      hasTv,
      hasAirCon,
      hasWifi,
      hasKitchen,
      hasParkingLot,
      hasPool,
      locationId,
    } = req.body;

    if (req.file) {
      const { filename } = req.file;

      const roomImage = `${config.IMG_URL}/room/${filename}`;

      const addressFound = await findOneAddress(locationId);

      if (!addressFound) {
        return notFoundCode(res, `Cannot find address with id ${locationId}!`);
      }

      const newRoomData = {
        roomName,
        description,
        price,
        totalBedrooms,
        totalBeds,
        totalBathrooms,
        hasWashingMachine,
        hasIron,
        hasTv,
        hasAirCon,
        hasWifi,
        hasKitchen,
        hasParkingLot,
        hasPool,
        roomImage,
        locationId,
        ownerId,
      };

      const result = await createOneRoom(newRoomData);

      if (result) {
        return successCode(res, `Create a new room successfully!`, result);
      } else {
        return errorCode(res);
      }
    }

    const newRoomData = {
      roomName,
      description,
      price,
      totalBedrooms,
      totalBeds,
      totalBathrooms,
      hasWashingMachine,
      hasIron,
      hasTv,
      hasAirCon,
      hasWifi,
      hasKitchen,
      hasParkingLot,
      hasPool,
      locationId,
      ownerId,
    };

    const result = await createOneRoom(newRoomData);

    if (result) {
      return successCode(res, `Create a new room successfully!`, result);
    } else {
      return errorCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const uploadRoomImage = async (req, res) => {
  try {
    if (req.file) {
      const { filename } = req.file;
      const { roomId } = req.params;

      if (roomId && Number.isInteger(+roomId)) {
        const roomFound = await findOneRoom(+roomId);

        if (roomFound) {
          const newRoomImage = `${config.IMG_URL}/room/${filename}`;

          const result = await updateImageOfOneRoom(+roomId, newRoomImage);

          if (result) {
            await removeImage(roomFound.roomImage);

            return successCode(
              res,
              'Upload a room image successfully!',
              result
            );
          } else {
            return failCode(res, 'Cannot upload your image!');
          }
        } else {
          return notFoundCode(res, `Cannot find room with id ${roomId}!`);
        }
      } else {
        return notFoundCode(res);
      }
    }

    return failCode(res, 'Please choose a valid image file!');
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateRoomDetail = async (req, res) => {
  try {
    const { roomId } = req.params;

    const ownerId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;

    if (roomId && Number.isInteger(+roomId)) {
      const roomFound = await findOneRoom(+roomId);

      if (roomFound) {
        const {
          roomName,
          description,
          price,
          totalBedrooms,
          totalBeds,
          totalBathrooms,
          hasWashingMachine,
          hasIron,
          hasTv,
          hasAirCon,
          hasWifi,
          hasKitchen,
          hasParkingLot,
          hasPool,
          roomImage,
          locationId,
        } = req.body;

        const addressFound = await findOneAddress(locationId);

        if (!addressFound) {
          return notFoundCode(
            res,
            `Cannot find address with id ${locationId}!`
          );
        }

        const newRoomData = {
          roomName,
          description,
          price,
          totalBedrooms,
          totalBeds,
          totalBathrooms,
          hasWashingMachine,
          hasIron,
          hasTv,
          hasAirCon,
          hasWifi,
          hasKitchen,
          hasParkingLot,
          hasPool,
          roomImage,
          locationId,
          ownerId,
        };

        const result = await updateOneRoom(+roomId, newRoomData);

        if (result) {
          roomImage &&
            roomImage !== roomFound.roomImage &&
            (await removeImage(roomFound.roomImage));

          return successCode(
            res,
            `Update room with id ${roomId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
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

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (roomId && Number.isInteger(+roomId)) {
      const roomFound = await findOneRoom(+roomId);

      if (roomFound) {
        const result = await deleteOneRoom(+roomId);

        if (result) {
          await removeImage(roomFound.roomImage);

          return successCode(
            res,
            `Delete room with id ${roomId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
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

module.exports = {
  getAllRooms,
  getRoomsByLocation,
  getRoomsByNameSearchedPagination,
  getRoomDetail,
  createRoom,
  uploadRoomImage,
  updateRoomDetail,
  deleteRoom,
};
