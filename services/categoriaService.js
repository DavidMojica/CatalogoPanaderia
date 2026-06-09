// services/categoriaService.js
import supabase from './database.js';
import { Categoria } from '@/shared/entities/Categoria.js';

const categoriaService = {
  async obtenerTodas() {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');
      if (error) throw new Error(error.message);
      return {
        data: data.map(c => new Categoria(c.id, c.nombre, c.descripcion, c.imagen)),
        error: null,
      };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async obtenerPorId(id) {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return {
        data: new Categoria(data.id, data.nombre, data.descripcion, data.imagen),
        error: null,
      };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default categoriaService;
