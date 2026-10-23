import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { PersonaNaturalRegistro } from '../../models/persona-natural';

@Component({
  selector: 'app-persona-natural-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './persona-natural-form.html',
  styleUrl: './persona-natural-form.css',
})
export class PersonaNaturalForm {
  private readonly fb = inject(FormBuilder);
  private readonly personaService = inject(PersonaNaturalService);

  @Input() visible = false;
  @Input() idEdicion: number | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardadoExitoso = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    idEntidad: [0],
    tipoDocumento: ['DNI', Validators.required],
    numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidoPaterno: ['', [Validators.required, Validators.maxLength(100)]],
    apellidoMaterno: ['', [Validators.required, Validators.maxLength(100)]],
    fechaNacimiento: ['', Validators.required],
    sexo: ['M', Validators.required],
    telefonos: this.fb.array([])
  });

  guardando = false;
  cargandoDatos = false;
  errorMensaje = '';

  get telefonos(): FormArray {
    return this.formulario.get('telefonos') as FormArray;
  }

  crearTelefonoFormGroup(numero = '', tipo = 'Móvil'): FormGroup {
    return this.fb.group({
      numero: [numero, [Validators.required, Validators.pattern('^[0-9+ ]+$')]],
      tipo: [tipo, Validators.required]
    });
  }

  agregarTelefono(numero = '', tipo = 'Móvil'): void {
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
      tipoDocumento: 'DNI',
      sexo: 'M'
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
    this.personaService.obtenerPorId(id).subscribe({
      next: (data) => {
        const fecha = data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : '';
        this.formulario.patchValue({
          idEntidad: data.idEntidad,
          tipoDocumento: data.tipoDocumento,
          numeroDocumento: data.numeroDocumento,
          nombres: data.nombres,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          fechaNacimiento: fecha,
          sexo: data.sexo
        });

        this.telefonos.clear();
        if (data.telefonos && data.telefonos.length > 0) {
          data.telefonos.forEach(t => this.agregarTelefono(t.numero, t.tipo || 'Móvil'));
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
    const modelo: PersonaNaturalRegistro = this.formulario.value;

    if (this.idEdicion) {
      this.personaService.actualizar(this.idEdicion, modelo).subscribe({
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
      this.personaService.crear(modelo).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.guardadoExitoso.emit();
        },
        error: (err) => {
          console.error(err);
          this.errorMensaje = 'Error al registrar la persona.';
          this.guardando = false;
        }
      });
    }
  }
}
