// app/api/pedidos/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import pedidoService from '@/services/pedidoService.js';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const usuarioId = session.user.id;
    const { data, error } = await pedidoService.obtenerPorUsuario(usuarioId);
    if (error) return Response.json({ error }, { status: 500 });
    return Response.json({ data: data.map(p => p.toJSON()) });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { detalles } = body;

    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return Response.json({ error: 'El campo detalles es requerido y debe ser un arreglo no vacío' }, { status: 400 });
    }

    const usuarioId = session.user.id;
    const { data, error } = await pedidoService.crearPedido(usuarioId, detalles);
    if (error) return Response.json({ error }, { status: 500 });
    return Response.json({ data: data.toJSON() }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
