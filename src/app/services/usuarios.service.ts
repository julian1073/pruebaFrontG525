import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = 'https://cincoveinticinco.com/users.json';
  private _users$: Subject<UsuarioModel[]> = new Subject<UsuarioModel[]>();

  users: UsuarioModel[] = [];

  private paises: any = [
    { value: 'Argentina',
      name: 'Argentina',
      ciudades: [
        { value: 'Bahia', name: 'Bahía' },
        { value: 'Buenos Aires', name: 'Buenos Aires' },
        { value: 'Ciudad de Cordoba', name: 'Ciudad de Córdoba' },
        { value: 'La Plata', name: 'La Plata' },
        { value: 'Mendoza', name: 'Mendoza' },
      ]
    },
    { value: 'Colombia',
      name: 'Colombia',
      departamentos: [
        { value: 'Atlantico', name: 'Atlantico', ciudades: [ {value: 'Barranquilla', name: 'Barranquilla'}, {value: 'Soledad', name: 'Soledad'} ] },
        { value: 'Boyaca', name: 'Boyacá', ciudades: [ {value: 'Paipa', name: 'Paipa'}, {value: 'Tunja', name: 'Tunja'} ] },
        { value: 'Cundinamarca', name: 'Cundinamarca', ciudades: [ {value: 'Bogota', name: 'Bogotá'}, {value: 'Funza', name: 'Funza'} ] },
      ]
    },
    { value: 'Mexico',
      name: 'Mexico',
      ciudades: [
        { value: 'Ciudad de Mexico', name: 'Ciudad de México' },
        { value: 'Guadalajara', name: 'Guadalajara' },
        { value: 'Juarez', name: 'Juárez' },
        { value: 'Merida', name: 'Mérida' },
        { value: 'Monterrey', name: 'Monterrey' }
      ]
    }
  ];

  private sexos: any = [
    { value: 'Hombre', name: 'Hombre' },
    { value: 'Mujer', name: 'Mujer' }
  ];

  constructor(private http: HttpClient) {
  }

  obtenerPaises() {
    return this.paises;
  }

  obtenerSexos() {
    return this.sexos;
  }

  obtenerUsuarios() {
    return this.http.get(`${this.url}`).pipe(
      map( (resp: any) => {
        this.users = resp.users;
        return resp.users;
      })
    )
  }

  crearUsuario( usuario: UsuarioModel ) {
    this.users.push(usuario);
    this._users$.next(this.users);
  }

  eliminarUsuario( index: number) {
    this.users.splice(index, 1);
    this._users$.next(this.users);
  }

  get users$(): Observable<UsuarioModel[]> {
    return this._users$.asObservable();
  }

  // Métodos de peticion HTTP para crear y eliminar usuario
  // crearUsuario( usuario: UsuarioModel) {
  //   var nuevoUsuario = {
  //     ...usuario
  //   }
  //   return this.http.post(`${this.url}`, nuevoUsuario, {
  //     headers : {
  //       'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
  //     }
  //   }).pipe(
  //     map( (resp: any) => {
  //       return resp;
  //     })
  //   )
  // }

  // eliminarUsuario(id: number) {
  //   return this.http.delete(`${this.url}/${id}`).pipe(
  //     map( (resp: any) => {
  //       return resp;
  //     })
  //   )
  // }
}
