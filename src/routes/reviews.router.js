import express from "express";

import {prisma} from '../utils/prisma/index.js'

const router = express.Router()

router.get('/', async(req, res, next) => {
    return res.status(200).json({messgae:'hi'})
})

export default router