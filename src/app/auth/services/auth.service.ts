import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.response';

@Injectable({
  //global
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = environment.baseUrl;
  private http = inject(HttpClient);

  // lo que esta dentro del () es el valor inicial por defecto con el cual inicializa , lo que esta en <> es el tipo de valor que retornara
  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //al mundo exterior, asi me aseguro que nadie ninguna persona modifique estas variables
  public currentUser = computed( () => this._currentUser());
  public authStatus = computed( () => this._authStatus());

  constructor() { 
    //VERIFICA EL ESTADO DE AUTENTICACION AL LLAMAR AL SERVICIO DE MANERA AUTOMATICA
     this.checkAuthStatus().subscribe();
  }

  
  private setAuthentication(user:User, token:string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token',token);

    return true;
    
  }

  login(email: string, password: string):Observable<boolean> {

    const url = `${ this.baseUrl}/auth/login`;
    //const body = {email, password}
    const body = {email: email, password: password};

    //----------------------------------------------------------

    // return this.http.post<LoginResponse>(url,body)
    // .pipe(
    //   tap( ({user,token}) => {
    //     this._currentUser.set(user);
    //     this._authStatus.set(AuthStatus.authenticated);
    //     localStorage.setItem('token', token);
    //     console.log({user, token});
    //   }),
    //   map( () => true),

    //   //ToDO : ERRORES

    //   catchError( err => throwError ( () => err.error.message))
    // );


    //------------OTRA FORMA MAS LIMPIA:-------------------------

    return this.http.post<LoginResponse>(url,body)
    .pipe(
      map( ({user, token}) => this.setAuthentication(user,token)),

      catchError( err => throwError ( () => err.error.message))
    );

   }

   //--------------------------------------------------------

   checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of (false);
    } 

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // return this.http.get<CheckTokenResponse>(url, {headers})
    // .pipe(
    //   map( ({token, user}) =>{
    //     this._currentUser.set(user);
    //     this._authStatus.set(AuthStatus.authenticated);
    //     localStorage.setItem('token', token);

    //     return true;
    //   }),

    //   //error
    //   catchError( () => {
    //     this._authStatus.set(AuthStatus.notAuthenticated);
    //     return of(false);
    //   })
    // )

     //------------OTRA FORMA MAS LIMPIA:-------------------------

     return this.http.get<CheckTokenResponse>(url, {headers})
     .pipe(
      map( ({user, token}) => this.setAuthentication(user,token)),

      catchError( () => {
             this._authStatus.set(AuthStatus.notAuthenticated);
             return of(false);
          })
     )
   }


  logout(){
    // localStorage.clear();

    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
