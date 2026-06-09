// app/api/categorias/route.js
import categoriaService from '@/services/categoriaService.js';

export async function GET() {
  try {
    const { data, error } = await categoriaService.obtenerTodas();
    if (error) return Response.json({ error }, { status: 500 });
    return Response.json({ data: data.map(c => c.toJSON()) });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
