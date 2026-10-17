# Permite que Django use MySQL a traves de PyMySQL
# (evita tener que compilar mysqlclient en Windows).
import pymysql

pymysql.install_as_MySQLdb()
