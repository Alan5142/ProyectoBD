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


	sequelize.query(
		'select "Clave", "Usuario", "puesto", "Nombre", "Apellidos" from perfiles_pasados as pp inner join empleado e on pp."Empleado" = e."Nomina"',
		{
			type : sequelize.QueryTypes.SELECT
		}).then(data =>
	{
		res.status(200).json(
			{
				message : "OK",
				perfiles_pasados : data
			}
		);
	}, error =>
	{
		console.log(error);
		res.status(500).json({mensaje : 'no se pudieron obtener los datos'});
	})
});

/*
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
 */


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
