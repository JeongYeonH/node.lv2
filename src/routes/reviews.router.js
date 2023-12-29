import express from "express";

import {prisma} from '../utils/prisma/index.js'

const router = express.Router()

//목록조회
router.get('/reviews', async(req, res, next) => {
    try{
        const data = await prisma.reviews.findMany({})
        return res.status(200).json(data)
    } catch (error){
        return res.status(500).json({message: error.message})
    }   
})

//상세조회
router.get('/reviews/:reviewId', async(req, res, next) => {
    const {reviewId} = req.params
    try{
        const review = await prisma.reviews.findFirst({
            where: {Id: +reviewId},
            select: {
                Id:true,
                bookTitle:true,
                title:true,
                content:true,
                author:true,
                starRating:true,
                createdAt:true,
                updatedAt:true
            }
        })
        if(!review){
            return res.status(400).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
        }
        return res.status(200).json({data: review})
    } catch(error){
        return res.status(500).json({message: error.message})

    }
    
})

//리뷰등록
router.post('/reviews', async(req, res, next) => {
    const {bookTitle, title, content, starRating, author, password} = req.body
    try{
        if(!bookTitle || !title || !content || starRating === undefined || !author || !password){
            return res.status(400).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
        }
    
        await prisma.reviews.create({
            data: {bookTitle, title, content, starRating, author, password}
        })
        
        return res.status(200).json({message: "책 리뷰를 등록하였습니다."})
    } catch(error){
        return res.status(500).json({message:error.message})
    }
})

//리뷰수정
router.put('/reviews/:reviewId', async(req, res, next) => {
    const {reviewId} = req.params
    const {bookTitle, title, content, starRating, password} = req.body
    if(reviewId === undefined || !bookTitle || !title || !content || !starRating || !password){
        return res.status(400).json({errorMessage:"데이터 형식이 올바르지 않습니다"})
    }
    try{
        const review = await prisma.reviews.findUnique({
            where: {Id: +reviewId},
        })
        if(!review){
            return res.status(400).json({errorMessage: '존재하지 않는 리뷰입니다.'})
        } else if(password !== review.password){
            return res.status(401).json({errorMessage:"비밀번호가 일치하지 않습니다"})
        }

        await prisma.reviews.update({
            data: { bookTitle, title, content, starRating},
            where:{
                Id: +reviewId,
                password
            }
        })
        return res.status(200).json({message: '책 리뷰를 수정하였습니다.'})
    } catch(error){
        return res.status(500).json({message:error.message})
    }
})

//리뷰삭제
router.delete('/reviews/:reviewId', async(req, res, next) => {
    const {reviewId} = req.params
    const {password} = req.body
    if(!reviewId || !password){
        return res.status(400).json({errorMessage:'데이터 형식이 올바르지 않습니다.'})
    }
    try{
        const review = await prisma.reviews.findFirst({where: {Id : +reviewId}})
        if (!review){
            return res.status(400).json({errorMessage: '존재하지 않는 리뷰입니다.'})
        } else if(review.password !== password){
            return res.status(401).json({message: '비밀번호가 일치하지 않습니다'})
        }
        await prisma.reviews.delete({where: {Id: +reviewId}})
        return res.status(200).json({message:'책 리뷰를 삭제하였습니다'})
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

export default router