export type Rol = 'admin' | 'user';

// TODO(Mati): completar la interfaz Usuario (nombre, apellido, email, password)
// como parte de core/producto.service.ts y core/auth.service.ts.
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}
