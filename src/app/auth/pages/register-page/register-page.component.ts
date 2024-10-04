import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject( Router );

  public myForm:FormGroup = this.fb.group({
    name: ['', [ Validators.required ]],
    apellido: ['', [ Validators.required]],
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(10)]],
  });


  registrar(){
    if (this.myForm.valid) {
      const { name, apellido, email, password } = this.myForm.value;
     

      this.authService.registro(name, apellido, email, password)
      .subscribe({
          next: () => Swal.fire('Éxito', 'Registro exitoso', 'success'),
          error: (message) => Swal.fire('Error', message, 'error')
        });
    }

  }
}
