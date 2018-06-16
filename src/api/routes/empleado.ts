import * as Express from "express";
import * as Modelos from "../../utility/models";

const route = Express.Router();

route.get("/", (req, res) =>
	{
		const decodedToken = req.body.decodedToken;
		if (decodedToken.Puesto !== "Administrador" || decodedToken.Puesto !== "RRHH")
		{
			return res.status(401).json(
				{
					mensaje : "Acceso no autorizado"
				}
			);
		}
		const buscarUsuarios = (empleados : Modelos.IEmpleadoInstance[]) =>
		{
			if (!empleados)
			{
				return res.status(404).json(
					{
						mensaje : "No hay usuarios"
					}
				)
			}
			res.status(200).json(
				{
					mensaje : "OK",
					empleados : empleados
				}
			)
		};

		Modelos.Empleado.findAll().then(buscarUsuarios);
	}
);

route.get("/:nomina", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	if (!(decodedToken.Puesto !== "Administrador" || decodedToken.Puesto !== "RRHH") && (decodedToken.Puesto !== "Desarrollador" && decodedToken.numUsuario !== req.params.nomina))
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	const buscarUsuarioConId = (empleado : Modelos.IEmpleadoInstance) =>
	{
		if (!empleado)
		{
			return res.status(404).json(
				{
					mensaje : "No existe el usuario"
				}
			)
		}
		res.status(200).json(
			{
				mensaje : "OK",
				empleado : empleado
			}
		)
	};

	Modelos.Empleado.findOne(
		{
			where :
				{
					Nomina : req.params.nomina
				}
		}
	).then(buscarUsuarioConId);
});

route.delete("/:nomina", (req, res) =>
{

	if (req.body.decodedToken.Puesto !== "Administrador" || req.body.decodedToken.puesto !== "RRHH") //si se llama rrhh??
	{
		return res.status(401).json(
			{
				mensaje : "No tienes permiso de hacer esto"
			}
		)
	}

	if (!req.params.nomina)
	{
		return res.status(500).json(
			{
				message : "Empleado no existente"
			}
		)
	}

	Modelos.Empleado.destroy(
		{
			where :
				{
					Nomina : req.params.nomina
				}
		}
	).then(empleadoEliminado =>
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


route.put("/:nomina", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	const parametros = req.body;
	if (decodedToken.Puesto !== "RRHH" || decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	if (!parametros.Gdo_Estudios || !parametros.Estatus)
	{
		return res.status(500).json(
			{
				mensaje : "No se brindaron parametros"
			}
		)
	}

	const editarDatos = (empleado : Modelos.IEmpleadoInstance) =>
	{
		const Gdo_Estudios = parametros.Nombre || empleado.Gdo_Estudios;
		const estatus = parametros.Estatus || empleado.Estatus;


		Modelos.Empleado.update(
			{
				Gdo_Estudios : Gdo_Estudios,
				Estatus : estatus
			}
		).then(empleadoEditado =>
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

	Modelos.Empleado.findOne(
		{
			where :
				{
					Nomina : req.params.nomina
				}
		}
	).then(empleadoEncontrado =>
	{
		if (!empleadoEncontrado)
		{
			res.status(500).json(
				{
					mensaje : "No es posible editar datos de un software que no existe"
				}
			);
			return;
		}
		editarDatos(empleadoEncontrado)
	});
});

route.post("/", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	const parameters = req.body;

	if (decodedToken.Puesto !== "RRHH" || decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	if (!parameters.Gdo_Estudios && !parameters.Nombre && !parameters.Apellidos && !parameters.Estatus)
	{
		return res.status(400).json(
			{
				mensaje : "Faltan parametros para insertar usuario"
			}
		);
	}

	Modelos.Empleado.create(
		{
			Gdo_Estudios : parameters.Gdo_Estudios,
			Nombre : parameters.Nombre,
			Apellidos : parameters.Apellidos,
			Estatus : parameters.Estatus
		}
	).then((nuevoEmplead) =>
	{
		if (!nuevoEmplead)
		{
			return res.status(400).json(
				{
					mensaje : "No se pudo crear, checa los datos"
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

export {route as empleadoRoute};
