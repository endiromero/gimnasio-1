<?php
require("connection.php");

class ActividadGrupo
{
    private $connection;
    
    public function __construct(){
        $this->connection = Connection::getInstance();
    }
    

    function getTipos(){
        $query = "SELECT id, 
                        descripcion 
                    FROM `actividad-tipo` 
                    ORDER BY descripcion";
        
        $datos = array();
        
        if($result = $this->connection->query($query)){
            while($fila = $result->fetch_assoc()){
                $datos[] = $fila;
            }
            $result->free();
        }
        return $datos;        
    }
    
    
    public function getAll(){
        $query = "SELECT grupo.id idGrupo,
                        grupo.idtipo idTipo,
                        grupo.descripcion grupoDesc,
                        tipo.descripcion tipoDesc
                FROM `actividad-grupo` grupo, 
                      `actividad-tipo` tipo
                WHERE grupo.idTipo = tipo.id
                ORDER BY grupo.descripcion";
        
        $datos = array();
        
        if( $result = $this->connection->query($query) ){
            while($fila = $result->fetch_assoc()){
                $datos[] = $fila;
            }
            $result->free();
        }
        return $datos;
    }


    function createTipo($request){
        $descripcion = $request->descripcion;
        $query = "INSERT INTO `actividad-tipo` VALUES (
                    DEFAULT,
                    '$descripcion')";
        
        if($this->connection->query($query)){
            return true;
        }else{
            echo $this->error;
        }
    }

    function actualizar($request){
        $id = $request->id;
        $descripcion = $request->descripcion;
        $query = "UPDATE `actividad-tipo` SET
                    descripcion = '$descripcion'
                  WHERE id = $id";
        
        if($this->connection->query($query)){
            return true;
        }else{
            return false;
        }
    }

    function eliminar($request){
        $id = $request->id;
        $query = "DELETE FROM `actividad-tipo`
                  WHERE id = $id";
        
        if($this->connection->query($query)){
            return true;
        }else{
            return false;
        }
    }

}