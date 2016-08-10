<?php
require("connection.php");

class MiCuenta
{
    private $connection;
    
    public function __construct(){
        $this->connection = Connection::getInstance();
    }
    
    
    public function getCalificacion($request){
        $idReserva = $request->idReserva;
        
        $query = "SELECT c.comentario,
                        ct.calificacion_tipo
                    FROM `calificaciones` c
                    INNER JOIN `calificaciones-tipo` ct ON ct.id_calificacion_tipo = c.id_calificacion_tipo
                    WHERE c.id_reserva = $idReserva";
        
        if($datos = $this->connection->query($query)){
            return $datos->fetch_assoc();
        }else{
            return false;
        }
    }
    
    
    public function guardarCalificacion($request){
        $idReserva = $request->id_reserva;
        $idTipo = $request->calificacion;
        $comentario = $request->comentario;
        
        $query = "INSERT INTO `calificaciones`
                    (id_reserva,
                    id_calificacion_tipo,
                    comentario)
                    VALUES
                    ($idReserva,
                    $idTipo,
                    '$comentario')";
        
        if($this->connection->query($query)){
            return true;
        }else{
            return false;
        }    
    }
    
    
    public function cargarComboCalificar(){
        $query = "SELECT id_calificacion_tipo, 
                        calificacion_tipo
                FROM `calificaciones-tipo`
                ORDER BY id_calificacion_tipo";
        
        $datos = array();
        
        if($result = $this->connection->query($query)){
            while($fila = $result->fetch_assoc()){
                $datos[] = $fila;
            }
            $result->free();
        }
        
        return $datos;
    }
    
    
    public function cancelarReserva($idReserva){
        $query = "DELETE FROM `reservas`
                WHERE id_reserva = $idReserva";
        
        if($this->actualizarCupos($idReserva)){
            return $this->connection->query($query);
        }else{
            return false;
        }
    }
    
    public function actualizarCupos($idReserva){
        $query = "UPDATE `calendario-profesor-actividad` SET
                    cupo = cupo + 1
                    where id_calendario_profesor_actividad =
                    (SELECT id_calendario_profesor_actividad
                    FROM `reservas`
                    WHERE id_reserva = $idReserva)";
        
        if($this->connection->query($query)){
            return true;
        }else{
            return false;
        }
    }
    
    
    public function listarReservas($request){
        $id_usuario = $request->idUsuario;
        $condicion = $request->condicion;
        
        switch($condicion){
            case "Activas":
                $condicion = "c.fecha_profesor_actividad >= DATE(now())";
                break;
            
            case "Finalizadas":
                $condicion = "c.fecha_profesor_actividad < DATE(now())";
                break;
            
            case "Proximas":
                $condicion = "c.fecha_profesor_actividad BETWEEN DATE(now()) AND DATE(now())+7";
                break;
            
            case "noCalificadas":
                $condicion = "c.fecha_profesor_actividad < DATE(now())
                                AND r.id_reserva NOT IN
                                (SELECT id_reserva FROM `calificaciones`)";
                break;
        }        
        
        $query = "SELECT r.id_reserva,
                        a.nombre, 
                        p.profesor_nombre_apellido,
                        c.fecha_profesor_actividad,
                        c.horario_desde_profesor_actividad,
                        c.horario_hasta_profesor_actividad
                FROM `reservas` r
                INNER JOIN `calendario-profesor-actividad` c on c.id_calendario_profesor_actividad = r.id_calendario_profesor_actividad
                INNER JOIN `profesor-actividad` pa ON pa.id_profesor_actividad = c.id_profesor_actividad
                INNER JOIN `profesores` p ON p.id_profesor = pa.id_profesor
                INNER JOIN `actividades` a ON a.id = pa.id_actividad
                WHERE r.id_usuario = $id_usuario
                AND $condicion
                ORDER BY c.fecha_profesor_actividad";
        
        $datos = array();
        if($result = $this->connection->query($query)){
            while($fila = $result->fetch_assoc()){
                $datos[] = $fila;
            }
            $result->free();
        }
        
        return $datos;
    }
    
    
    public function listarComprasUsuario($idUsuario){
        $query = "SELECT v.id_venta,
                        v.fecha_venta, 
                        tp.tarjetas_tipo, 
                        v.tarjeta_numero, 
                        v.total_venta
                        FROM `ventas` as v, `tarjetas-tipo` as tp
                        WHERE v.id_usuario = '$idUsuario'
                        AND v.tarjeta_tipo = id_tarjetas_tipo
                        order by v.id_venta desc";
            
        $datos = array();
        if( $result = $this->connection->query($query) ){
            while($fila = $result->fetch_assoc()){
                $datos[] = $fila;
            }
            $result->free();
        }
        
        for($i=0; $i<count($datos); $i++){
            $idVenta = $datos[$i]["id_venta"];
            $datos[$i]["detalle"] = $this->listarDetalleCompras($idVenta);
        }
        return $datos;
    }
    
    public function listarDetalleCompras($idVenta){
        $query = "SELECT p.producto_descripcion,
                        m.marca_nombre,
                        t.talle_nombre,
                        dv.cantidad,
                        dv.precio,
                        p.producto_imagen
                    FROM `detalle-ventas` dv,
                        `productos` p,
                        `talles` t,
                        `marcas` m
                    WHERE dv.id_venta = '$idVenta'
                    AND p.id_producto = dv.id_producto
                    AND t.id_talle = dv.id_talle
                    AND m.id_marca = p.producto_marca";                    
        
        $datos = array();
        if( $result = $this->connection->query($query) ){
            while($fila = $result->fetch_assoc()){
                $datos[] = $fila;                                 
            }
            $result->free();
        }
        return $datos;
    }
    
    
    public function guardarDatosPersonales($request){
        $query = "";
        $tipo = $request->tipo;
        
        switch($tipo){
            case "cuenta":
                $query = "UPDATE `usuarios` SET `email`= '$request->email',
                        `clave`= '$request->clave'
                        WHERE `id` = '$request->idUsuario'";
                break;
            
            case "domicilio":
                $query = "UPDATE `datos-usuario` SET `datos_usuario_direccion`= '$request->direccion',
                        `datos_usuario_cp`= '$request->cp',
                        `datos_usuario_localidad`= '$request->localidad',
                        `datos_usuario_telefono`= '$request->telefono'
                        WHERE `id_usuario` = '$request->idUsuario'";
                break;
        }
            
        
        if($this->connection->query($query)){
            return true;
        }else{
            return false;
        }    
    }
    
    
    public function listarDatosUsuario($request){
        $idUsuario = $request->idUsuario;
        
        $query = "SELECT    du.id_usuario,
                            u.email,
                            u.clave,
                            du.datos_usuario_nombre,
                            du.datos_usuario_apellido,
                            du.datos_usuario_dni,
                            du.datos_usuario_direccion,
                            du.datos_usuario_cp,
                            du.datos_usuario_localidad,
                            du.datos_usuario_telefono
                    FROM `datos-usuario` as du,
                        `usuarios` as u
                    WHERE u.id = '$idUsuario'
					AND u.id = du.id_usuario";
        
        $datos = $this->connection->query($query);
        return $datos->fetch_assoc(); 
    }


}