import * as Express from "express";
import * as Jwt     from "jsonwebtoken";
import * as Modelos from "../../utility/models";

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
		if (err.name === "Jwt.TokenExpiredError")
		{
			res.status(401).json(
				{
					Mensaje: "Token expirado"
				}
			);
			return;
		}
		res.status(401).json(
			{
				Mensaje: "Acceso no autorizado"
			}
		)
	});
});

route.get("/", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	
	// TODO Stark, ¿todos los empleados tienen permiso de ver quienes hacen que cosa en los desarrollos?
	const getDesarrollos = (desarrollo: Modelos.IDesarrolloInstance[]) =>
	{
		res.status(200).json(
			{
				message: "OK",
				desarrollos: desarrollo
			}
		);
	};
	Modelos.Desarrollo.findAll().then(getDesarrollos);
});

route.get("/:idDesarrollo", (req, res) =>
{
	const obtenerDesarrolloConId = (desarrollo: Modelos.IDesarrolloInstance) =>
	{
		return res.status(200).json(
			{
				mensaje: "OK",
				desarrollo: desarrollo
			}
		)
	}
	Modelos.Desarrollo.findOne(
		{
			where:
				{
					Clave_desarrollo: req.params.idDesarrollo
				}
		}
	).then(obtenerDesarrolloConId);
});

route.post("/", (req, res) =>
{
	// TODO añadir nuevos desarrollos, asegurar que solo un tipo de usuario especifico puede hacerlo
	if (req.body.decodedToken.Puesto !== "Supervisor")
	{
		return res.status(401).json(
			{
				mensaje: "No tienes permiso de hacer esto"
			}
		)
	}
	
	const desarrolloAInsertar = req.body.desarrollo;
	
	if (!desarrolloAInsertar)
	{
		return res.status(400).json(
			{
				mensaje: "Debes dar los datos para el nuevo desarrollo"
			}
		);
	}
	
	Modelos.Desarrollo.create(
		{
			Clave_desarrollo: 10,
			Tarea: desarrolloAInsertar.tarea,
			Fecha_Inicio: desarrolloAInsertar.fechaInicio,
			Fecha_Termino: desarrolloAInsertar.fechaTermino,
			Software: desarrolloAInsertar.software, // son generados por el frontend
			Empleado: desarrolloAInsertar.empleado
		}
	)

});

route.delete("/", (req, res) =>
{
	// TODO ¿quién puede eliminar de la tabla desarrollo?
	if (req.body.decodedToken.Puesto !== "Gerente")
	{
		return res.status(401).json(
			{
				mensaje: "No tienes permiso de hacer esto"
			}
		)
	}
	if (!req.body.idDesarrollo)
	{
		return res.status(500).json(
			{
				message: "Desarrollo no existe"
			}
		)
	}
	Modelos.Desarrollo.destroy(
		{
			where:
				{
					Clave_desarrollo: req.body.idDesarrollo
				}
		}
	)
});

export {route as developRoute};
