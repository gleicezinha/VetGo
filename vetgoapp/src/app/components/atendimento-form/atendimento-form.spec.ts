import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentoForm } from './atendimento-form';

describe('AtendimentoForm', () => {
  let component: AtendimentoForm;
  let fixture: ComponentFixture<AtendimentoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendimentoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
