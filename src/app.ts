"use strict";

import * as Express from "express";
import {userRoute} from './api/routes/User';

const app = Express();
const port = 5050;
const host = '0.0.0.0';
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/api/login', (req, res) =>
{
    console.log(req.body);
});

// Requests to "web_page/api/user" are handled by userRoute
app.use('/api/user', userRoute);

app.listen(port, host, () =>
{
    console.log("App is listening");
});
