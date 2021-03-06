import * as Express from "express";
import * as Models from "../../utility/models";
import * as Jwt from "jsonwebtoken";

const config = require("./../../../config.json");

const route = Express.Router();

route.post("/login", (req, res) =>
{
	console.log(req);
	const postData = req.body;
	if (!postData.user || !postData.password)
	{
		return res.status(400).json(
			{
				mensaje : "No se dieron credenciales"
			}
		);
	}
	const user =
		{
			"username" : postData.user,
			"password" : postData.password
		};

	Models.Perfil.findOne(
		{
			where :
				{
					"Usuario" : user.username,
					"Contrasena" : user.password
				}
		}
	).then(userFound =>
		{
			if (!userFound)
			{
				res.statusCode = 400;
				res.json(
					{
						"mensaje" : "Error al autenticar"
					}
				);
				return;
			}
			const payload =
				{
					numUsuario : userFound.Clave_Empleado,
					usuario : userFound.Usuario,
					correo : userFound.Correo,
					Puesto : userFound.Puesto
				};
			const token = Jwt.sign(payload, config.secret, {expiresIn : config.tokenLife});
			const refreshToken = Jwt.sign(payload, config.refreshTokenSecret, {expiresIn : config.refreshTokenLife});

			let date = new Date();
			date.setHours(date.getHours() + 24);

			Models.Tokens.insertOrUpdate(
				{
					refreshToken : refreshToken,
					token : token,
					expiration : date
				});

			res.json(
				{
					"mensaje" : "Exito al autenticar",
					numUsuario : userFound.Clave_Empleado,
					"usuario" : userFound.Usuario,
					"puesto" : userFound.Puesto,
					"token" : token,
					"refreshToken" : refreshToken
				}
			)
		}
	);
});

route.post("/refreshToken", (req, res) =>
{
	const postData = req.body;
	if (!postData.refreshToken)
	{
		res.statusCode = 403;
		return res.json(
			{
				Message : "Token not provided"
			}
		)
	}
	const user =
		{
			"username" : postData.user,
			"password" : postData.password
		};
	Models.Tokens.findOne(
		{
			where :
				{
					refreshToken : postData.refreshToken
				}
		}
	).then(tokenFound =>
	{
		if (tokenFound)
		{
			Models.Perfil.findOne(
				{
					where :
						{
							"Usuario" : user.username,
							"Contrasena" : user.password
						}
				}
			).then(user =>
			{
				let userFound = user as any;
				const payload =
					{
						usuario : userFound.Usuario,
						correo : userFound.Correo,
						Puesto : userFound.Puesto
					};
				Jwt.verify((tokenFound as any).refreshToken, config.refreshTokenSecret,
					function (err, decoded)
					{
						if (err)
						{
							return res.status(401).json({error : true, message : "Unauthorized access."});
						}
						const token = Jwt.sign(payload, config.secret, {expiresIn : config.tokenLife});
						Models.Tokens.update(
							{
								token : token
							},
							{
								where :
									{
										refreshToken : postData.refreshToken
									}
							}
						).then(result =>
						{
							console.log(result);
						});
						res.status(200);
						res.json(
							{
								token : token
							}
						);
					});
			})
		}
		else // token not found
		{
			res.status(401).json(
				{
					mensaje : "Unauthorized"
				}
			)
		}
	});

});

route.get('/decode/:token', (req, res) =>
{
	Jwt.verify(req.params.token, config.secret,
		function (err, decoded)
		{
			if (err)
			{
				return res.status(401).json({error : true, message : "Token invalido"});
			}
			return res.status(200).json(
				{
					num_usuario : decoded.numUsuario,
					usuario : decoded.usuario,
					correo : decoded.correo,
					puesto : decoded.Puesto,
				}
			);
		});
})

export {route as loginRoute};
