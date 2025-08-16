import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
// MatCard removido daqui
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatButtonModule,
    MatSelectModule, FormsModule, CommonModule // MatCard removido daqui
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
 
}