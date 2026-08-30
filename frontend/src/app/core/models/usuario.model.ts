export type Rol = 'admin' | 'user';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: Rol;
}
