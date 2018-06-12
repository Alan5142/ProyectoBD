import * as Express from "express";
import * as Modelos from "../../utility/models";
import { sequelize } from "../../utility/database";

const route = Express.Router();

route.get("/", (req, res) =>
	{

		const buscarPerfiles = (perfiles : Modelos.IPerfilInstance[]) =>
		{
			if (!perfiles)
			{
				return res.status(404).json(
					{
						mensaje : "No hay perfiles"
					}
				)
			}
			let returnPerfiles = [];
			perfiles.forEach(element =>
			{
				returnPerfiles.push(
					{
						Clave_Empleado : element.Clave_Empleado,
						Usuario : element.Usuario,
						Correo : element.Correo,
						Puesto : element.Puesto
					})
			});
			res.status(200).json(
				{
					mensaje : "OK",
					perfiles : returnPerfiles
				}
			)

		};

		Modelos.Perfil.findAll().then(buscarPerfiles);
	}
);

route.get("/:idPerfil", (req, res) =>
{
	const getPerfilUnico = (perfil : Modelos.IPerfilInstance) =>
	{
		if (!perfil)
		{
			return res.status(404).json(
				{
					mensaje : "No encontrado"
				}
			)
		}
		return res.status(200).json({
			mensaje : "OK",
			perfil :
				{
					Clave_Empleado : perfil.Clave_Empleado,
					Usuario : perfil.Usuario,
					Correo : perfil.Correo,
					Puesto : perfil.Puesto
				}
		})
	};

	Modelos.Perfil.findOne(
		{
			where :
				{
					Clave_Empleado : req.params.idPerfil
				}
		}
	).then(getPerfilUnico);
});

route.delete("/:idPerfil", (req, res) =>
{

	if (req.body.decodedToken.Puesto !== "Administrador" || req.body.decodedToken.puesto !== "RRHH")
	{
		return res.status(401).json(
			{
				mensaje : "No tienes permiso de hacer esto"
			}
		)
	}

	if (!req.params.idPerfil)
	{
		return res.status(500).json(
			{
				message : "Perfil inexistente"
			}
		)
	}
	sequelize.query('DELETE p.*, f.* FROM Perfil as p INNER JOIN Fotos as f ON p.Clave_Empleado = f.Perfil WHERE p.Clave_Empleado = ?',
	{
		replacements: [req.params.idPerfil], type: sequelize.QueryTypes.DELETE
	}).then(
		exito =>
		{
			return res.status(200).json(
				{
					mensaje: "OK"
				}
			)
		},
		error =>
		{
			return res.status(500).json(
				{
					mensaje: "Error en el servidor, no se pudo eliminar"
				}
			)
		}
	)
});

route.post("/", (req, res) =>
{
	const parameters = req.body;
	const decodedToken = req.body.decodedToken;

	if (decodedToken.Puesto !== "Administrador" || decodedToken.Puesto !== "RRHH")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	if (!parameters.Correo && !parameters.Usuario && !parameters.Contrasena && !parameters.Puesto && !parameters.Empleado)
	{
		return res.status(400).json(
			{
				mensaje : "Faltan parametros para insertar usuario"
			}
		);
	}

	Modelos.Perfil.create(
		{
			Correo : parameters.Correo,
			Usuario : parameters.Usuario,
			Contrasena : parameters.Contrasena,
			Puesto : parameters.Puesto,
			Empleado : parameters.Empleado
		}
	).then((nuevoPerfil) =>
	{
		if (!nuevoPerfil)
		{
			return res.status(400).json(
				{
					mensaje : "No se puede crear usuario, checa los datos"
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

route.put("/:idPerfil", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	const parametros = req.body;

	const editaDesarrollador = () =>
	{
		// toda la lógica por si edita el desarrollador
		if (!parametros.Usuario || !parametros.Contrasena)
		{
			res.status(500).json(
				{
					mensaje : "No se brindaron parametros"
				}
			);
			return;
		}

		const editarDatos = (perfil : Modelos.IPerfilInstance) =>
		{
			const usuario = parametros.Nombre || perfil.Usuario;
			const contrasena = parametros.Estatus || perfil.Contrasena;

			Modelos.Perfil.update(
				{
					Usuario : usuario,
					Contrasena : contrasena
				}
			).then(perfilEditado =>
			{
				console.debug(perfilEditado);
				res.status(200).json(
					{
						mensaje : "OK"
					}
				)
			}, error =>
			{
				console.debug(error);
				res.status(500).json(
					{
						mensaje : "No se pudo editar"
					}
				)
			});
		};

		Modelos.Perfil.findOne(
			{
				where :
					{
						Clave_Empleado : req.params.idPerfil
					}
			}
		).then(perfilEncontrado =>
		{
			if (!perfilEncontrado)
			{
				res.status(500).json(
					{
						mensaje : "No es posible editar datos de un software que no existe"
					}
				);
				return;
			}
			editarDatos(perfilEncontrado);
		});

	};

	const editaAdministrador = () =>
	{
		if (!parametros.Usuario || !parametros.Contrasena || !parametros.Puesto || !parametros.Correo)
		{
			res.status(500).json(
				{
					mensaje : "No se brindaron parametros"
				}
			);
			return;
		}

		const editarDatos = (perfil : Modelos.IPerfilInstance) =>
		{
			const usuario = parametros.Nombre || perfil.Usuario;
			const contrasena = parametros.Estatus || perfil.Contrasena;
			const puesto = parametros.Puesto || perfil.Puesto;
			const correo = parametros.Correo || perfil.Correo;
			Modelos.Perfil.update(
				{
					Usuario : usuario,
					Contrasena : contrasena,
					Puesto : puesto,
					Correo : correo
				}
			).then(perfilEditado =>
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

		Modelos.Perfil.findOne(
			{
				where :
					{
						Clave_Empleado : req.params.idPerfil
					}
			}
		).then(perfilEncontrado =>
		{
			if (!perfilEncontrado)
			{
				res.status(500).json(
					{
						mensaje : "No es posible editar datos de un software que no existe"
					}
				);
				return;
			}
		})
	};

	const editaRRHH = () =>
	{
		// toda la lógica por si edita RRHH
		if (!parametros.Puesto)
		{
			res.status(500).json(
				{
					mensaje : "No se brindaron parametros"
				}
			);
			return;
		}

		const editarDatos = (perfil : Modelos.IPerfilInstance) =>
		{
			const puesto = parametros.Puesto || perfil.Puesto;

			Modelos.Perfil.update(
				{
					Puesto : puesto
				}
			).then(perfilEditado =>
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

		Modelos.Perfil.findOne(
			{
				where :
					{
						Clave_Empleado : req.params.idPerfil
					}
			}
		).then(perfilEncontrado =>
		{
			if (!perfilEncontrado)
			{
				res.status(500).json(
					{
						mensaje : "No es posible editar datos de un software que no existe"
					}
				);
				return;
			}
			editarDatos(perfilEncontrado);
		});
	};

	switch (decodedToken.Puesto)
	{
		case "Desarrollador":
			editaDesarrollador();
			break;
		case "Administrador":
			editaAdministrador();
			break;
		case "RRHH":
			editaRRHH();
			break;
		default:
			return res.status(401).json(
				{
					mensaje : "Acceso no autorizado"
				}
			)
	}
});

export {route as perfilRoute}