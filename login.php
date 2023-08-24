<?php
  // Si la diferencia entre el tiempo actual y el de acceso es mayor a 1 hora, entonces salir.
  session_start(); 
  if(!isset($_SESSION["acceso"])){ 
		//$a= "No PAsaria 1";
  }else{
	  $currentTime = time(); 
	  if(($_SESSION["acceso"] + 1200 )> $currentTime){ 
		echo "<script> window.location='index.php'</script>";
		//$a = "-" .$_SESSION["acceso"] + 120 ."-- ". $currentTime;
	  } 
	  else{
		//$currentTime = time(); 
		if(($currentTime - $_SESSION["acceso"]) > 1200){ 
			session_unset(); 
			session_destroy();
		}
		  
	  }
  }
  ?>

<html>
<head>
 <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="libraries/css/bootstrap.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="libraries/css/estilos.css" type="text/css">
    <!--JSSH Se agrega dependencias de Datatables-->
    <link rel="stylesheet" type="text/css" href="libraries/datatables/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="libraries/datatables/dataTables.bootstrap.min.css">
    <script src="libraries/js/jquery-1.12.3.min.js"></script>
    <script src="libraries/datatables/jquery.dataTables.min.js"></script>
    <script src="libraries/datatables/dataTables.bootstrap.min.js"></script>
    <link rel="icon" type="image/png" href="libraries/img/icon.png" />
</head>
<body>
<div id="cuerpo_pequeno">
<div class="espacio-medio"></div>
<div>
    <img src="libraries/img/logo.jpg" width="490" height="65" alt="ARZYZ" class="img-responsive centrar">    
</div>
<div class="espacio-pequeno"></div>
<div class="">
    <form method="post">
        <div class="form-group">
            <label for="username">Usuario:</label>
            <input id="username" type="text" name="username" class="form-control" placeholder="Usuario" required/> 
        </div>
        <div class="form-group">
            <label for="password">Contraseña:</label>
            <input id="password" type="password" name="password" class="form-control" placeholder="Contraseña" required/>        
        </div>
        <a id="recuperar_password">Olvidé mi contraseña</a><br>
        <div class="centrar">
            <button class="EnviarContactoDetalleProducto btn-lg" id="login">Ingresar</button>
            <!--JSSH Se solicita eliminar el boton Cancelar-->
            <!--<input class="btn btn-default" id="reset-btn" type="reset" value="Cancelar" />-->
        </div>
        <!--JSSH Agregar opción quiero ser proveedor y redireccionar a Contactanos-->
        <!--Redireccionamiento a Desarrollo-->
        <br/>
        <div class="redireccion">
            <p><strong>¿Quieres ser proveedor?
            <a id="quiero_ser_proveedor" href="https://www.arzyz.com/contacto/#formulario_contacto" style="color:#00B74F;"><u>Contáctanos aquí</u></a> <br>
            </strong>
            </p>
            <!--TO DO: Cambiar a redireccionamiento a Producción al momento de migrar-->
            <!--<a id="quiero_ser_proveedor" href="https://www.arzyz.com/contacto/#formulario_contacto">¿Quieres ser proveedor?</a> <br>-->
        </div>
    </form>
    <br>
    <div id="mensaje"></div>
</div>
</div>
<br/>
<br/>
<footer style="width:100%; margin-left: 0px;">
<div><img src = "libraries/img/TipsAnonimos.jpg" class="img-responsive centrar"></div>
</footer>


</body>

</html>