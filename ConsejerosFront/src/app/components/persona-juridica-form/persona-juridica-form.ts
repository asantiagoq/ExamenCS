import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { PersonaJuridicaRegistro } from '../../models/persona-juridica'

@Component({
  selector: 'app-persona-juridica-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './persona-juridica-form.html',
  styleUrl: './persona-juridica-form.css',
})
export class PersonaJuridicaForm {
  private readonly fb = inject(FormBuilder);
  private readonly juridicaService = inject(PersonaJuridicaService);

  @Input() visible = false;
  @Input() idEdicion: number | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardadoExitoso = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    idEntidad: [0],
    numeroDocumento: ['', [Validators.required, Validators.pattern('^20[0-9]{9}$')]],
    razonSocial: ['', [Validators.required, Validators.maxLength(250)]],
    direccion: ['', [Validators.maxLength(250)]],
    telefonos: this.fb.array([])
  });

  guardando = false;
  cargandoDatos = false;
  errorMensaje = '';

  get telefonos(): FormArray {
    return this.formulario.get('telefonos') as FormArray;
  }

  crearTelefonoFormGroup(numero = '', tipo = 'Trabajo'): FormGroup {
    return this.fb.group({
      numero: [numero, [Validators.required, Validators.pattern('^[0-9+ ]+$')]],
      tipo: [tipo, Validators.required]
    });
  }

  agregarTelefono(numero = '', tipo = 'Trabajo'): void {
    this.telefonos.push(this.crearTelefonoFormGroup(numero, tipo));
  }

  removerTelefono(index: number): void {
    this.telefonos.removeAt(index);
  }

  abrir(id: number | null = null): void {
    this.idEdicion = id;
    this.errorMensaje = '';
    this.formulario.reset({
      idEntidad: 0,
      numeroDocumento: '',
      razonSocial: '',
      direccion: ''
    });
    this.telefonos.clear();

    if (id) {
      this.cargarParaEdicion(id);
    } else {
      this.agregarTelefono();
      this.visible = true;
    }
  }

  cargarParaEdicion(id: number): void {
    this.cargandoDatos = true;
    this.visible = true;
    this.juridicaService.obtenerPorId(id).subscribe({
      next: (data) => {
        this.formulario.patchValue({
          idEntidad: data.idEntidad,
          numeroDocumento: data.numeroDocumento,
          razonSocial: data.razonSocial,
          direccion: data.direccion
        });

        this.telefonos.clear();
        if (data.telefonos && data.telefonos.length > 0) {
          data.telefonos.forEach(t => this.agregarTelefono(t.numero, t.tipo || 'Trabajo'));
        } else {
          this.agregarTelefono();
        }
        this.cargandoDatos = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'No se pudo cargar la información para editar.';
        this.cargandoDatos = false;
      }
    });
  }

  cerrarModal(): void {
    this.visible = false;
    this.cerrar.emit();
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';
    const modelo: PersonaJuridicaRegistro = this.formulario.value;

    if (this.idEdicion) {
      this.juridicaService.actualizar(this.idEdicion, modelo).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.guardadoExitoso.emit();
        },
        error: (err) => {
          console.error(err);
          this.errorMensaje = 'Error al actualizar el registro.';
          this.guardando = false;
        }
      });
    } else {
      this.juridicaService.crear(modelo).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.guardadoExitoso.emit();
        },
        error: (err) => {
          console.error(err);
          this.errorMensaje = 'Error al registrar la persona jurídica.';
          this.guardando = false;
        }
      });
    }
  }
}
