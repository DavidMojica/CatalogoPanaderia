// app/api/pagos/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import supabase from '@/services/database.js';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { pedidoId, metodoPago } = await request.json();
    if (!pedidoId || !metodoPago) {
      return Response.json({ error: 'pedidoId y metodoPago son requeridos' }, { status: 400 });
    }

    // Obtener UUID del usuario en DB usando el email de la sesión
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    // Verificar que el pedido exista
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select('id, estado, total, usuario_id')
      .eq('id', pedidoId)
      .single();

    if (pedidoError || !pedido) {
      return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Verificar que el pedido pertenezca al usuario autenticado
    if (usuario && pedido.usuario_id !== usuario.id) {
      return Response.json({ error: 'No autorizado para este pedido' }, { status: 403 });
    }

    // Verificar que el pedido esté en estado pendiente
    if (pedido.estado !== 'pendiente') {
      return Response.json({ error: 'Este pedido ya fue procesado' }, { status: 400 });
    }

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 1500));

    const referencia = 'SIM-' + Date.now();

    const { error: pagoError } = await supabase
      .from('pagos')
      .insert({
        pedido_id: pedidoId,
        proveedor: metodoPago,
        referencia,
        estado: 'aprobado',
        monto: pedido.total,
        fecha_pago: new Date().toISOString(),
      });

    if (pagoError) throw new Error(pagoError.message);

    const { error: updateError } = await supabase
      .from('pedidos')
      .update({ estado: 'pagado' })
      .eq('id', pedidoId);

    if (updateError) throw new Error(updateError.message);

    return Response.json({ exito: true, referencia, pedidoId });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
