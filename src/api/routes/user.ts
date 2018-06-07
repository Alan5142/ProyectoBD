import * as Express from "express";

import * as Path from "path";

const staticDir = Path.resolve(".") + "/src/static"

const route = Express.Router();

route.get("/", (req, res) =>
{
	res.json({ejemplo: "true"})
});

route.post("/", (req, res) =>
{
	// TODO handle login
});

route.get("/:userid", (req, res) =>
{
	// TODO are user logged and he wants to see his/her information?

	// TODO return a json string that contains user information
});

export {route as userRoute};