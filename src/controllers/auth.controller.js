const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');
const { createToken } = require('../utils/jwtoken');
const {
  errorCode,
  failCode,
  successCode,
  notFoundCode,
} = require('../utils/response');
const { findOneUserByEmail } = require('../services/user.service');

const register = async (req, res) => {
  try {
    const { userName, email, password, phone, birthday, gender, role } =
      req.body;

    const isEmailExisted = await findOneUserByEmail(email);

    if (isEmailExisted) {
      return failCode(res, 'Email already exists!');
    }

    const newUser = {
      userName,
      email,
      password: bcrypt.hashSync(password, 10),
      phone,
      birthday: new Date(birthday),
      gender,
      role,
    };

    await prisma.user.create({
      data: newUser,
    });

    return successCode(res, 'Register successfully!', req.body);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await findOneUserByEmail(email);

    if (userFound) {
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        userFound.password
      );

      if (isPasswordCorrect) {
        const token = createToken(userFound.userId);

        return successCode(res, 'Login successfully!', token);
      } else {
        return failCode(res, 'Wrong combination of email and password!');
      }
    }

    return notFoundCode(res, 'Email does not exist!');
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = { register, login };
