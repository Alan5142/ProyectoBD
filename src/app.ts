"use strict";


import * as Express from "express";
import * as Jwt from "jsonwebtoken";
// rutas
import {desarrolloRoute} from "./api/routes/desarrollo";
import {loginRoute} from "./api/routes/login";
import {canceladosTardeRoute} from "./api/routes/cancelados_tarde";
import {perfilesPasadosRoute} from "./api/routes/perfiles_pasados";
import {privateSoftwareRoute, softwareRoute} from "./api/routes/software";
import {empleadoRoute} from "./api/routes/empleado";
import {perfilRoute} from "./api/routes/perfil";
import {entradaSalidaRoute} from "./api/routes/entrada_salida";

const config = require("./../config.json");
const app = Express();
const port = 5050;
const host = "0.0.0.0";
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get("/", (req, res) =>
{
	res.status(200).json(
		{
			mensaje : "OK"
		}
	)
});

app.use("/api/auth", loginRoute);

app.use("/api/private", (req, res, next) =>
{
	const token = req.body.token || req.query.token || req.headers["token"];

	if (!token)
	{
		res.status(401).json(
			{
				message : "Unauthorized"
			}
		);
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
		if (err.name === "Jwt.TokenExpiredError")
		{
			res.status(401).json(
				{
					Mensaje : "Token expirado"
				}
			);
			return;
		}
		res.status(401).json(
			{
				Mensaje : "Acceso no autorizado"
			}
		)
	});
});

app.use("/api/private/desarrollo", desarrolloRoute);

app.use("/api/software", softwareRoute);

app.use("/api/private/software", privateSoftwareRoute);

app.use("/api/private/cancelados_tarde", canceladosTardeRoute);

app.use("/api/private/perfilesPasados", perfilesPasadosRoute);

app.use("/api/private/empleado", empleadoRoute);

app.use("/api/private/perfil", perfilRoute);

app.use("/api/private/entrada_salida", entradaSalidaRoute);

app.listen(port, host, () =>
{
	console.log("App is listening");
});
