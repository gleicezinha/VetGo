import { Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento';


export const routes: Routes = [
    { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
    { path: 'agendamento', component: AgendamentoComponent },
];
