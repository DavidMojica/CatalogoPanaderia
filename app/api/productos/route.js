// app/api/productos/route.js
import productoService from '@/services/productoService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buscar = searchParams.get('buscar');
    const categoria = searchParams.get('categoria');

    let result;
    if (buscar) {
      result = await productoService.buscarPorNombre(buscar);
    } else if (categoria) {
      result = await productoService.obtenerPorCategoria(categoria);
    } else {
      result = await productoService.obtenerTodos();
    }

    if (result.error) return Response.json({ error: result.error }, { status: 500 });
    return Response.json({ data: result.data.map(p => p.toJSON()) });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
