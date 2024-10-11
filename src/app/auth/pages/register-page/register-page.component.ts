import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../../shared/services/validators.service';
//import * as customValidators from '../../../shared/services/validators.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject( Router );
  private validatorsService = inject(ValidatorsService) ;

  public myForm:FormGroup = this.fb.group({
    name: ['', [ Validators.required ]],
    // apellido: ['', [ Validators.required, Validators.pattern(this.validatorsService.firstNameOrLastName)]],
    apellido: ['', [ Validators.required]],
    email: ['', [ Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],  //el pattern lo iguala al valor que introduces en el emailPattern
    password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(10)]],
    password2: ['', [Validators.required]]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password','password2'),
    ]
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


  isValidField(field:string){
    return this.validatorsService.isValidField(this.myForm, field);
  }
}
