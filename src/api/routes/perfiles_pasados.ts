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
	const getPerfilesPasados = (perfilesPasados : Modelos.IPerfilesPasadosInstance[]) =>
	{
		if (!perfilesPasados)
		{
			return res.status(404).json(
				{
					mensaje : "No hay perfiles pasados"
				}
			)
		}
		res.status(200).json(
			{
				message : "OK",
				perfiles_pasados : perfilesPasados
			}
		);
	};
	Modelos.PerfilesPasados.findAll().then(getPerfilesPasados);
});


route.get("/:idPerfilPasado", (req, res) =>
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
	
	const getPerfilPasado = (perfilPasado : Modelos.IPerfilesPasadosInstance) =>
	{
		if (!perfilPasado)
		{
			return res.status(404).json(
				{
					mensaje : "No existe el perfil pasado con el id brindado"
				}
			)
		}
		res.status(200).json(
			{
				message : "OK",
				perfil_pasado : perfilPasado
			}
		);
	};
	Modelos.PerfilesPasados.findOne(
		{
			where :
				{
					Clave : req.params.idPerfilPasado
				}
		}
	).then(getPerfilPasado);
});

export {route as perfilesPasadosRoute};
