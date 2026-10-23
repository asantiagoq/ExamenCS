export interface Telefono {
  idTelefono?: number;
  numero: string;
  tipo?: string;
}

export interface PersonaNaturalListado {
  idEntidad: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  edad: number;
  sexo: string;
  fechaRegistro: string;
  telefonosResumen: string;
}

export interface PersonaNaturalRegistro {
  idEntidad?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: string;
  telefonos: Telefono[];
}

export interface PersonaNaturalDetalle extends PersonaNaturalRegistro {
  edad: number;
  fechaRegistro: string;
}