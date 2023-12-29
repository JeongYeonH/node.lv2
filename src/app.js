import express from 'express'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api', [])

app.listen(port, () => {
    console.log(port, "서버에 연결되었습니다.")
})