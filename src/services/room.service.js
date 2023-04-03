const { userWithoutPassword } = require('../utils/exclude');
const prisma = require('../utils/prisma');

const findAllRooms = async () => {
  const result = await prisma.room.findMany({
    include: {
      owner: { select: userWithoutPassword },
      location: true,
      comments: true,
      bookRooms: true,
    },
  });

  return result;
};

const findManyRoomsByLocation = async (locationId) => {
  const result = await prisma.room.findMany({
    where: { locationId },
    include: {
      owner: { select: userWithoutPassword },
      location: true,
      comments: true,
      bookRooms: true,
    },
  });

  return result;
};

const findManyRoomsByNamePagination = async (roomNameKeyword, page, size) => {
  const result = await prisma.room.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      roomName: {
        contains: roomNameKeyword,
      },
    },
    include: {
      owner: { select: userWithoutPassword },
      location: true,
      comments: true,
      bookRooms: true,
    },
  });

  return result;
};

const findOneRoom = async (roomId) => {
  const result = await prisma.room.findUnique({
    where: { roomId },
    include: {
      owner: { select: userWithoutPassword },
      location: true,
      comments: true,
      bookRooms: true,
    },
  });

  return result;
};

const createOneRoom = async (newRoomData) => {
  const result = await prisma.room.create({
    data: newRoomData,
  });

  return result;
};

const updateImageOfOneRoom = async (roomId, newRoomImage) => {
  const result = await prisma.room.update({
    where: { roomId },
    data: { roomImage: newRoomImage },
  });

  return result;
};

const updateOneRoom = async (roomId, newRoomData) => {
  const result = await prisma.room.update({
    where: { roomId },
    data: newRoomData,
  });

  return result;
};

const deleteOneRoom = async (roomId) => {
  await prisma.bookRoom.deleteMany({
    where: { roomBookedId: roomId },
  });

  await prisma.comment.deleteMany({
    where: { roomCommentedId: roomId },
  });

  const result = await prisma.room.delete({
    where: { roomId },
  });

  return result;
};

module.exports = {
  findAllRooms,
  findManyRoomsByLocation,
  findManyRoomsByNamePagination,
  findOneRoom,
  createOneRoom,
  updateImageOfOneRoom,
  updateOneRoom,
  deleteOneRoom,
};
