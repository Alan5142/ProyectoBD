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
				message : "OK",
				entradas_salidas : entradasSalidas
			}
		);
	};
	Modelos.EntradaSalida.findAll().then(getEntradaSalida);
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
