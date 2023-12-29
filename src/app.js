import express from 'express'
import reviewsRouter from './routes/reviews.router'
import commentsRouter from './routes/comments.router'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api', [commentsRouter, reviewsRouter])

app.listen(port, () => {
    console.log(port, "서버에 연결되었습니다.")
})