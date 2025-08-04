import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAtendimento } from './form-atendimento';

describe('FormAtendimento', () => {
  let component: FormAtendimento;
  let fixture: ComponentFixture<FormAtendimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAtendimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAtendimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
