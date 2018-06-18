import * as Express from "express";
import * as Modelos from "../../utility/models";
import {sequelize} from "../../utility/database";

const route = Express.Router();

route.get("/", (req, res) =>
{
	const decodedToken = req.body.decodedToken;
	if (decodedToken.Puesto !== "Supervisor" && decodedToken.Puesto !== "Administrador")
	{
		return res.status(401).json(
			{
				mensaje : "Acceso no autorizado"
			}
		);
	}

	const getEntradaSalida = (entradasSalidas : Modelos.IEntradaSalidaInstance[]) =>
	{
		if (!entradasSalidas)
		{
			return res.status(404).json(
				{
					mensaje : "No hay proyectos cancelados o tarde"
				}
			)
		}
		res.status(200).json(
			{
				mensaje : "OK",
				entradas_salidas : entradasSalidas
			}
		);
	};
	Modelos.EntradaSalida.findAll().then(getEntradaSalida);
});

route.post('/:idEmpleado', (req, res) =>
{
	const insertar = () =>
	{
		Modelos.EntradaSalida.create(
			{
				Tipo : req.body.tipo,
				Registro : new Date(),
				Perfil : req.params.idEmpleado
			}
		).then(success =>
		{
			res.status(200).json({mensaje : "OK"})
		}, err =>
		{
			res.status(401).json({mensaje : "Error al registrar tu entrada o salida, probablemente ya lo habías hecho"})
		});
	}

	const hayEntradaPrevia = (encontrado : any) =>
	{
		if (encontrado.length > 0)
		{
			insertar();
			return;
		}
		return res.status(401).json({mensaje : 'No hay entrada previa'})
	}

	sequelize.query(
		'select * from entrada_salida where "Registro"::date = CURRENT_DATE AND "Perfil" = ? AND "Tipo" = ?',
		{
			replacements : [req.params.idEmpleado, req.body.tipo], type : sequelize.QueryTypes.SELECT
		}).then(encontrado =>
	{
		if (encontrado.length > 0)
		{
			return res.status(401).json("Ya habías registrado " + req.body.tipo);
		}
		if (req.body.tipo === 'Salida')
		{
			sequelize.query(
				'select * from entrada_salida where "Registro"::date = CURRENT_DATE AND "Perfil" = ? AND "Tipo" = ?',
				{
					replacements : [req.params.idEmpleado, 'Entrada'], type : sequelize.QueryTypes.SELECT
				}).then(hayEntradaPrevia);
			return;
		}
		insertar();
	});
});

route.get("/:idEntradaSalida", (req, res) =>
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

	const getEntradaSalida = (entradaSalida : Modelos.IEntradaSalidaInstance) =>
	{
		if (!entradaSalida)
		{
			return res.status(404).json(
				{
					mensaje : "No existe el proyecto con el id dado"
				}
			)
		}
		res.status(200).json(
			{
				message : "OK",
				cancelado : entradaSalida
			}
		);
	};
	Modelos.EntradaSalida.findOne(
		{
			where :
				{
					Clave_Registro : req.params.idEntradaSalida
				}
		}
	).then(getEntradaSalida);
});

export {route as entradaSalidaRoute};
