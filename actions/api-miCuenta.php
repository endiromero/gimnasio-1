<?php

require("../utils/request.php");

function sendResponse($response){
    echo json_encode($response);
}

$request = new Request();
$action = $request->action;

switch($action){
    case "datosPersonales":
        listarDatos($request);
        break;
    
    case "guardarDatosPersonales":
        guardarDatos($request);
        break;
    
    case "compras":
        listarCompras($request);
        break;
    
    case "reservas":
        listarReservas($request);
        break;
    
    case "cancelarReserva":
        cancelarReserva($request);
        break;
    
    case "comboCalificar":
        cargarComboCalificar();
        break;
    
    case "calificar":
        calificarActividad($request);
        break;
    
    case "calificaciones":
        getCalificacion($request);
        break;
    
    default:
        sendResponse(array(
            "error" => true,
            "mensaje" => "Request mal formado"
        ));
        break;
}


function guardarDatos($request){
    require("../models/miCuenta.php");
    $mc = new MiCuenta();
    
    if($mc->guardarDatosPersonales($request)){
        sendResponse(array(
            "error" => false,
            "mensaje" => ""
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al guardar los datos"
        ));
    }
}


function getCalificacion($request){
    require("../models/miCuenta.php");
    $mc = new MiCuenta();
    
    if($datos = $mc->getCalificacion($request)){
        sendResponse(array(
            "error" => false,
            "mensaje" => "",
            "data" => $datos
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al traer la calificacion"
        ));
    }
}


function calificarActividad($request){
    require("../models/miCuenta.php");
    $mc = new MiCuenta();
    
    if($mc->guardarCalificacion($request)){
        sendResponse(array(
            "error" => false,
            "mensaje" => ""            
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al calificar"
        ));
    }
}


function cargarComboCalificar(){
    require("../models/miCuenta.php");
    $mc = new MiCuenta();
    
    if($datos = $mc->cargarComboCalificar()){
        sendResponse(array(
            "error" => false,
            "mensaje" => "",
            "data" => $datos
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al cargar el combo para calificar"
        ));
    }
}


function cancelarReserva($request){
    require("../models/miCuenta.php");
    $idReserva = $request->idReserva;
    $mc = new MiCuenta();
    
    if($mc->cancelarReserva($idReserva)){
        sendResponse(array(
            "error" => false,
            "mensaje" => ""
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al intentar cancelar la reserva"
        ));
    }
}


function listarReservas($request){
    require("../models/miCuenta.php");
    $mc = new MiCuenta();
    
    if($datos = $mc->listarReservas($request)){
        sendResponse(array(
            "error" => false,
            "mensaje" => "",
            "data" => $datos
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al obtener datos de reservas"
        ));
    }
}


function listarCompras($request){
    require("../models/miCuenta.php");
    $idUsuario = $request->idUsuario;
    $mc = new MiCuenta();
    
    if($datos = $mc->listarComprasUsuario($idUsuario)){
        sendResponse(array(
            "error" => false,
            "mensaje" => "",
            "data" => $datos
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al obtener datos de personales"
        ));
    }
}


function listarDatos($request){
    require("../models/miCuenta.php");
    $mc = new MiCuenta();
    
    if($datos = $mc->listarDatosUsuario($request)){
        sendResponse(array(
            "error" => false,
            "mensaje" => "",
            "data" => $datos
        ));
    }else{
        sendResponse(array(
            "error" => true,
            "mensaje" => "Error al obtener datos de personales"
        ));
    }
}

