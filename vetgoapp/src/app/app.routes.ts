import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';
import { FormClienteComponent } from './components/form-cliente/form-cliente';
import { FormPetComponent } from './components/form-pet/form-pet';
import { LoginComponent } from './components/login/login';



export const routes: Routes = [
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    { path: 'agendamento', component: AgendamentoComponent },
    { path: 'form-cliente', component: FormClienteComponent },
    { path: 'form-pet', component: FormPetComponent },
    { path: 'login', component: LoginComponent }

];
