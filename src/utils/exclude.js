const userWithoutPassword = {
  userId: true,
  userName: true,
  email: true,
  phone: true,
  birthday: true,
  avatar: true,
  gender: true,
};

const userWithoutPasswordWithRole = {
  userId: true,
  userName: true,
  email: true,
  phone: true,
  birthday: true,
  avatar: true,
  gender: true,
  role: true,
};

module.exports = {
  userWithoutPassword,
  userWithoutPasswordWithRole,
};
