import express, { Request, Response } from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import { data } from './data'

console.log(data.age)

const app = express()
const IPlist = ['http://localhost:3000/', 'http://127.0.0.1:3000/']

const accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'access.log'), { flags: 'a' })
app.use(morgan('short', { stream: accessLogStream }))

app.use((req: Request, res: Response, next) => {
    if (IPlist.includes(req.headers.referer as string)) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.header('Access-Control-Allow-Methods', '*')
        res.header('Content-Type', 'application/json;charset=utf-8')
    }
    next()
})

app.use('/', (req: Request, res: Response) => {
    fs.appendFile('./data.txt', 'data \n', 'utf8', (error) => {
        if (error) throw error
    })
    res.send({ code: 200, message: '数据' })
    const write = fs.createWriteStream('./test.txt', {
        flags: 'a',
    })
    write.write('123 \n')
})

app.listen(4000, () => {
    console.log('http://localhost:4000')
})
