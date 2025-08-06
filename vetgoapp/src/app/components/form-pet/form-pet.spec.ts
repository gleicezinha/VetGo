import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPet } from './form-pet';

describe('FormPet', () => {
  let component: FormPet;
  let fixture: ComponentFixture<FormPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
