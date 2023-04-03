const prisma = require('../utils/prisma');

const findAllAddresses = async () => {
  const result = await prisma.address.findMany();

  return result;
};

const findManyAddressesByNamePagination = async (
  addressNameKeyword,
  page,
  size
) => {
  const result = await prisma.address.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      addressName: {
        contains: addressNameKeyword,
      },
    },
  });

  return result;
};

const findOneAddress = async (addressId) => {
  const result = await prisma.address.findUnique({
    where: { addressId },
  });

  return result;
};

const createOneAddress = async (newAddressData) => {
  const result = await prisma.address.create({
    data: newAddressData,
  });

  return result;
};

const updateImageOfOneAddress = async (addressId, newAddressImage) => {
  const result = await prisma.address.update({
    where: { addressId },
    data: { addressImage: newAddressImage },
  });

  return result;
};

const updateOneAddress = async (addressId, newAddressData) => {
  const result = await prisma.address.update({
    where: { addressId },
    data: newAddressData,
  });

  return result;
};

const deleteOneAddress = async (addressId) => {
  const result = await prisma.address.delete({
    where: { addressId },
  });

  return result;
};

module.exports = {
  findAllAddresses,
  findManyAddressesByNamePagination,
  findOneAddress,
  createOneAddress,
  updateImageOfOneAddress,
  updateOneAddress,
  deleteOneAddress,
};
