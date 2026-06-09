// shared/entities/Pedido.js
export class Pedido {
  constructor(id, usuarioId, estado, total, creadoEn, detalles = []) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.estado = estado;
    this.total = total;
    this.creadoEn = creadoEn;
    this.detalles = detalles;
  }

  estaPendiente() {
    return this.estado === 'pendiente';
  }

  estaPagado() {
    return this.estado === 'pagado';
  }

  estaCancelado() {
    return this.estado === 'cancelado';
  }

  formatearTotal() {
    return `$ ${new Intl.NumberFormat('es-CO').format(Number(this.total))} COP`;
  }

  toJSON() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      estado: this.estado,
      total: this.total,
      creadoEn: this.creadoEn,
      detalles: this.detalles.map(d => (d.toJSON ? d.toJSON() : d)),
    };
  }
}
