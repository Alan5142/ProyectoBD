import * as Express from 'express';
import * as Jwt from 'jsonwebtoken';
import * as Models from '../../utility/models';

const config = require('./../../../config.json');

const route = Express.Router();

route.post('/login', (req, res) =>
{
	const postData = req.body;
	const user =
		{
			"username" : postData.user,
			'password' : postData.password
		};

	Models.Perfil.findOne(
		{
			where :
				{
					'Usuario' : user.username,
					'Contrasena' : user.password
				}
		}
	).then(user =>
		{
			let userFound = user as any;
			if (!user)
			{
				res.statusCode = 400;
				res.json(
					{
						status : 400,
						"Mensaje" : 'Error al autenticar'
					}
				);
				return;
			}
			const payload =
				{
					usuario : userFound.Usuario,
					correo : userFound.Correo,
					Puesto : userFound.Puesto
				};
			const token = Jwt.sign(payload, config.secret, {expiresIn : config.tokenLife});
			const refreshToken = Jwt.sign(payload, config.refreshTokenSecret, {expiresIn : config.refreshTokenLife});

			let date = new Date();
			date.setHours(date.getHours() + 1);

			Models.Tokens.insertOrUpdate(
				{
					refreshToken : refreshToken,
					token : token,
					expiration : date
				});

			res.json(
				{
					status : 200,
					"Mensaje" : 'Exito al autenticar',
					"usuario" : userFound.Usuario,
					"puesto" : userFound.Puesto,
					"token" : token,
					"refreshToken" : refreshToken
				}
			)
		}
	);
});

route.post('/refreshToken', (req, res) =>
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
			'password' : postData.password
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
							'Usuario' : user.username,
							'Contrasena' : user.password
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
				Jwt.verify((tokenFound as any).refreshToken, config.refreshTokenSecret, function (err, decoded)
				{
					if (err)
					{
						return res.status(401).json({"error" : true, "message" : 'Unauthorized access.'});
					}
					const token = Jwt.sign(payload, config.secret, {expiresIn : config.tokenLife});
					let date = new Date();
					date.setHours(date.getHours() + 1);
					console.log(date);
					Models.Tokens.update(
						{
							token : token,
							expiration : date
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
					message : "Unauthorized"
				}
			)
		}
	});

});

export {route as loginRoute};
