import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaJuridicaForm } from './persona-juridica-form';

describe('PersonaJuridicaForm', () => {
  let component: PersonaJuridicaForm;
  let fixture: ComponentFixture<PersonaJuridicaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaJuridicaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaJuridicaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
