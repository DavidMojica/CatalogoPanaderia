// app/api/mis-pedidos/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import supabase from '@/services/database.js';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!usuario) {
      return Response.json({ data: [] });
    }

    const { data, error } = await supabase
      .from('pedidos')
      .select('*, pagos(proveedor, referencia, estado, monto)')
      .eq('usuario_id', usuario.id)
      .order('creado_en', { ascending: false });

    if (error) throw new Error(error.message);

    return Response.json({ data: data ?? [] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
