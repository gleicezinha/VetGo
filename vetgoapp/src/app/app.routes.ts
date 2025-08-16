import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';
import { FormClienteComponent } from './components/form-cliente/form-cliente';
import { FormPetComponent } from './components/form-pet/form-pet';
import { LoginComponent } from './components/login/login';
import { ListClienteComponent } from './components/list-cliente/list-cliente';
import { FormAtendimentoComponent } from './components/form-atendimento/form-atendimento';
import { AnimaisCliente} from './components/animais-cliente/animais-cliente';


export const routes: Routes = [
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    { path: 'agendamento', component: AgendamentoComponent },
    { path: 'form-cliente', component: FormClienteComponent },
    { path: 'form-pet', component: FormPetComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-cliente', component: ListClienteComponent },
    { path: 'form-atendimento', component: FormAtendimentoComponent },
    { path: 'animais-cliente/:id', component: AnimaisCliente } // Rota corrigida para aceitar um parâmetro de ID
];