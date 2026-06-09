// services/pedidoService.js
import supabase from './database.js';
import { Pedido } from '@/shared/entities/Pedido.js';
import { DetallePedido } from '@/shared/entities/DetallePedido.js';

function mapearDetalle(row) {
  return new DetallePedido(
    row.id,
    row.pedido_id,
    row.producto_id,
    row.cantidad,
    row.precio_unitario
  );
}

function mapearPedido(row) {
  const detalles = (row.detalle_pedidos ?? []).map(mapearDetalle);
  return new Pedido(
    row.id,
    row.usuario_id,
    row.estado,
    row.total,
    row.creado_en,
    detalles
  );
}

const pedidoService = {
  async crearPedido(usuarioId, detalles) {
    try {
      const total = detalles.reduce(
        (suma, d) => suma + d.cantidad * d.precioUnitario,
        0
      );

      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({ usuario_id: usuarioId, total, estado: 'pendiente' })
        .select()
        .single();
      if (pedidoError) throw new Error(pedidoError.message);

      const filas = detalles.map(d => ({
        pedido_id: pedidoData.id,
        producto_id: d.productoId,
        cantidad: d.cantidad,
        precio_unitario: d.precioUnitario,
      }));

      const { data: detallesData, error: detallesError } = await supabase
        .from('detalle_pedidos')
        .insert(filas)
        .select();
      if (detallesError) throw new Error(detallesError.message);

      const pedido = new Pedido(
        pedidoData.id,
        pedidoData.usuario_id,
        pedidoData.estado,
        pedidoData.total,
        pedidoData.creado_en,
        detallesData.map(mapearDetalle)
      );

      return { data: pedido, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async obtenerPorUsuario(usuarioId) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('creado_en', { ascending: false });
      if (error) throw new Error(error.message);
      return {
        data: data.map(row => mapearPedido(row)),
        error: null,
      };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, detalle_pedidos(*)')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return { data: mapearPedido(data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default pedidoService;
