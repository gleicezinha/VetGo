import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';
import { FormClienteComponent } from './components/form-cliente/form-cliente';
import { FormPetComponent } from './components/form-pet/form-pet';
import { LoginComponent } from './components/login/login';
import { ListClienteComponent } from './components/list-cliente/list-cliente';
import { FormAtendimentoComponent } from './components/form-atendimento/form-atendimento';
import { AnimaisCliente } from './components/animais-cliente/animais-cliente';
import { ListAtendimentoComponent } from './components/list-atendimento/list-atendimento';
import { VerifyComponent } from './components/verify/verify.component'; // Importe o componente de verificação

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    { path: 'agendamento', component: AgendamentoComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    // Adicione esta rota para a tela de verificação
    { path: 'verify/:phone', component: VerifyComponent }, 
    { path: 'list-cliente', component: ListClienteComponent, canActivate: [authGuard] },
    { path: 'list-atendimento', component: ListAtendimentoComponent, canActivate: [authGuard] },
    { path: 'form-cliente', component: FormClienteComponent, canActivate: [authGuard] },
    { path: 'form-pet', component: FormPetComponent, canActivate: [authGuard] },
    { path: 'form-atendimento', component: FormAtendimentoComponent, canActivate: [authGuard] },
    { path: 'animais-cliente/:id', component: AnimaisCliente, canActivate: [authGuard] }
];