import * as Express from "express";
import * as Modelos from "../../utility/models";
import {Sequelize} from "../../utility/database";

const route = Express.Router();
const privateRoute = Express.Router();

route.get("/buscar/:nombre", (req, res) =>
{
	const nombre = req.params.nombre;
	const getSoftwares = (softwares : Modelos.ISoftwareInstance[]) =>
	{
		if (!softwares)
		{
			return res.status(500).json(
				{
					mensaje : 'Error al buscar'
				}
			)
		}
		res.status(200).json(
			{
				mensaje : "OK",
				softwares : softwares
			}
		);
	};
	Modelos.Software.findAll({
		where :
			{
				Nombre :
					{
						[Sequelize.Op.like] : '%' + nombre + '%'
					}
			}
	}).then(getSoftwares);
});


route.get("/", (req, res) =>
{
	const getSoftwares = (desarrollos : Modelos.ISoftwareInstance[]) =>
	{
		res.status(200).json(
			{
				message : "OK",
				desarrollos : desarrollos
			}
		);
	};
	Modelos.Software.findAll().then(getSoftwares);
});

route.get("/info/:idSoftware", (req, res) =>
{
	const getDesarrollo = (software : Modelos.ISoftwareInstance) =>
	{
		if (!software)
		{
			return res.status(404).json(
				{
					mensaje : "No encontrado"
				}
			)
		}
		return res.status(200).json({
			mensaje : "OK",
			software : software
		})
	};

	Modelos.Software.findOne(
		{
			where :
				{
					Clave_Software : req.params.idSoftware
				}
		}
	).then(getDesarrollo);
});

privateRoute.post("/", (req, res) =>
{
	const parameters = req.body;
	const decodedToken = req.body.decodedToken;

	if (decodedToken.Puesto !== "Supervisor" && decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	if (!parameters.Nombre || !parameters.Descripcion || !parameters.Fecha_Inicio || !parameters.Fecha_Termino)
	{
		return res.status(400).json(
			{
				mensaje : "Faltan parametros para insertar usuario"
			}
		);
	}

	Modelos.Software.create(
		{
			Nombre : parameters.Nombre,
			Descripcion : parameters.Descripcion,
			Estado : 'En_proceso',
			Fecha_Inicio : parameters.Fecha_Inicio,
			Fecha_Termino : parameters.Fecha_Termino
		}
	).then((nuevoSoftware) =>
	{
		if (!nuevoSoftware)
		{
			return res.status(400).json(
				{
					mensaje : "No se puede insertar, checa los datos"
				}
			)
		}
		return res.status(201).json(
			{
				mensaje : "OK"
			}
		);
	})
});

privateRoute.delete("/:idSoftware", (req, res) =>
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
});

privateRoute.put("/:idSoftware", (req, res) =>
{
	const parametros = req.body;
	const decodedToken = req.body.decodedToken;
	if (decodedToken.Puesto !== "Supervisor" || decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	if (!parametros.Nombre || !parametros.Descripcion || !parametros.Estado || !parametros.Fecha_Termino)
	{
		return res.status(500).json(
			{
				mensaje : "No se brindaron parametros"
			}
		)
	}

	const editarDatos = (software : Modelos.ISoftwareInstance) =>
	{
		const nombre = parametros.Nombre || software.Nombre;
		const descripcion = parametros.Descripcion || software.Descripcion;
		const estado = parametros.Estado || software.Estado;
		const fechaTermino = parametros.Fecha_Termino || software.Fecha_Termino;

		Modelos.Software.update(
			{
				Nombre : nombre,
				Descripcion : descripcion,
				Estado : estado,
				Fecha_Termino : fechaTermino
			}
		).then(softwareEditado =>
		{
			res.status(200).json(
				{
					mensaje : "OK"
				}
			)
		}, error =>
		{
			res.status(500).json(
				{
					mensaje : "No se pudo editar"
				}
			)
		});
	};

	Modelos.Software.findOne(
		{
			where :
				{
					Clave_Software : req.params.idSoftware
				}
		}
	).then(softwareEncontrado =>
	{
		if (!softwareEncontrado)
		{
			res.status(500).json(
				{
					mensaje : "No es posible editar datos de un software que no existe"
				}
			);
			return;
		}
		editarDatos(softwareEncontrado);
	});
});

export {route as softwareRoute, privateRoute as privateSoftwareRoute};
