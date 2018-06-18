import * as Express from "express";
import * as Modelos from "../../utility/models";

const route = Express.Router();

route.get("/", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	if (decodedToken.Puesto !== "Supervisor" || decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}
	const getDesarrollos = (desarrollo : Modelos.IDesarrolloInstance[]) =>
	{
		res.status(200).json(
			{
				message : "OK",
				desarrollos : desarrollo
			}
		);
	};
	Modelos.Desarrollo.findAll().then(getDesarrollos);
});

route.get("/empleado/:idEmpleado", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	if (decodedToken.Puesto !== "Administrador" && decodedToken.Puesto !== "RRHH" && (decodedToken.Puesto !== "Desarrollador" && decodedToken.numUsuario !== req.params.nomina))
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}
	const getDesarrollos = (desarrollo : any) =>
	{
		res.status(200).json(
			{
				mensaje : "OK",
				desarrollos : desarrollo
			}
		);
	};
	Modelos.Software.findAll({
		attributes : ['Fecha_Inicio', 'Fecha_Termino', 'Nombre', 'Descripcion', 'Estado'],
		include : [
			{
				attributes : ['Tarea'],
				model : Modelos.Desarrollo,
				required : true,
				where : {Empleado : req.params.idEmpleado}
			}]
	}).then(getDesarrollos);
});

route.get("/buscar/:idDesarrollo", (req, res) =>
{
	const decodedToken = req.body.decodedToken;


	const obtenerDesarrolloConId = (desarrollo : Modelos.IDesarrolloInstance) =>
	{
		if (decodedToken.Puesto !== "Supervisor" || decodedToken.Puesto !== "Administrador" || desarrollo.Empleado !== decodedToken.numUsuario)
		{
			return res.status(401).json(
				{
					mensaje : "Acceso no autorizado"
				}
			);
		}
		if (!desarrollo)
		{
			return res.status(404).json(
				{
					mensaje : "No encontrado"
				}
			)
		}
		return res.status(200).json(
			{
				mensaje : "OK",
				desarrollo : desarrollo
			}
		)
	};
	Modelos.Desarrollo.findOne(
		{
			where :
				{
					Clave_desarrollo : req.params.idDesarrollo
				}
		}
	).then(obtenerDesarrolloConId);
});

route.post("/", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	if (decodedToken.Puesto !== "Supervisor" && decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "No tienes permiso de hacer esto"
			}
		)
	}

	const desarrolloAInsertar = req.body.desarrollo;

	if (!desarrolloAInsertar)
	{
		return res.status(400).json(
			{
				mensaje : "Debes dar los datos para el nuevo desarrollo"
			}
		);
	}

	Modelos.Desarrollo.create(
		{
			Tarea : desarrolloAInsertar.tarea,
			Fecha_Inicio : desarrolloAInsertar.fechaInicio,
			Fecha_Termino : desarrolloAInsertar.fechaTermino,
			Software : desarrolloAInsertar.software, // son generados por el frontend
			Empleado : desarrolloAInsertar.noEmpleado
		}
	).then(sucess =>
	{
		res.status(201).json("OK")
	}, error =>
	{
		res.status(500).json("Error al crear tarea")
	})

});

route.delete("/:idDesarrollo", (req, res) =>
{
	if (req.body.decodedToken.Puesto !== "Supervisor" || req.body.decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "No tienes permiso de hacer esto"
			}
		)
	}
	if (!req.params.idDesarrollo)
	{
		return res.status(500).json(
			{
				message : "Debes brindar un id"
			}
		)
	}

	Modelos.Desarrollo.destroy(
		{
			where :
				{
					Clave_desarrollo : req.body.idDesarrollo
				}
		}
	).then(softwareEliminado =>
	{
		res.json(200).json(
			{
				mensaje : "OK"
			}
		)
	}, error =>
	{
		res.json(500).json(
			{
				mensaje : "No se pudo eliminar"
			}
		)
	})
});

export {route as desarrolloRoute};
