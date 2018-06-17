// TODO implementar fotos
import * as Multer from 'multer';
import * as Express from 'express';
import * as Modelos from '../../utility/models';
import * as Path from 'path';

const router = Express.Router();

let storage = Multer.diskStorage(
	{
		destination : function (req, file, cb)
		{
			cb(null, 'uploads/pictures');
		},
		filename : function (req, file, cb)
		{
			cb(null, Date.now().toLocaleString() + '-' + file.originalname)
		}
	});
// 15 MB
const upload = Multer({storage : storage});

router.get('fotoPerfil/:idUsuario', (req, res) =>
{

});

// TODO Alan, realiza esto
router.get('/:idUsuario', (req, res) =>
{
	const decodedToken = req.body.decodedToken;

	if (decodedToken.Perfil !== "RRHH")
	{
		return res.status(401).json(
			{
				mensaje : "Usted no puede ver mis nudes, marrano"
			}
		);
	}
});

router.post('/', upload.single('foto'), (req, res) =>
{
	// aqui subimos una nueva foto
	Modelos.Imagen.create(
		{
			Direccion : Path.resolve(".") + "/uploads/pictures/" + Date.now() + '-' + req.file.originalname,
			Perfil : req.body.decodedToken.numUsuario
		}
	);
});

export {router as fotosRoute};