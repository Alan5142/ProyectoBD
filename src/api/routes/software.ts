import * as Express          from "express";
import * as Jwt              from "jsonwebtoken";
import * as Modelos          from "../../utility/models";
import {IDesarrolloInstance} from "../../utility/models";

const config = require("./../../../config.json");

const route = Express.Router();

route.use("/", (req, res, next) =>
{
	const token = req.body.token || req.query.token || req.headers["token"];
	
	if (!token)
	{
		res.status(401).json(
			{
				message: "Unauthorized"
			}
		)
		return;
	}
	Jwt.verify(token, config.secret, (err, decoded) =>
	{
		if (!err)
		{
			req.body.decodedToken = decoded;
			next();
			return;
		}
		if ((err as Jwt.TokenExpiredError) !== undefined)
		{
			res.status(401).json(
				{
					Mensaje: "Token expirado"
				}
			)
			return;
		}
		res.status(401).json(
			{
				Mensaje: "Acceso no autorizado"
			}
		)
	});
});

route.get("/", (req, res, next) =>
{
	const getDesarrollos = (desarrollo: IDesarrolloInstance[]) =>
	{
		let result = [];
		res.status(200).json(
			{
				status: 200,
				message: "OK",
				desarrollos: desarrollo
			}
		);
	};
	Modelos.Desarrollo.findAll().then(getDesarrollos);
});

route.post("/", (req, res) =>
{

});

route.delete("/", (req, res) =>
{
	if (!req.body.idDesarrollo)
	{
		return res.status(500).json(
			{
				message: "Desarrollo no existe"
			}
		)
	}
});

export {route as softwareRoute};
