// services/productoService.js
import supabase from './database.js';
import { Producto } from '@/shared/entities/Producto.js';

function mapearProducto(row) {
  const producto = new Producto(
    row.id,
    row.categoria_id,
    row.nombre,
    row.descripcion,
    row.precio,
    row.stock,
    row.imagen,
    row.disponible,
    row.creado_en
  );
  // Se adjunta el nombre de categoría cuando viene del join
  if (row.categorias?.nombre) {
    producto.categoriaNombre = row.categorias.nombre;
  }
  return producto;
}

const productoService = {
  async obtenerTodos() {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .eq('disponible', true);
      if (error) throw new Error(error.message);
      return { data: data.map(mapearProducto), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return { data: mapearProducto(data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async obtenerPorCategoria(categoriaId) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .eq('categoria_id', categoriaId)
        .eq('disponible', true);
      if (error) throw new Error(error.message);
      return { data: data.map(mapearProducto), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async buscarPorNombre(termino) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .ilike('nombre', `%${termino}%`)
        .eq('disponible', true);
      if (error) throw new Error(error.message);
      return { data: data.map(mapearProducto), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async actualizarStock(id, cantidad) {
    try {
      const { data: actual, error: fetchError } = await supabase
        .from('productos')
        .select('stock')
        .eq('id', id)
        .single();
      if (fetchError) throw new Error(fetchError.message);

      const nuevoStock = actual.stock - cantidad;
      if (nuevoStock < 0) throw new Error('Stock insuficiente');

      const { data, error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { data: mapearProducto(data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default productoService;
