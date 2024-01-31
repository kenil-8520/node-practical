const express = require('express')
const cors = require('cors')
const authrouter = require('./routers/authRouters.js')


const app = express()
var corOptions = {
    origin: 'https://localhost:8081'
}

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) =>{
    res.json({message : "API working"})
})

app.use('/api', authrouter)

const PORT = 8080


app.listen(PORT, () => {
    console.log("server running on http://localhost:8080");
})
