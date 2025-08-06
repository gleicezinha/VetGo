import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Responsavel } from '../../models/responsavel';
import { CommonModule } from '@angular/common';
import { ResponsavelService } from '../../services/responsavel';

@Component({
  standalone: true,
  selector: 'app-form-cliente',
  imports: [FormsModule, CommonModule],
  templateUrl: './form-cliente.html',
  styleUrls: ['./form-cliente.scss']
})
export class FormClienteComponent implements OnInit {

  registro: Responsavel = <Responsavel>{};
  constructor(
    private servico: ResponsavelService, // Assuming this is a service for handling form data
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ufs = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];
ngOnInit(): void {

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.servico.getById(+id).subscribe({
        next: (resposta: Responsavel) => {
          this.registro = resposta;
        }
      });
    }
  }
   save(): void {
    this.servico.save(this.registro).subscribe({
      complete: () => {
        alert('Usuario cadastrado com sucesso!');
        
      }
    });
  }
  cadastrarpet(): void {
    this.router.navigate(['/form-pet'], {
      queryParams: { responsavelId: this.registro.id }
    });
  }

}
