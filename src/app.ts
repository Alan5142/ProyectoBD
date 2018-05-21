"use strict";

import * as Express from "express";

const app = Express();
const port = 5010;


app.get('/', (req, res, next) => 
{
    res.json({
        name: ":D"
    });
});


app.listen(port, () =>
{
    console.log("App is listening");
});

export {app};