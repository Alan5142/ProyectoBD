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

	const getCancelados = (canceladosTarde : any) =>
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
				mensaje : "OK",
				cancelados_o_tarde : canceladosTarde
			}
		);
	};
	sequelize.query(
		'select "Nombre", "Estado", "Fecha_Termino", "Fecha_Ten_Termino", "Motivo" from "canceladosTarde" as can inner join software s2 on can."Software" = s2."Clave_Software"',
		{
			type : sequelize.QueryTypes.SELECT
		}).then(getCancelados);
});


route.get("/buscar/:idCancelado", (req, res) =>
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

route.put("/:idSoftware", (req, res) =>
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
	const dateReceived : Date = req.body.fechaTermino;
	Modelos.CanceladosTarde.update(
		{
			Motivo : req.body.razon
		},
		{
			where :
				{
					Software : req.params.idSoftware,
					Fecha_Ten_Termino : dateReceived
				}
		}
	).then(exito =>
	{
		res.status(200).json({mensaje : 'OK'})
	}, error =>
	{
		res.status(500).json({mensaje : 'error'})
	})
	/*
	 Modelos.CanceladosTarde.findAll(
	 {
	 where:
	 {
	 Software: req.params.idSoftware,
	 Fecha_Ten_Termino: req.body.fechaTermino
	 }
	 }
	 ).then(objeto =>
	 {
	 if(!objeto)
	 {
	 return res.status(500).json({mensaje: 'Error'})
	 }
	 objeto[0].set('Motivo', req.body.razon);
	 objeto[0].save();
	 res.status(200).json({mensaje: 'OK'})
	 }, err =>
	 {
	 res.status(500).json({mensaje: 'Error'})
	 })
	 /*
	 sequelize.query('update "canceladosTarde" set "Motivo" = ? where "Software" = ? AND "Fecha_Ten_Termino" = ? ',
	 {
	 raw: true,
	 replacements: [req.params.razon, req.params.idSoftware, req.body.fechaTermino], type: sequelize.QueryTypes.UPDATE
	 }).then( result =>
	 {
	 res.status(200).json({mensaje: 'OK'})
	 },
	 err =>
	 {
	 res.status(500).json({mensaje: 'Error'})
	 });
	 */
});
export {route as canceladosTardeRoute};
