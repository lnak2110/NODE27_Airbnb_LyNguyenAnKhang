const {
  findAllBookRooms,
  findManyBookRoomsByUserBook,
  findOneBookRoom,
  createOneBookRoom,
  updateOneBookRoom,
  deleteOneBookRoom,
} = require('../services/bookRoom.service');
const { findOneRoom } = require('../services/room.service');
const { verifyToken } = require('../utils/jwtoken');
const { successCode, errorCode, notFoundCode } = require('../utils/response');

const getAllBookRooms = async (_req, res) => {
  try {
    const result = await findAllBookRooms();

    if (result) {
      return successCode(
        res,
        'Get all book rooms detail successfully!',
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getBookRoomsByUserBook = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && Number.isInteger(+userId)) {
      const result = await findManyBookRoomsByUserBook(+userId);

      if (result) {
        return successCode(
          res,
          `Get all book rooms detail with user id ${userId} successfully!`,
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

const getBookRoomDetail = async (req, res) => {
  try {
    const { bookRoomId } = req.params;

    if (bookRoomId && Number.isInteger(+bookRoomId)) {
      const result = await findOneBookRoom(+bookRoomId);

      if (result) {
        return successCode(
          res,
          `Get book room detail with id ${bookRoomId} successfully!`,
          result
        );
      } else {
        return notFoundCode(
          res,
          `Cannot find book room with id ${bookRoomId}!`
        );
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const createBookRoom = async (req, res) => {
  try {
    const userBookId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;

    const { checkinDate, checkoutDate, totalGuests, roomBookedId } = req.body;

    const roomFound = await findOneRoom(roomBookedId);

    if (roomFound) {
      const newBookRoomData = {
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        totalGuests,
        userBookId,
        roomBookedId,
      };

      const result = await createOneBookRoom(newBookRoomData);

      if (result) {
        return successCode(res, `Create a new book room successfully!`, result);
      } else {
        return errorCode(res);
      }
    } else {
      return notFoundCode(res, `Cannot find room with id ${roomBookedId}!`);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateBookRoomDetail = async (req, res) => {
  try {
    const { bookRoomId } = req.params;

    const userBookId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;

    if (bookRoomId && Number.isInteger(+bookRoomId)) {
      const bookRoomFound = await findOneBookRoom(+bookRoomId);

      if (bookRoomFound) {
        const { checkinDate, checkoutDate, totalGuests, roomBookedId } =
          req.body;

        const roomFound = await findOneRoom(roomBookedId);

        if (roomFound) {
          const newBookRoomData = {
            checkinDate: new Date(checkinDate),
            checkoutDate: new Date(checkoutDate),
            totalGuests,
            userBookId,
            roomBookedId,
          };

          const result = await updateOneBookRoom(+bookRoomId, newBookRoomData);

          return successCode(
            res,
            `Update book room with id ${bookRoomId} successfully!`,
            result
          );
        } else {
          return notFoundCode(res, `Cannot find room with id ${roomBookedId}!`);
        }
      } else {
        return notFoundCode(
          res,
          `Cannot find book room with id ${bookRoomId}!`
        );
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteBookRoom = async (req, res) => {
  try {
    const { bookRoomId } = req.params;

    if (bookRoomId && Number.isInteger(+bookRoomId)) {
      const bookRoomFound = await findOneBookRoom(+bookRoomId);

      if (bookRoomFound) {
        const result = await deleteOneBookRoom(+bookRoomId);

        return successCode(
          res,
          `Delete book room with id ${bookRoomId} successfully!`,
          result
        );
      } else {
        return notFoundCode(
          res,
          `Cannot find book room with id ${bookRoomId}!`
        );
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getAllBookRooms,
  getBookRoomsByUserBook,
  getBookRoomDetail,
  createBookRoom,
  updateBookRoomDetail,
  deleteBookRoom,
};
