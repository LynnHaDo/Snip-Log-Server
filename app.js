require('dotenv').config();

import express from 'express'
import cors from 'cors'

const app = express() 
const PORT = process.env.PORT
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN

const corsOptions = {
    origin: CLIENT_ORIGIN
}

app.use(cors(corsOptions));
app.use(express.json());

app.post('/run', (req, res) => {
    // docker container setup
})

app.listen(PORT, () => {
    console.log('code runner listening on port 8080')
})