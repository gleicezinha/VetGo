import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Procedimento } from '../models/procedimento';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProcedimentoService {
    private apiUrl = `${environment.API_URL}/api/procedimentos`;

    constructor(private http: HttpClient) { }

    save(procedimento: Procedimento): Observable<Procedimento> {
        return this.http.post<Procedimento>(this.apiUrl, procedimento);
    }
}