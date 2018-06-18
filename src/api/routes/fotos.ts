// TODO implementar fotos
import * as Multer from 'multer';
import * as Express from 'express';
import * as Modelos from '../../utility/models';
import * as Path from 'path';
import * as Fs from 'fs';
import * as Jwt from 'jsonwebtoken';

const config = require("./../../../config.json");

const router = Express.Router();


let storage = Multer.diskStorage(
	{
		destination : function (req, file, cb)
		{
			console.log(req);
			const path = 'uploads/pictures/' + (req as any).params.idUsuario;
			if (!Fs.existsSync(path))
			{
				Fs.mkdirSync(path);
			}
			cb(null, path);
		},
		filename : function (req, file, cb)
		{
			const reqAny = req as any;
			const headers = (req as any).headers;
			const perfil = reqAny.body.perfil || reqAny.query.perfil || reqAny.headers["perfil"];
			if (perfil && perfil === 'true')
			{
				if (Fs.existsSync('uploads/pictures/perfil*'))
				{
					console.log('existe');
				}
				console.log(file);
				cb(null, 'perfil.jpg');
				return;
			}
			cb(null, Date.now().toLocaleString() + '-' + file.originalname)
		}
	});
// 15 MB
const upload = Multer({storage : storage});

router.post('/:idUsuario', upload.single('foto'), (req, res) =>
{
	const headers = req.headers;
	const token = req.body.token || req.query.token || req.headers["token"];
	const func = () =>
	{
		const file = req.file;
		const perfil = req.body.perfil || req.query.perfil || req.headers["perfil"];
		if (perfil && (perfil === 'true' || perfil === true))
		{
			return res.status(200).json({mensaje : 'ok'});
		}
		Modelos.Imagen.create(
			{
				Direccion : Path.resolve(
					".") + "/uploads/pictures/" + req.params.idUsuario + '/' + Date.now() + '-' + req.file.originalname,
				Perfil : req.params.idUsuario
			}
		);
		return res.status(200).json('OK');
	};

	Jwt.verify(token, config.secret, (err, decoded) =>
		{
			if (decoded.numUsuario === Number(req.params.idUsuario))
			{
				func();
				return;
			}
			res.status(401).json({mensaje : 'error'});
		}
	)
});

export {router as fotosRoute};