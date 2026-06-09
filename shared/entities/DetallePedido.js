// shared/entities/DetallePedido.js
export class DetallePedido {
  constructor(id, pedidoId, productoId, cantidad, precioUnitario) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.productoId = productoId;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  calcularSubtotal() {
    return this.cantidad * this.precioUnitario;
  }

  formatearSubtotal() {
    return `$ ${new Intl.NumberFormat('es-CO').format(this.calcularSubtotal())} COP`;
  }

  toJSON() {
    return {
      id: this.id,
      pedidoId: this.pedidoId,
      productoId: this.productoId,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
    };
  }
}
