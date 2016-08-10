<?php 
require("partials/header.php"); 
$messagecompra = "";
if(isset($_GET["c"])){
    if($_GET["c"]=="ok"){
        $messagecompra = "Su compra fue exitosa!";
    }
}
?>                    
        <div class="container-fluid cuerpo">
            
            <h2 class="titulo-cuerpo">Mi Cuenta</h2>
            
            <?php if($messagecompra!=""):?>
            <div id="compra-exitosa" class="compra-exitosa" onclick="$('#compra-exitosa').slideToggle();"> 
                <?php echo $messagecompra; ?>
            </div>
            <?php endif; ?>
            
            <div class="container cuerpo-socio">
                
                <div class="col-md-3">
                    
                    <div class="row" id="panel_usuario">
                        <ul id="option_list">
                            <input type="hidden" class="id_usuario" name="id_usuario" value="<?php echo $_SESSION["usuario"]["id"]; ?>">
                            <li><a class="resumen">Resumen</a></li>
                            <li><a class="datos_usuario">Mis Datos</a></li>
                            <li>
                                <a class="mi_carrito" <?= isset($_SESSION["carrito"])? 'href="micarrito.php"' : 'data-toggle="modal" data-target=".mi-modal"' ?>>Mi Carrito</a>
                            </li>
                            <li><a class="mis_compras">Mis Compras</a></li>
                            <li>
                                <a data-toggle="collapse" href="#datos-reservas">Mis Reservas</a>
                                <div class="collapse" id="datos-reservas">
                                    <ul>
                                        <li><a class="reservas_activas">Reservas Activas</a></li>
                                        <li><a class="reservas_finalizadas">Reservas Finalizadas</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li><a class="calificar">Calificar Actividades</a></li>
                            <br>
                            <a href="reservas.php"><button type="button" class="btn btn-primary">Reserva de Actividades</button></a>
                        </ul>
                        
                        <!--MODALS:-->
                        <div class="modal fade mi-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-sm">
                                <div class="modal-content contenido">
                                    <!--ACA DENTRO CREO POR JQUERY EL CONTENIDO DEL MODAL -->
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                </div>
                
                <div class="col-md-9" id="listar">
                    
                    <!--ACA MUESTRO POR AJAX TODA LA FUNCIONALIDAD DE MI CUENTA-->
                    
                </div>
                
            </div>
            
        </div>

    <script src="js/vendor/jquery-1.11.2.min.js"></script>
        <script src="js/miCuenta.js"></script>
        
<?php require("partials/footer.php"); ?>
