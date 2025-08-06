import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';
import { FormClienteComponent } from './components/form-cliente/form-cliente';


export const routes: Routes = [
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    { path: 'agendamento', component: AgendamentoComponent },
    { path: 'form-cliente', component: FormClienteComponent },
    // { path: 'form-pet', component: FormPetComponent }
];
