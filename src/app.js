import express from 'express';
import reviewsRouter from './routes/reviews.router.js'
import commentsRouter from './routes/comments.router.js'

const app = express();
const PORT = 3017;

app.use(express.json());
app.use('/api', [reviewsRouter, commentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
