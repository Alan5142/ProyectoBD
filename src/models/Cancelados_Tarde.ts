import {database} from '../utility/Database';
import {EstadoSoftware, Software} from './Software';

/**
 * Modelo que representa la relación entre el software y el cliente
 */
class CanceladosTarde
{
	public readonly ClaveCT : number;
	public readonly Nombre : string;
	public readonly Estado : EstadoSoftware;
	public readonly Motivo : string;
	public readonly FechaInicio : Date;
	public readonly FechaTenTermino : Date;
	public readonly FechaEntCancel : Date;
	public readonly Software : number;

	public ObtenerSoftware () : Software
	{
		return Software.ObtenerSoftwarePorId(this.Software);
	}

	/**
	 * Instancia un proyecto cancelados/tarde
	 * @param {number} claveCT clave del proyecto
	 * @param {string} nombre nombre del proyecto
	 * @param {EstadoSoftware} estado estado del proyecto
	 * @param {string} motivo motivo de la cancelación/atraso
	 * @param {Date} fechaInicio fecha en la que se inicio el proyecto
	 * @param {Date} fechaTenTermino fecha en la que se termino
	 * @param {Date} fechaEntCancel fecha en la que se cancelo
	 * @param {number} software referencia a software
	 */
	private constructor (claveCT : number, nombre : string, estado : EstadoSoftware, motivo : string,
						 fechaInicio : Date, fechaTenTermino : Date, fechaEntCancel : Date, software : number)
	{
		this.ClaveCT = claveCT;
		this.Nombre = nombre;
		this.Estado = estado;
		this.Motivo = motivo;
		this.FechaInicio = fechaInicio;
		this.FechaTenTermino = fechaTenTermino;
		this.FechaEntCancel = fechaEntCancel;
		this.Software = software;
	}

	public static ObtenerCancelado (queryString : string, queryValues : any[]) : CanceladosTarde
	{
		let software : CanceladosTarde = null;
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
					// TODO create Cancelados/Tarde object
				}
			}
		});
		return software;
	}
}
