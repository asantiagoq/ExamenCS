import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { PersonaNaturalListado } from '../../models/persona-natural';
import { PersonaNaturalForm } from '../persona-natural-form/persona-natural-form';

@Component({
  selector: 'app-persona-natural-list',
  standalone: true,
  imports: [CommonModule, PersonaNaturalForm],
  templateUrl: './persona-natural-list.html',
  styleUrl: './persona-natural-list.css',
})
export class PersonaNaturalList implements OnInit {
  private readonly personaService = inject(PersonaNaturalService);

  @ViewChild('modalForm') modalForm!: PersonaNaturalForm;

  personas: PersonaNaturalListado[] = [];
  cargando = false;
  errorMensaje = '';

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas(): void {
    this.cargando = true;
    this.errorMensaje = '';
    this.personaService.listar().subscribe({
      next: (data) => {
        this.personas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'No se pudo conectar con el servidor. Revisa que el Web API esté corriendo.';
        this.cargando = false;
      }
    });
  }
  abrirNuevo(): void {
    this.modalForm.abrir();
  }

  abrirEditar(id: number): void {
    this.modalForm.abrir(id);
  }

  eliminarPersona(id: number, nombre: string): void {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      this.personaService.eliminar(id).subscribe({
        next: () => {
          this.cargarPersonas();
        },
        error: (err) => {
          console.error(err);
          alert('Error al intentar eliminar el registro.');
        }
      });
    }
  }
}