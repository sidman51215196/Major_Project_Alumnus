import express from 'express';
import {login, verify} from '../controllers/authController.js';
import verifyUser from '../middleware/authMiddleware.js';

const route = express.Router();


route.post('/login',login)
route.get('/verify', verifyUser, verify)

export default route;