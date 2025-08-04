import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimaisCliente } from './animais-cliente';

describe('AnimaisCliente', () => {
  let component: AnimaisCliente;
  let fixture: ComponentFixture<AnimaisCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimaisCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimaisCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
