// shared/entities/Pago.js
export class Pago {
  constructor(id, pedidoId, proveedor, referencia, estado, monto, fechaPago) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.proveedor = proveedor;
    this.referencia = referencia;
    this.estado = estado;
    this.monto = monto;
    this.fechaPago = fechaPago;
  }

  estaAprobado() {
    return this.estado === 'aprobado';
  }

  estaRechazado() {
    return this.estado === 'rechazado';
  }

  estaPendiente() {
    return this.estado === 'pendiente';
  }

  toJSON() {
    return {
      id: this.id,
      pedidoId: this.pedidoId,
      proveedor: this.proveedor,
      referencia: this.referencia,
      estado: this.estado,
      monto: this.monto,
      fechaPago: this.fechaPago,
    };
  }
}
