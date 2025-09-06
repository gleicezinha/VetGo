import { ComponentFixture, TestBed } from '@angular/core/testing';

// A CORREÇÃO ESTÁ AQUI: o nome importado deve ser FormClienteComponent
import { FormClienteComponent } from './form-cliente';

// A CORREÇÃO ESTÁ AQUI: o nome do componente no teste
describe('FormClienteComponent', () => {
  let component: FormClienteComponent;
  let fixture: ComponentFixture<FormClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormClienteComponent]
    })
      .compileComponents();

    // A CORREÇÃO ESTÁ AQUI: o nome do componente sendo criado
    fixture = TestBed.createComponent(FormClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});