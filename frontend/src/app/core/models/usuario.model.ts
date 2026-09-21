export type Rol = 'admin' | 'empleado';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: Rol;
  activo: boolean;
}
