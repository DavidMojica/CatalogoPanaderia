// shared/entities/Producto.js
export class Producto {
  constructor(id, categoriaId, nombre, descripcion, precio, stock, imagen, disponible, creadoEn) {
    this.id = id;
    this.categoriaId = categoriaId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;
    this.disponible = disponible;
    this.creadoEn = creadoEn;
  }

  estaDisponible() {
    return this.disponible === true && this.stock > 0;
  }

  tieneStock(cantidad) {
    return this.stock >= cantidad;
  }

  formatearPrecio() {
    return `$ ${new Intl.NumberFormat('es-CO').format(Number(this.precio))} COP`;
  }

  toJSON() {
    return {
      id: this.id,
      categoriaId: this.categoriaId,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      stock: this.stock,
      imagen: this.imagen,
      disponible: this.disponible,
      creadoEn: this.creadoEn,
    };
  }
}
