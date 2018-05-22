"use strict";

import * as Express from "express";
import {userRoute} from './api/routes/User';

const app = Express();
const port = 5010;


app.get('/', (req, res, next) =>
{
    res.json({name: "Empresa"});
});

// Requests to "web_page/user" are handled by userRoute
app.use('/user', userRoute);

app.listen(port, () =>
{
    console.log("App is listening");
});

export {app};
