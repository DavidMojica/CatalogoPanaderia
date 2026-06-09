// shared/entities/Categoria.js
export class Categoria {
  constructor(id, nombre, descripcion, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }

  tieneImagen() {
    return this.imagen !== null && this.imagen !== undefined && this.imagen !== '';
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagen: this.imagen,
    };
  }
}
