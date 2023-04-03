const { userWithoutPassword } = require('../utils/exclude');
const prisma = require('../utils/prisma');

const findAllBookRooms = async () => {
  const result = await prisma.bookRoom.findMany({
    include: {
      userBook: { select: userWithoutPassword },
      roomBooked: true,
    },
  });

  return result;
};

const findManyBookRoomsByUserBook = async (userId) => {
  const result = await prisma.bookRoom.findMany({
    where: { userBookId: userId },
    include: {
      userBook: { select: userWithoutPassword },
      roomBooked: true,
    },
  });

  return result;
};

const findOneBookRoom = async (bookRoomId) => {
  const result = await prisma.bookRoom.findUnique({
    where: { bookRoomId },
    include: {
      userBook: { select: userWithoutPassword },
      roomBooked: true,
    },
  });

  return result;
};

const createOneBookRoom = async (newBookRoomData) => {
  const result = await prisma.bookRoom.create({
    data: newBookRoomData,
  });

  return result;
};

const updateOneBookRoom = async (bookRoomId, newBookRoomData) => {
  const result = await prisma.bookRoom.update({
    where: { bookRoomId },
    data: newBookRoomData,
  });

  return result;
};

const deleteOneBookRoom = async (bookRoomId) => {
  const result = await prisma.bookRoom.delete({
    where: { bookRoomId },
  });

  return result;
};

module.exports = {
  findAllBookRooms,
  findManyBookRoomsByUserBook,
  findOneBookRoom,
  createOneBookRoom,
  updateOneBookRoom,
  deleteOneBookRoom,
};
