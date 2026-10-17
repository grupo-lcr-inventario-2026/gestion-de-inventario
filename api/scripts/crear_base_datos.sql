-- Script de creacion de la base de datos del sistema de gestion de deposito TP3D.
-- Ejecutar en MySQL con un usuario administrador (ej. root) ANTES de correr las migraciones de Django.
-- Las TABLAS las crea Django con "python manage.py migrate"; este script solo crea la base y el usuario.

-- 1) Crear la base de datos (con soporte de acentos y emojis).
CREATE DATABASE IF NOT EXISTS tp3d_inventario
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2) Crear el usuario que va a usar la aplicacion Django.
CREATE USER IF NOT EXISTS 'tp3d_user'@'localhost' IDENTIFIED BY 'Tp3d_Deposito2026';

-- 3) Darle permisos sobre esa base.
GRANT ALL PRIVILEGES ON tp3d_inventario.* TO 'tp3d_user'@'localhost';

FLUSH PRIVILEGES;
