import express from 'express'
import config from './config';
import initDB from './config/db';

const app = express()
const port = config.port;

// -- Middleware -- //
app.use(express.json());

// DB intialized
initDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
