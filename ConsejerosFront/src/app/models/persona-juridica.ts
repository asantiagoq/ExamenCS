import { Telefono } from './persona-natural';

export interface PersonaJuridicaListado {
  idEntidad: number;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion?: string;
  fechaRegistro: string;
  telefonosResumen?: string;
}

export interface PersonaJuridicaRegistro {
  idEntidad?: number;
  numeroDocumento: string;
  razonSocial: string;
  direccion?: string;
  telefonos: Telefono[];
}

export interface PersonaJuridicaDetalle extends PersonaJuridicaRegistro {
  fechaRegistro: string;
}