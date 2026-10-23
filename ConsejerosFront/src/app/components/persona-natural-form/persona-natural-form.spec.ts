import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaNaturalForm } from './persona-natural-form';

describe('PersonaNaturalForm', () => {
  let component: PersonaNaturalForm;
  let fixture: ComponentFixture<PersonaNaturalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaNaturalForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaNaturalForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
