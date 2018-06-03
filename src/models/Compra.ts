import {database} from '../utility/Database';
import {Cliente} from './Cliente';
import {Software} from './Software';

/**
 * Modelo que representa la relación entre el software y el cliente
 */
class Compra
{
	public readonly Licencia : string;
	public readonly FechaActivacion : Date;
	private readonly Cliente : number;
	private readonly Software : number;

	private constructor (licencia : string, fechaActivacion : Date, cliente : number, software : number)
	{
		this.Licencia = licencia;
		this.FechaActivacion = fechaActivacion;
		this.Cliente = cliente;
		this.Software = software;
	}

	public ObtenerCliente () : Cliente
	{
		return Cliente.ObtenerPorId(this.Cliente);
	}

	public ObtenerSoftware () : Software
	{
		return Software.ObtenerSoftwarePorId(this.Software);
	}

	public ObtenerCompra (licencia : string) : Compra
	{
		const queryString = 'SELECT * FROM pbd.Software WHERE Clave_Software = $1';
		const queryValues = [licencia];
		let compra : Compra = null;
		database.query(queryString, queryValues, (error, result) =>
		{
			if (error)
			{
				console.log("Software doesn't exist");
			}
			else
			{
				if (result.rowCount == 1)
				{
					let rowResult = result.rows[0];
					compra = new Compra(rowResult.Licencia, rowResult.Fecha_de_activacion, rowResult.cliente,
						rowResult.software);
				}
			}
		});
		return compra;
	}
}
