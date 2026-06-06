export class Usuario {
  constructor(id, nombre, email, imagen, rol = "cliente", creadoEn = new Date()) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.imagen = imagen;
    this.rol = rol;
    this.creadoEn = creadoEn;
  }

  esAdministrador() {
    return this.rol === "admin";
  }

  esCliente() {
    return this.rol === "cliente";
  }

  obtenerNombreCorto() {
    return this.nombre?.split(" ")[0] ?? "";
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      imagen: this.imagen,
      rol: this.rol,
      creadoEn: this.creadoEn,
    };
  }

  static desdeGoogle({ id, name, email, image }) {
    return new Usuario(id, name, email, image);
  }
}
