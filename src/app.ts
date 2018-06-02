"use strict";

import * as Express from "express";
import {userRoute} from './api/routes/User';
import * as Path from 'path';
import {database} from './utility/Database';

const app = Express();
const port = 80;
const host = '0.0.0.0';
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) =>
{
    res.sendFile('./static/html/view.html', {root: Path.resolve(".")});
    database.query('select * from proyecto.cliente', (err, result) =>
    {
        console.log(err);
        console.log(result);
    });
});

app.post('/login', (req, res) =>
{
    console.log(req.body);
});

// Requests to "web_page/api/user" are handled by userRoute
app.use('/api/user', userRoute);

app.listen(port, host, () =>
{
    console.log("App is listening");
});
