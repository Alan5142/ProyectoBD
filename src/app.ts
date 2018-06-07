"use strict";


import * as Express   from "express";
import {developRoute} from "./api/routes/desarrollo";
import {loginRoute}   from "./api/routes/login";
import {userRoute}    from "./api/routes/user";

const app = Express();
const port = 5050;
const host = "0.0.0.0";
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Requests to "web_page/api/user" are handled by userRoute
app.use("/api/user", userRoute);

app.use("/api/auth", loginRoute);

app.use("/api/private/desarrollo", developRoute);

app.listen(port, host, () =>
{
	console.log("App is listening");
});
