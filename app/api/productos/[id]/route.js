// app/api/productos/[id]/route.js
import productoService from '@/services/productoService.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await productoService.obtenerPorId(id);
    if (error) return Response.json({ error }, { status: 500 });
    if (!data) return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    return Response.json({ data: data.toJSON() });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
