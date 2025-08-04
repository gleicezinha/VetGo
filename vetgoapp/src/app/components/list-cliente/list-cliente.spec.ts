import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCliente } from './list-cliente';

describe('ListCliente', () => {
  let component: ListCliente;
  let fixture: ComponentFixture<ListCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
