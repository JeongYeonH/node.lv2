import express from 'express'


const app = express();
const port = 3000;



app.use(express.json());
app.use(express.urlencoded({extended:true}));

const router = express.Router();

router.get('/', (req, res) =>{
    return res.json({message: 'Hi!'});
});

app.use('/api', [router]);

app.listen(port, () => {
    console.log(port, "서버에 연결되었습니다.")
})