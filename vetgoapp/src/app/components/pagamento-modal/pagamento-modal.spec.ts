import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoModal } from './pagamento-modal';

describe('PagamentoModal', () => {
  let component: PagamentoModal;
  let fixture: ComponentFixture<PagamentoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
