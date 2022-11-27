import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public producto : any = {};
  public id:any;
  public token;
  public file:any=undefined;
  public nueva_variedad = '';
  public load_btn = false;
  public load_btn_eliminar = false;
  public url;

  constructor(
    private _route : ActivatedRoute,
    private _productoService : ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_Data();

      }
    );
  }

  init_Data(){
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
      response=>{
        if (response.data == undefined) {
          this.producto = undefined;
        }else{
          this.producto = response.data;

        }
        console.log(this.producto);
        
      },error=>{
        
      }
    );
  }

  ngOnInit(): void {
  }

  fileChangeEvent(event:any):void{
    var file:any;
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
      console.log(file);
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class:  'text-danger',
        position: 'topRight',
        message: 'No hay una imagen de envío'
      });
    }
    if (file.size <= 4000000) {
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/gif' || file.type == 'image/jpg' || file.type == 'image/jepg') {
      
      this.file = file;
      }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class:  'text-danger',
        position: 'topRight',
        message: 'El archivo debe ser una imagen'
      });
      
      $('#input-img').val('');
      this.file = undefined;
    }
  }else{
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class:  'text-danger',
      position: 'topRight',
      message: 'La imagen no puede superar los 4MB'
      });
      $('#input-img').val('');
      this.file = undefined;

    }
    console.log(this.file);
  }

  subir_imagen(){
    if (this.file != undefined) {
      let data ={
        imagen: this.file,
        _id: uuidv4()
      }
      console.log(data);
      this._productoService.agregar_imagen_galeria_admin(this.id,this.token,data).subscribe(
        response=>{
          this.init_Data();
          $('#input-img').val('');
          
        }
      )
      
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class:  'text-danger',
        position: 'topRight',
        message: 'Debe seleccionar una imagen para subir'
        });
    }
  }

  eliminar(id:any){
    this.load_btn_eliminar = true;
    this._productoService.eliminar_imagen_galeria_admin({_id:id},this.token,this.id).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class:  'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente la imagen.'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn_eliminar = false;

        this.init_Data();
        
      },error=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class:  'text-success',
          position: 'topRight',
          message: 'Ocurrió un error en el servidor.'
        });
        console.log(error);
        this.load_btn = false;
      }
    )
  }


}
