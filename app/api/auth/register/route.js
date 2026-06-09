// app/api/auth/register/route.js
import supabase from '@/services/database.js';
import { hashPassword } from '@/services/authService.js';

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();

    if (!nombre || !email || !password) {
      return Response.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existente) {
      return Response.json({ error: 'Este correo ya está registrado' }, { status: 409 });
    }

    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .insert({ nombre, email, rol: 'cliente' })
      .select()
      .single();

    if (usuarioError) throw new Error(usuarioError.message);

    const passwordHash = await hashPassword(password);

    const { error: authError } = await supabase
      .from('cuentas_auth')
      .insert({
        usuario_id: usuario.id,
        proveedor: 'credentials',
        password_hash: passwordHash,
      });

    if (authError) throw new Error(authError.message);

    return Response.json({ data: { id: usuario.id, email: usuario.email } }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
