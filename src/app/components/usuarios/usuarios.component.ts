import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  crear: boolean = false;
  usuario: UsuarioModel = new UsuarioModel();
  users: UsuarioModel[] = [];
  paises: any[] = [];
  sexos: any[] = [];
  departamentos: any[] = [];
  ciudades: any[] = [];
  mostrarDepartamento: boolean = false;
  mostrarCiudad: boolean = false;
  @ViewChild('casaApartamento')
  casaApartamento!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<UsuarioModel>;

  //Tabla
  displayedColumns: string[] = ['name', 'date_birthday', 'email', 'sex', 'addres', 'country', 'Deparment', 'City', 'id'];


  constructor( private usuariosService: UsuariosService) {

  }

  ngOnInit(): void {
    Swal.showLoading();
    this.paises = this.usuariosService.obtenerPaises();
    this.sexos = this.usuariosService.obtenerSexos();
    this.obtenerUsuarios();
    setTimeout(() => {
      Swal.close();
    }, 1000);

    //Subscripcion
    this.usuariosService.users$.subscribe(resp => {
      this.users = resp;
    });
  }

  obtenerUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe(response => {
      this.users = response;
    });
  }

  guardarUsuario(formulario: NgForm) {
    if (formulario.invalid) {
      Object.values( formulario.controls ).forEach( (control) => {
        control.markAsTouched();
      });
      return;
    }
    if (this.validarEdad(formulario.value.date_birthday)) {
      this.usuario.addres = formulario.value.addres + ' ' + this.casaApartamento.nativeElement.value;
      this.usuario.id = this.users.length + 1;
      this.usuariosService.crearUsuario(this.usuario);
      this.llamarSwal('success', 'Usuario creado', 'Has creado un usuario satisfactoriamente');
      this.crear = false;
      this.table.renderRows();

      //Petición http
      // this.usuariosService.crearUsuario(this.usuario).subscribe(resp => {
      //   this.llamarSwal('success', 'Usuario creado', 'Has creado un usuario satisfactoriamente');
      //   this.crear = false;
      //   this.obtenerUsuarios();
      // }, err => {
      //   console.log(err);
      //   this.llamarSwal('error', 'Error al crear' ,err.error.mensaje);
      // });
    }
    else {
      this.llamarSwal('error', 'Error de validación', 'El usuario debe ser mayor de edad');
    }
  }

  eliminarUsuario(id:number, index: number) {
    Swal.fire({
      title: 'Está seguro de eliminar el usuario?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result: any) => {
      if(result.isConfirmed) {
        this.usuariosService.eliminarUsuario(index);
        this.llamarSwal('success', 'Usuario eliminado', 'Has eliminado un usuario satisfactoriamente');
        this.table.renderRows();

        // Petición http
        // this.usuariosService.eliminarUsuario(id).subscribe(resp => {
        //   this.llamarSwal('success', 'Usuario eliminado', 'Has eliminado un usuario satisfactoriamente');
        // }, err => {
        //   console.log(err);
        //   this.llamarSwal('error', 'Error al eliminar' ,err.error.mensaje);
        // });
      }
    })
  }

  onPaisChange(valor: any) {
    this.usuario.City = null;
    this.usuario.Deparment = null;
    if (valor == 'Colombia') {
      this.mostrarDepartamento = true;
      this.mostrarCiudad = false;
      this.departamentos = this.paises[1].departamentos;
      this.ciudades = [];
    }
    else {
      this.mostrarDepartamento = false;
      this.mostrarCiudad = true;
    }
    if (valor == 'Argentina')
      this.ciudades = this.paises[0].ciudades;
    if (valor == 'Mexico')
      this.ciudades = this.paises[2].ciudades;
  }

  onDepartamentoChange(valor: any) {
    this.usuario.City = null;
    this.departamentos.forEach(item => {
      if (item.value == valor) {
        this.ciudades = item.ciudades;
      }
    });
    this.mostrarCiudad = true;
  }

  limpiarCampos() {
    this.crear=true;
    this.usuario = new UsuarioModel();
  }

  validarEdad(fecha: any) {
    var today = new Date();
    var date_birthday = new Date(fecha);
    var edad = today.getFullYear() - date_birthday.getFullYear();
    var month = today.getMonth() - date_birthday.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < date_birthday.getDate())) {
        edad--;
    }
    if (edad >= 18)
      return true;
    else
      return false
  }

  llamarSwal(icono: any, titulo: string, texto: string) {
    Swal.fire({
      icon: icono,
      title: titulo,
      text: texto
    })
  }
}
