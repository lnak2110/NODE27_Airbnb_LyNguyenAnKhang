const yup = require('yup');
const { parse, isDate } = require('date-fns');
const { failCode } = require('./response');

const registerSchema = yup.object({
  body: yup.object({
    userName: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    password: yup.string().trim().min(4).max(10).required(),
    phone: yup
      .string()
      .trim()
      .matches(/((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/)
      .required(),
    birthday: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, 'yyyy-MM-dd', new Date());

        return parsedDate;
      })
      .max(new Date())
      .required(),
    gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']),
    role: yup.string().oneOf(['ADMIN', 'USER']),
  }),
});

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().trim().email().required(),
    password: yup.string().trim().min(4).max(10).required(),
  }),
});

const addressSchema = yup.object({
  body: yup.object({
    addressName: yup.string().trim().required(),
    province: yup.string().trim().required(),
    country: yup.string().trim().required(),
    addressImage: yup.string().trim().url(),
  }),
});

const roomSchema = yup.object({
  body: yup.object({
    roomName: yup.string().trim().required(),
    description: yup.string().trim().required(),
    price: yup.number().integer().min(1).required(),
    totalBedrooms: yup.number().integer().min(0).required(),
    totalBeds: yup.number().integer().min(0).required(),
    totalBathrooms: yup.number().integer().min(0).required(),
    hasWashingMachine: yup.boolean().required(),
    hasIron: yup.boolean().required(),
    hasTv: yup.boolean().required(),
    hasAirCon: yup.boolean().required(),
    hasWifi: yup.boolean().required(),
    hasKitchen: yup.boolean().required(),
    hasParkingLot: yup.boolean().required(),
    hasPool: yup.boolean().required(),
    roomImage: yup.string().trim().url(),
  }),
});

const userSchema = yup.object({
  body: yup.object({
    userName: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    phone: yup
      .string()
      .trim()
      .matches(/((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/)
      .required(),
    birthday: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, 'yyyy-MM-dd', new Date());

        return parsedDate;
      })
      .max(new Date())
      .required(),
    gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']),
  }),
});

const bookRoomSchema = yup.object({
  body: yup.object({
    checkinDate: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, 'yyyy-MM-dd', new Date());

        return parsedDate;
      })
      .min(new Date(Date.now() - 86400000)),
    checkoutDate: yup.date().min(yup.ref('checkinDate')),
    totalGuests: yup.number().integer().min(1).required(),
    roomBookedId: yup.number().integer().min(1).required(),
  }),
});

const commentSchema = yup.object({
  body: yup.object({
    content: yup.string().trim().required(),
    roomCommentedId: yup.number().integer().min(1).required(),
  }),
});

const updateCommentSchema = yup.object({
  body: yup.object({
    content: yup.string().trim().required(),
  }),
});

const validateBody = (schema) => (req, res, next) => {
  try {
    schema.validateSync({
      body: req.body,
    });

    next();
  } catch (error) {
    console.log(error);
    return failCode(res, error.message);
  }
};

const validatePaginationQueries = (page, size) => {
  const pageToNum = +page;
  const sizeToNum = +size;

  return (
    pageToNum &&
    sizeToNum &&
    Number.isInteger(pageToNum) &&
    Number.isInteger(sizeToNum) &&
    pageToNum >= 0 &&
    sizeToNum >= 0
  );
};

module.exports = {
  registerSchema,
  loginSchema,
  addressSchema,
  roomSchema,
  userSchema,
  bookRoomSchema,
  commentSchema,
  updateCommentSchema,
  validateBody,
  validatePaginationQueries,
};
