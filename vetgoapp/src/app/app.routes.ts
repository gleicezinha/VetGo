import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';
import { FormClienteComponent } from './components/form-cliente/form-cliente';
import { FormPetComponent } from './components/form-pet/form-pet';
import { LoginComponent } from './components/login/login';
import { ListClienteComponent } from './components/list-cliente/list-cliente';
import { FormAtendimentoComponent } from './components/form-atendimento/form-atendimento';
import { AnimaisCliente} from './components/animais-cliente/animais-cliente';

// Importa o guarda de rota
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    { path: 'agendamento', component: AgendamentoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-cliente', component: ListClienteComponent, canActivate: [authGuard] },
    { path: 'form-cliente', component: FormClienteComponent, canActivate: [authGuard] },
    { path: 'form-pet', component: FormPetComponent, canActivate: [authGuard] },
    { path: 'form-atendimento', component: FormAtendimentoComponent, canActivate: [authGuard] },
    { path: 'animais-cliente/:id', component: AnimaisCliente, canActivate: [authGuard] } 
];