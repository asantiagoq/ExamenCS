import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaNaturalList } from './persona-natural-list';

describe('PersonaNaturalList', () => {
  let component: PersonaNaturalList;
  let fixture: ComponentFixture<PersonaNaturalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaNaturalList],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaNaturalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
