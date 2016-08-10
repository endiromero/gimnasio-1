(function($){
    
    $listar = $("#listar");
    $panel = $("#panel_usuario");
    var id_usuario = $(".id_usuario").val();
    
    //MANEJA LOS EVENTOS DE LAS OPCIONES DE USUARIO
    $panel.on("click", "a", function(event){
        var accion = event.target.className;        
        
        switch(accion){
            //BOTON "RESUMEN": MUESTRA UN RESUMEN DEL USUARIO    
            case "resumen":
                resumen(id_usuario, "Proximas");
                break;
                
            //BOTOS "MIS DATOS": QUE MUESTRA LOS DATOS DEL USUARIO    
            case "datos_usuario":
                listarDatosPersonales(id_usuario);
                break;
            
            //MODAL: INFORMA QUE NO HAY PRODUCTOS EN EL CARRITO    
            case "mi_carrito":
                $panel.find("div.contenido").html("");
        
                var html = '<div class="modal-body">\
                                <h4 class="modal-title">No tienes productos en el carrito.</h4>\                                       </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-primary" data-dismiss="modal">Cerrar</button>\
                            </div>';

                $panel.find("div.contenido").append(html);
                break;
                
            //BOTON "MIS CUMPRAS": LISTA LAS COMPRAS DEL USUARIO    
            case "mis_compras":
                listarMisCompras(id_usuario);
                break;
            
            //BOTON "RESERVAS ACTIVAS" EN "MIS RESERVAS": LISTA RESERVAS FUTURAS
            case "reservas_activas":
                listarReservas(id_usuario, "Activas");
                break;
            
            //BOTON "RESERVAS FINALIZADAS" EN "MIS RESERVAS": LISTA RESERVAS PASADAS
            case "reservas_finalizadas":
                listarReservas(id_usuario, "Finalizadas");
                break;
            
            //BOTON "CALIFICAR ACTIVIDADES": LISTA ACTIVIDADES SIN CALIFICAR
            case "calificar":
                getCalificarActividades(id_usuario, "noCalificadas");
                break;
        }    
    });
    
    
    //BOTON "CANCELAR" DE RESERVAS: MUESTRA EL MODAL PARA CONFIRMAR LA OPERACION 
    $listar.on("click", "a.cancelar-reserva", function(){
        var id = $(this).closest("td").find("#id-reserva").val();
        
        $panel.find("div.contenido").html("");
        
        var html = '<div class="modal-body">\
                    <h4 class="modal-title">Seguro que quieres cancelar esta reserva?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <input type="hidden" name="id-reserva" value="'+id+'">\
                                        <button id="cancelar-reserva"type="button" class="btn btn-success" data-dismiss="modal">Confirmar</button>\
                                        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>\
                                    </div>';
        
        $panel.find("div.contenido").append(html);     
    });
    
    //BOTON "CONFIRMAR" DEL MODAL: CANCELA UNA RESERVA
    $panel.on("click", "#cancelar-reserva", function(){
        var id = $(this).closest("div").find("input[name=id-reserva]").val();
        cancelarReserva(id);
    });
    
    
    //BOTON "CALIFICAR!!" DE CALIFICAR PENDIENTES: DESPLIEGA UN MODAL PARA CONFIRMAR LA ACCION
    $listar.on("click", "a.calificar-reserva", function(){
        
        var datos = $(this).closest("tr").find("form").serialize();
        
        $panel.find("div.contenido").html("");
        
        var html = '<div class="modal-header">';
            html += '<h4 class="modal-title">Confirmas tu califiacion?</h4>';
            html += '</div>';
            html += '<div class="modal-footer">';
            html += '<input type="hidden" name="datos" value="'+datos+'">';
            html += '<button id="confirmar-calificacion" type="button" class="btn btn-success" data-dismiss="modal">Confirmar</button>';
            html += '<button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>';
            html += '</div>';
        
        $panel.find("div.contenido").append(html);       
    });
    
    
    //BOTON "CONFIRMAR" DEL MODAL: CONFIRMAR CALIFICACION
    $panel.on("click", "#confirmar-calificacion", function(){
        var datos = $(this).closest("div").find("input[name=datos]").val();
        calificarActividad(datos);
    });    
    
    
    
    //BOTON "CALIFICACION" DE RESERVAS FINALIZADAS
    $listar.on("click", "a.detalle_calificacion", function(){
        var id = $(this).closest("td").find("input[name=id_reserva]").val();
        getDetalleCalificacion(id);
    });
    
    $listar.on("click", ".mis-datos button", function(event){
        listarDatosPersonales(id_usuario);
        var editar = event.target.id;
        var tipo = event.target.name;
    
        switch(editar){
            case "guardar":
                var datos = $(this).closest("div").find("form").serialize();
                datos += "&idUsuario="+id_usuario+"&tipo="+tipo+"&action=guardarDatosPersonales";
                guardarDatosPersonales(datos);
                break;
                
            case "cancelar":
                break;
                
            default:
                editarDatosPersonales(id_usuario, editar);
                break;
        }        
    });
    
    
    var URI = {
        MI_CUENTA: 'actions/api-miCuenta.php'
    };
    
    
    var getDetalleCalificacion = function(id){
    
        var detalle = $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idReserva: id,
                  action: 'calificaciones'},
            dataType: 'json'
        });
        
        detalle.done(function(res){
            console.log(res);
            
            if(!res.error){
                $listar.find("div #calificacion_"+id+"").html("");
                var html = '<p><b>'+res.data.calificacion_tipo+'</b><br>'+res.data.comentario+'</p>';
                $listar.find("div #calificacion_"+id+"").append(html);
            }else{
                $listar.find("div #calificacion_"+id+"").html("");
                var html = '<p><span>NO HAS CALIFICADO ESTA ACTIVIDAD!!</span>';
                $listar.find("div #calificacion_"+id+"").append(html);
            }
        });
        
        detalle.fail(function(res){
            console.log(res);
        });
    }
    
    
    var calificarActividad = function(datos){
        
        var calificar = $.ajax({
            url: URI.MI_CUENTA,
            method: 'POST',
            data: datos
        });
        
        calificar.done(function(res){
            console.log(res);
            
            if(!res.error){
                getCalificarActividades(id_usuario, "noCalificadas");
            }
        });
        
        calificar.fail(function(res){
            console.log(res);
        });
    }
    
    
    var getComboData = function(){
    //Retorno la promise de los datos del combo
        return $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {action: 'comboCalificar'},
            dataType: 'json'
        });
    };
    
    
    var getReservasData = function(id, condicion){
    //Retorno la promise de los datos de las reservas
        return $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idUsuario: id,
                   condicion: condicion,
                   action: 'reservas'},
            dataType: 'json'
        });
    };
    
    
    var getHTMLCombo = function(data, id){
        var html = '<div class="pull-left">';
        html += '<select name="calificacion" class="form-control">';
        
        data.forEach(function(dato){
            html += '<option value="'+dato.id_calificacion_tipo+'">'+dato.calificacion_tipo+'</option>';
        });
        
        html += '</select></div>';
        html += '<button type="button" class="btn btn-success" data-toggle="collapse" href="#comentario_'+id+'">Añadir Comentario</button>';
        html += '<a class="btn btn-primary calificar-reserva" data-toggle="modal" data-target=".mi-modal">Calificar!!</a>';
        html += '<div class="collapse collMensaje" id="comentario_'+id+'">';
        html += '<textarea name="comentario" maxlength="160" placeholder="Max 160 caracteres" rows="2" cols="5"></textarea>';
        html += '</div>';
        
        return html;
    };
    
    
    var getHTMLCalificaciones = function(dataCombo, dataReservas){
        var html = '<h3>Calificaciones Pendientes:</h3><br>';
        html += '<table class="table table-striped table_calificaciones">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Fecha</th>';
        html += '<th>Horario</th>';
        html += '<th>Actividad</th>';
        html += '<th>Profesor</th>';
        html += '<th>Calificar</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        dataReservas.forEach(function(dato){
            html += '<tr>';
            html += '<td>' + dato.fecha_profesor_actividad + '</td>';
            html += '<td>'+dato.horario_desde_profesor_actividad+' - '+dato.horario_hasta_profesor_actividad+'</td>';
            html += '<td>'+dato.nombre+'</td>';
            html += '<td>'+dato.profesor_nombre_apellido+'</td>';
            html += '<td>';
            html += '<form class="form-calificar-'+dato.id_reserva+'">';
            html += '<input type="hidden" name="action" value="calificar">';
            html += '<input type="hidden" name="id_reserva" value="'+dato.id_reserva+'">';
            html += getHTMLCombo(dataCombo, dato.id_reserva);
            html += '</form>';
            html += '</td>';
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }
    
    
    var getCalificarActividades = function(id, condicion){
        //Cuando los dos hallan retornado resultados...
        $.when(
            getReservasData(id, condicion),
            getComboData()
        ).done(function(rReservas, rCombo){
            //ojo que la estructura que devuelve $.when es ligeramente distinta, mirar con console.log
            console.log(rReservas, rCombo);
            
            if(!rReservas[0].error && !rCombo[0].error){
                $listar.html("");
                var dataCombo = rCombo[0].data;
                var dataReservas = rReservas[0].data;
                var html = getHTMLCalificaciones(dataCombo, dataReservas);
                $listar.append(html);
            }else{
                $listar.html("");
            }
        }).fail(function(err){
            //Esto se llama si cualquiera de los dos llamados fallo...
            //No espera al resultado del otro.
        });
    };
    
    
    var resumen = function(id, condicion){
        var info = $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idUsuario: id,
                  condicion: condicion,
                  action: 'reservas'},
            dataType: 'json'
        });
        
        info.done(function(res){
            console.log(res);
            
            if(!res.error){
                $listar.html("");
                
                var html = '<div class="row actividades_semanales">\
                            <label>Mis Actividades de la Semana:</label>\
                            <table class="table table_mis_actividades">\
                                  <thead>\
                                    <tr>\
                                        <th>Actividad</th>\
                                        <th>Fecha</th>\
                                        <th>Horario</th>\
                                        <th>Profesor</th>\
                                    </tr>\
                                  </thead>\
                                  <tbody>';
                    res.data.forEach(function(dato){
                        html += '<tr>\
                                    <td>'+dato.nombre+'</td>\
                                    <td>'+dato.fecha_profesor_actividad+'</td>\
                                    <td>'+dato.horario_desde_profesor_actividad+' - '+dato.horario_hasta_profesor_actividad+'</td>\
                                    <td>'+dato.profesor_nombre_apellido+'</td>\
                                </tr>';
                    });
                                                                        
                        html += '</tbody>\
                            </table>\
                        </div>\
                    </div>';
        
                $listar.append(html);
            }else{
                $listar.html("");
                
                var html = '<div class="col-md-6">\
                    </div>\
                    <div class="col-md-3">\
                        <div class="row">\
                            <label>Ultima Actividad calificada:</label>\
                            <li>Spinning</li>\
                            <label>Calificacion:</label>\
                            <li>Excelente</li>\
                        </div>\
                        <div class="row">\
                            <label>Proximas Actividades:</label>\
                            <table class="table table-hover">\
                                  <thead>\
                                    <tr>\
                                      <th>Actividad</th>\
                                      <th>Fecha</th>\
                                    </tr>\
                                  </thead>\
                                  <tbody>';
                                                        
                        html += '</tbody>\
                            </table>\
                        </div>\
                    </div>';
        
                $listar.append(html);            
            }
            
        });
        
        info.fail(function(res){
            console.log(res);
        });
    }
    
    
    var getDate = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        today = yyyy+"-"+mm+"-"+dd;
        return today;
    }
    
    
    var cancelarReserva = function(id){
        var cancelar = $.ajax({
            url: URI.MI_CUENTA,
            method: 'POST',
            data: {idReserva: id,
                  action: 'cancelarReserva'}
        });
        
        cancelar.done(function(res){
            console.log(res);
            
            if(!res.error){
                var id = $(".id_usuario").val();
                listarReservas(id, "Activas");
            }
        });
        
        cancelar.fail(function(res){
            console.log(res);
        });
    }
    
    
    var listarReservas = function(id, condicion){
        var listarReservas = $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idUsuario: id,
                  condicion: condicion,
                  action: 'reservas'},
            dataType: 'json'
        });
        
        listarReservas.done(function(res){
            console.log(res);
            
            if(!res.error){
                //Borro el listado:
                $listar.html("");
                
                //Cargo la cabecera fuera del ForEach para que no se repita:
                if(condicion=="Activas"){
                    var html = '<h3>Mis Reservas Activas:</h3><br>';
                }else{
                    var html = '<h3>Mis Reservas Finalizadas:</h3><br>';
                }
                
                html += '<div class="table-responsive"><table class="table table-striped table-responsive table_reservas">\
                            <thead>\
                                <tr>\
                                    <th>Fecha</th>\
                                    <th>Actividad</th>\
                                    <th>Horario</th>\
                                    <th>Profesor</th>';
                html += '<th></th>';
                
                /*if(condicion=="Activas"){
                    html += '<th></th>';
                }*/
                
                html += '</tr>\
                    </thead>\
                <tbody>';
                
                //Cargo las filas de la tabla:
                res.data.forEach(function(dato){
                    
                    html += '<tr>\
                                <td>'+dato.fecha_profesor_actividad+'</td>\
                                <td>'+dato.nombre+'</td>\
                                <td>'+dato.horario_desde_profesor_actividad+' - '+dato.horario_hasta_profesor_actividad+'</td>\
                                <td>'+dato.profesor_nombre_apellido+'</td>';
                
                    if(condicion=="Activas"){
                        html += '<td>';
                        html += '<input id="id-reserva" type="hidden" name="idReserva" value="'+dato.id_reserva+'">';
                        
                        if(!(getDate() == dato.fecha_profesor_actividad)){
                            html += '<a class="cancelar-reserva" data-toggle="modal" data-target=".mi-modal">Cancelar</a>';
                        }else{
                            html += '<label>Actividad en Curso!</label>';
                        }
                        html += '</td>';
                    }else{
                        if(condicion=="Finalizadas"){
                            html += '<td>';
                            html += '<input type="hidden" name="id_reserva" value="'+dato.id_reserva+'">';
                            html += '<a data-toggle="collapse" href="#calificacion_'+dato.id_reserva+'" class="btn btn-default detalle_calificacion">Calificacion</a>';
                            html += '<div class="collapse detalle_calificacion" id="calificacion_'+dato.id_reserva+'"></div>';
                            html += '</td>';
                        }
                    }
                    
                    html += '</tr>';
                });
                
                //concateno el cierre de la tabla
                 html += '</tbody>\
                            </table>\
                                </div>';
                
                $listar.append(html);
                    
            }else{
                $listar.html("");
                var html = '<h3>No hay Reservas</h3>';
                $listar.append(html);                
            }
        });
        
        listarReservas.fail(function(res){
            console.error(res);
        });
    }
    
    
    var listarMisCompras = function(id){
        var listarCompras = $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idUsuario: id,
                   action: 'compras'},
            dataType: 'json'
        });
        
        listarCompras.done(function(res){
                console.log(res);
            
            if(!res.error){
                
                $listar.html("");
                var html="";
                var indice = 0; 
                var cantidad = res.data.length - 1;
                
                res.data.forEach(function(compra){
                    
                    if(indice==0){
                        html += '<h3>Mis Compras:</h3><br>\
                                <table class="table table_mis_compras">\
                                <thead>\
                                    <tr>\
                                        <th>Fecha</th>\
                                        <th>Medio de Pago</th>\
                                        <th>Total</th>\
                                        <th>Detalle</th>\
                                    </tr>\
                                </thead>\
                                <tbody id="body-micarrito">';
                    }
                    
                    html += '<tr>\
                                <td>'+compra.fecha_venta+'</td>\
                                <td>'+compra.tarjetas_tipo+": <br>xxxx-"+compra.tarjeta_numero.substring(12, 16)+'</td>\
                                <td>'+"$"+compra.total_venta+'</td>\
                                <td>\
                                    <input type="hidden" class="id_venta" name="id_venta_'+compra.id_venta+'" value="'+compra.id_venta+'">\
                                    <a class="btn btn-default" role="button" data-toggle="collapse" href="#'+compra.id_venta+'" aria-expanded="false" aria-controls="collapseExample">Detalle</a>\
                                </td>\
                            </tr>\
                            <tr class="collapse" id="'+compra.id_venta+'">\
                                <td colspan="4">\
                                    <table class="table table_detalle_compra">\
                                        <thead>\
                                            <tr>\
                                                <th>Producto</th>\
                                                <th>Talle</th>\
                                                <th>Cantidad</th>\
                                                <th>Precio Unitario</th>\
                                                <th>Sub-Total</th>\
                                            </tr>\
                                        </thead>\
                                        <tbody>';
                    
                    for($i=0; $i<compra["detalle"].length; $i++){
                        
                                    html += '<tr>\
                                                <td><img style="width: 60px" src='+compra["detalle"][$i].producto_imagen+'><br>'+compra["detalle"][$i].producto_descripcion+" ("+compra["detalle"][$i].marca_nombre+')</td>\
                                                <td>'+compra["detalle"][$i].talle_nombre+'</td>\
                                                <td>'+compra["detalle"][$i].cantidad+'</td>\
                                                <td>$'+compra["detalle"][$i].precio+'</td>\
                                                <td>$'+compra["detalle"][$i].cantidad * compra["detalle"][$i].precio+'</td>\
                                            </tr>';
                    }
                    
                    html +=   '</tbody>\
                            </table>\
                        </td>\
                    </tr>';
                    
                    if(cantidad==indice){
                        html += '</tbody>\
                            </table>';                        
                        $listar.append(html);
                    }
                    indice++;                   
                });               
            }
        });
        
        listarCompras.fail(function(res){
            console.error("Error a traer las compras");
            console.log(res);
        });
    }
    
    
    var guardarDatosPersonales = function(datos){
        var guardar = $.ajax({
            url: URI.MI_CUENTA,
            method: 'POST',
            data: datos
        });
        
        guardar.done(function(res){
            console.log(res);
            
            if(!res.error){
                listarDatosPersonales(id_usuario);
                return true;
            }else{
                return false;
            }            
        });
        
        guardar.fail(function(res){
            console.log(res);
        });
    }
    
    
    var editarDatosPersonales = function(id_usuario, editar){
        
        var listar = $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idUsuario: id_usuario,
                   action: 'datosPersonales'},
            dataType: 'json'
        });
        
        listar.done(function(res){
            console.log(res);
            
            if(!res.error){
                
                switch(editar){
                    case "datos-cuenta":
                        $(".datos-cuenta").html("");
                        var html = '<h4>Datos de cuenta:</h4>';
                        html += '<form class="form-datos-cuenta">';
                        html += '<div class="form-group"><label>Usuario:</label> <input type="email" name="email" value="'+res.data.email+'"></div>';
                        /*html += '<br>';*/
                        html += '<div class="form-group"><label>Contraseña:</label> <input type="text" name="clave" value="'+res.data.clave+'"></div>';
                        html += '</form>';
                        html += '<button id="guardar" name="cuenta" type="button" class="btn btn-success">Guardar</button>';
                        html += '<button id="cancelar" type="button" class="btn btn-danger">Cancelar</button>';
                        $(".datos-cuenta").append(html);
                        break;

                    case "datos-domicilio":
                        $(".datos-domicilio").html("");
                        var html = '<h4>Domicilio:</h4>';
                        html += '<form class="form-datos-domicilio">';
                        html += '<div class="form-group"><label>Direccion:</label> <input type="text" name="direccion" value="'+res.data.datos_usuario_direccion+'"></div>';
                        /*html += '<br>';*/
                        html += '<div class="form-group"><label>CP:</label> <input type="text" name="cp" value="'+res.data.datos_usuario_cp+'"></div>';
                        html += '<div class="form-group"><label>Localidad:</label> <input type="text" name="localidad" value="'+res.data.datos_usuario_localidad+'"></div>';
                        html += '<div class="form-group"><label>Telefono:</label> <input type="text" name="telefono" value="'+res.data.datos_usuario_telefono+'"></div>';
                        html += '</form>';
                        html += '<button id="guardar" name="domicilio" type="button" class="btn btn-success">Guardar</button>';
                        html += '<button id="cancelar" type="button" class="btn btn-danger">Cancelar</button>';
                        $(".datos-domicilio").append(html);
                        break;
                }
            }
                                
        });
            
        listar.fail(function(res){
            console.log(res);
        });
    }
    
    
    var listarDatosPersonales = function(id){
        
        var listarDatos = $.ajax({
            url: URI.MI_CUENTA,
            method: 'GET',
            data: {idUsuario: id,
                   action: 'datosPersonales'},
            dataType: 'json'
        });
        
        listarDatos.done(function(res){        
            
            console.log(res);
        
            if(!res.error){
                
                $listar.html("");
                var dato = res.data;
                var password = "";
                //Para mostrar los caracteres de la clave como asteriscos:
                for(i=0; i<dato.clave.length; i++){
                    password += "*";
                }                
                
                var html = '<h3>Mis Datos:</h3>\
                            <div>\
                            <div class="row mis-datos datos-cuenta">\
                            <h4>Datos de cuenta:</h4>\
                            <label>Usuario:</label>'+" "+dato.email+'\
                            <br>\
                            <label>Contraseña:</label>'+" "+password+'\
                            <br>\
                            <button id="datos-cuenta" type="button" class="btn btn-primary">Editar</button>\
                            </div>\
                            <div class="row mis-datos datos-personales">\
                            <h4>Datos personales:</h4>\
                            <label>Nombre:</label>'+" "+dato.datos_usuario_nombre+'\
                            <br>\
                            <label>Apellido:</label>'+" "+dato.datos_usuario_apellido+'\
                            <br>\
                            <label>Dni:</label>'+" "+dato.datos_usuario_dni+'\
                            </div>\
                            <div class="row mis-datos datos-domicilio">\
                            <h4>Domicilio:</h4>\
                            <label>Direccion:</label>'+" "+dato.datos_usuario_direccion+'\
                            <br>\
                            <label>CP:</label>'+" "+dato.datos_usuario_cp+'\
                            <br>\
                            <label>Localidad:</label>'+" "+dato.datos_usuario_localidad+'\
                            <br>\
                            <label>Telefono:</label>'+" "+dato.datos_usuario_telefono+'\
                            <br>\
                            <button id="datos-domicilio" type="button" class="btn btn-primary">Editar</button>\
                            </div>';

                $listar.append(html);
                
            }else{
                alert("ocurrio un error");
            }
        });
        
        listarDatos.fail(function(res){
            console.log("Error al listar datos de usuario");
        });
    }
    
    resumen(id_usuario, "Proximas");
    
})(jQuery);