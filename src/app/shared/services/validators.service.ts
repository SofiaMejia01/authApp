import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
 //public firstNameOrLastName: string = '^([A-Za-z]+(\s[A-Za-z]+)*)+$';
// public firstNameOrLastName: string = '([a-zA-Z]+) ([a-zA-Z]+)';


public isValidField(form: FormGroup, field: string){
  return form.controls[field].errors && form.controls[field].touched;
}

isFieldOneEqualFieldTwo(field1:string, field2:string){
  return (formGroup:AbstractControl): ValidationErrors | null => {
    
    const fieldValue1 = formGroup.get(field1)?.value;
    const fieldValue2 = formGroup.get(field2)?.value;

    if(fieldValue1 !== fieldValue2) {
      
      formGroup.get(field2)?.setErrors({notEqual: true});
       return {notEqual: true}
     
      // return form.controls[field2].errors;
    }

    // if(!fieldValue1 && !fieldValue2){
      
    //   return null;
    // }
  

    formGroup.get(field2)?.setErrors(null);
    return null;
  }
}
 
}
