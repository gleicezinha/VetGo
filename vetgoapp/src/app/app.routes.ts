import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';
import { FormClienteComponent } from './components/form-cliente/form-cliente';
import { FormPetComponent } from './components/form-pet/form-pet';
import { LoginComponent } from './components/login/login';
import { ListClienteComponent } from './components/list-cliente/list-cliente';
import { FormAtendimentoComponent } from './components/form-atendimento/form-atendimento';
import { AnimaisCliente } from './components/animais-cliente/animais-cliente';
import { ListAtendimentoComponent } from './components/list-atendimento/list-atendimento';
import { CalendarioComponent } from './components/calendario/calendario';
import { VerifyComponent } from './components/verify/verify.component';
import { authGuard } from './guards/auth.guard';
import { PagamentoModalComponent } from './components/pagamento-modal/pagamento-modal';
import { UsuarioComponent } from './components/usuario/usuario'; // Importe o novo componente

export const routes: Routes = [
    // Rota padrão, redireciona para a tela de agendamento
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    // Rotas protegidas (só acessíveis com login)
    { path: 'agendamento', component: AgendamentoComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    // Adicione esta rota para a tela de verificação
    { path: 'verify/:phone', component: VerifyComponent },
    { path: 'list-cliente', component: ListClienteComponent, canActivate: [authGuard] },
    { path: 'list-atendimento', component: ListAtendimentoComponent, canActivate: [authGuard] },
    { path: 'form-cliente', component: FormClienteComponent },
    { path: 'form-pet', component: FormPetComponent, canActivate: [authGuard] },
    { path: 'form-atendimento', component: FormAtendimentoComponent, canActivate: [authGuard] },
    { path: 'animais-cliente/:id', component: AnimaisCliente, canActivate: [authGuard] },
    { path: 'calendario', component: CalendarioComponent, canActivate: [authGuard] },
    // Rotas de autenticação (acessíveis sem login)
    { path: 'login', component: LoginComponent },
    { path: 'pagamento/:id', component: PagamentoModalComponent, canActivate: [authGuard] },
    // Rota para a tela de verificação, que recebe o telefone como parâmetro
    { path: 'verify/:phone', component: VerifyComponent },
    // Nova rota para o perfil do usuário
    { path: 'usuario', component: UsuarioComponent, canActivate: [authGuard] },
];