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

	const getCancelados = (canceladosTarde : Modelos.ICanceladosTardeInstance[]) =>
	{
		if (!canceladosTarde)
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
				cancelados_o_tarde : canceladosTarde
			}
		);
	};
	Modelos.CanceladosTarde.findAll().then(getCancelados);
});


route.get("/:idCancelado", (req, res) =>
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

	const getCancelado = (canceladoTarde : Modelos.ICanceladosTardeInstance) =>
	{
		if (!canceladoTarde)
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
				cancelado : canceladoTarde
			}
		);
	};
	Modelos.CanceladosTarde.findOne(
		{
			where :
				{
					Clave_CT : req.params.idCancelado
				}
		}
	).then(getCancelado);
});

export {route as canceladosTardeRoute};
