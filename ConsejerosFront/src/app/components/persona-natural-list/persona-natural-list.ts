import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { PersonaNaturalListado } from '../../models/persona-natural';
import { PersonaNaturalForm } from '../persona-natural-form/persona-natural-form';
import { PersonaJuridicaListado } from '../../models/persona-juridica';
import { PersonaJuridicaForm } from '../persona-juridica-form/persona-juridica-form';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';

@Component({
  selector: 'app-persona-natural-list',
  standalone: true,
  imports: [CommonModule, PersonaNaturalForm, PersonaJuridicaForm],
  templateUrl: './persona-natural-list.html',
  styleUrl: './persona-natural-list.css',
})
export class PersonaNaturalList implements OnInit {
  private readonly personaNaturalService = inject(PersonaNaturalService);
  private readonly personaJuridicaService = inject(PersonaJuridicaService);

  @ViewChild('modalNatural') modalNatural!: PersonaNaturalForm;
  @ViewChild('modalJuridica') modalJuridica!: PersonaJuridicaForm;

  tabActiva: 'natural' | 'juridica' = 'natural';

  personasNaturales: PersonaNaturalListado[] = [];
  personasJuridicas: PersonaJuridicaListado[] = [];
  cargando = false;
  errorMensaje = '';

  ngOnInit(): void {
    this.cargarPersonasNaturales();
  }

  cambiarTab(tab: 'natural' | 'juridica'): void {
    this.tabActiva = tab;
    this.errorMensaje = '';
    if (tab === 'natural' && this.personasNaturales.length === 0) {
      this.cargarPersonasNaturales();
    } else if (tab === 'juridica' && this.personasJuridicas.length === 0) {
      this.cargarPersonasJuridicas();
    }
  }

  // --- LÓGICA PERSONA NATURAL ---
  cargarPersonasNaturales(): void {
    this.cargando = true;
    this.errorMensaje = '';
    this.personaNaturalService.listar().subscribe({
      next: (data) => {
        this.personasNaturales = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'No se pudo conectar con el servidor para Personas Naturales.';
        this.cargando = false;
      }
    });
  }

  abrirNuevoNatural(): void {
    this.modalNatural.abrir();
  }

  abrirEditarNatural(id: number): void {
    this.modalNatural.abrir(id);
  }

  eliminarPersonaNatural(id: number, nombre: string): void {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      this.personaNaturalService.eliminar(id).subscribe({
        next: () => {
          this.cargarPersonasNaturales();
        },
        error: (err) => {
          console.error(err);
          alert('Error al intentar eliminar el registro.');
        }
      });
    }
  }

  // --- LÓGICA PERSONA JURÍDICA ---
  cargarPersonasJuridicas(): void {
    this.cargando = true;
    this.errorMensaje = '';
    this.personaJuridicaService.listar().subscribe({
      next: (data) => {
        this.personasJuridicas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'No se pudo conectar con el servidor para Personas Jurídicas.';
        this.cargando = false;
      }
    });
  }

  abrirNuevoJuridica(): void {
    this.modalJuridica.abrir();
  }

  abrirEditarJuridica(id: number): void {
    this.modalJuridica.abrir(id);
  }

  eliminarPersonaJuridica(id: number, razonSocial: string): void {
    if (confirm(`¿Estás seguro de eliminar a la empresa ${razonSocial}?`)) {
      this.personaJuridicaService.eliminar(id).subscribe({
        next: () => {
          this.cargarPersonasJuridicas();
        },
        error: (err) => {
          console.error(err);
          alert('Error al intentar eliminar el registro.');
        }
      });
    }
  }
}