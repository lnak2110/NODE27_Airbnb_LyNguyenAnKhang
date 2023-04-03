const express = require('express');
const { notFoundCode } = require('../utils/response');
const addressRoute = require('./address.route');
const authRoute = require('./auth.route');
const bookRoomRoute = require('./bookRoom.route');
const roomRoute = require('./room.route');
const userRoute = require('./user.route');
const commentRoute = require('./comment.route');

const rootRoute = express.Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/addresses', addressRoute);
rootRoute.use('/rooms', roomRoute);
rootRoute.use('/users', userRoute);
rootRoute.use('/bookrooms', bookRoomRoute);
rootRoute.use('/comments', commentRoute);
rootRoute.use('*', (_req, res) => notFoundCode(res));

module.exports = rootRoute;
