const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const intentRoute = require('./routes/intent');
require('dotenv').config();

const port = 4000;

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!!'));

app.use('/intent', intentRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
