<?php
  session_start(); 
  if(!isset($_SESSION["acceso"])){ 
		//$a= "No PAsaria 1";
		header('location:../index.php');
  }else{
	  $currentTime = time(); 
	  if(($_SESSION["acceso"] + 1200 )> $currentTime){ 
		$_SESSION["acceso"] = $currentTime;
		//echo "<script> window.location='dashboard.php'</script>";
		//$a = "-" .$_SESSION["acceso"] + 120 ."-- ". $currentTime;
	  }else{
		//$currentTime = time(); 
      if(($currentTime - $_SESSION["acceso"]) > 1200){ 
        //session_unset(); 
        //session_destroy(); 
        header('location:../index.php'); 
        //$a= "No PAsaria 2";
        
      }
	  }
  }
	foreach ($_SESSION['validacion'] as $row2) {	
		$usuario = $row2['usuario'];
		$nombre = $row2['nombre'];
		$tipoproveedor = $row2['tipoproveedor'];
	}
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Portal Proveedores | ARZYZ</title>
  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <!-- <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css"> -->
  <link rel="stylesheet" href="../assets/fontawesome-free-6.4.0-web/css/all.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
  <!-- Tempusdominus Bootstrap 4 -->
  <link rel="stylesheet" href="../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="../plugins/icheck-bootstrap/icheck-bootstrap.min.css">
  <!-- JQVMap -->
  <link rel="stylesheet" href="../plugins/jqvmap/jqvmap.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../dist/css/adminlte.min.css">
  <!-- overlayScrollbars -->
  <link rel="stylesheet" href="../plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <!-- Daterange picker -->
  <link rel="stylesheet" href="../plugins/daterangepicker/daterangepicker.css">
  <!-- summernote -->
  <link rel="stylesheet" href="../plugins/summernote/summernote-bs4.min.css">
  <!--Mis estilos -->
  <link rel="stylesheet" href="../assets/css/styles.css?t=<?=time()?>">
  <!-- MDB icon -->
  <link rel="icon" href="../assets/img/icon2.png" type="image/x-icon" />
  <!-- DataTables -->
  <link rel="stylesheet" href="../assets/datatables/DataTables-1.13.4/css/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
  <link href="https://nightly.datatables.net/css/jquery.dataTables.css" rel="stylesheet"/>
  <link href="https://cdn.datatables.net/buttons/1.5.1/css/buttons.dataTables.min.css" rel="stylesheet"/>
</head>
<body class="hold-transition sidebar-mini layout-fixed">
<div class="wrapper">

  <!-- Preloader -->
  <div class="preloader flex-column justify-content-center align-items-center">
    <img class="animation__shake" src="../assets/img/icon2.png" alt="AdminLTELogo" height="60" width="60">
  </div>

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light color_arzyz">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fa-solid fa-bars letra_iconos_blancos"></i></a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="dashboard.php" class="nav-link letra_iconos_blancos">Inicio</a>
      </li>
      <!-- <li class="nav-item d-none d-sm-inline-block">
        <a href="#" class="nav-link">Contact</a>
      </li> -->
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <!-- Messages Dropdown Menu -->
      <li class="nav-item dropdown">
      <div class="dropdown">
        <button class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
          Idioma
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" id="btn_ingles">Ingles</a>
          <a class="dropdown-item" href="#" id="btn_espanol">Español</a>
        </div>
      </div>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-solid fa-user letra_iconos_blancos"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item">
            <!-- Usuario -->
            <div class="media">
              <img src="../assets/img/provedores.png" alt="User Avatar" class="img-size-50 mr-3 img-circle">
              <div class="media-body">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <span id="NombreCont"><?php echo $nombre; ?></span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Usuario End -->
          </a>
          <div class="dropdown-divider"></div>
          <div class="row centrar_texto">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
              <button class="btn btn-danger btn_salir" onclick="CerrarSesion();"><i class="fa-solid fa-right-from-bracket"></i> Salir</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="../dashboard.php" class="brand-link" style="background:#fff;">
      <img src="../assets/img/icon.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3">
      <span class="brand-text font-weight-light"><img src="../assets/img/logo2.jpg" style="width:70%;"></span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item menu-open">
            <a href="../dashboard.php" class="nav-link">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Dashboard
              </p>
            </a>
          </li>
          <li class="nav-header">OPCIONES</li>
          <li class="nav-item">
            <a href="../dashboard.php" class="nav-link">
              <i class="fa fa-shopping-cart"></i>
              <p>
                Ordenes de compra
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="pago.php" class="nav-link active">
              <i class="fa-solid fa-circle-check"></i>
              <p>
                Ordenes Procesadas
              </p>
            </a>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <h1 class="m-0">Ordenes Procesadas</h1>
          </div><!-- /.col -->
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="dashboard.php">Inicio</a></li>
              <li class="breadcrumb-item active">Ordenes Procesadas</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
        <input type="text" style="display:none;" class="form-control" id="txtNumEmpleado" value="<?php echo $_SESSION['Usuario']; ?>" disabled>
        <input type="text" class="form-control" id="txtRFC" style="display:none" value="<?php echo $usuario; ?>"><br>
        <input type="text" class="form-control" id="txtnombreEmpresa"  style="display:none" value="<?php echo $nombre; ?>"><br>
        <input type="text" class="form-control" id="txttipoproveedor" style="display:none" value="<?php echo $tipoproveedor; ?>"><br>
        <!-- tabla listado -->
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="card">
              <div class="card-header bg-success">Facturas en Proceso de Pago</div>
              <div class="card-body">
                <div class="row" id="cargando_tabla">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 centrar_texto">
                    <img id="cargando_tabla_pago" class="cargando_tablas" src="../assets/img/loading.gif">
                  </div>
                </div>
                <div class="row" id="mostrar_pago" style="display:none;">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <table id="tabla_pago" class="table table-hover table-bordered
                    table-responsive-xs table-responsive-sm" style="width: 100%;">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Orden de compra</th>
                          <th>Fecha de Orden de Compra</th>                                   
                          <th>Moneda</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <div id="div_dinos" class="dinos"></div>
        <!-- Modal Cargar Factura -->
        <div class="modal fade" id="ModalCargaFacturaPago" tabindex="-1" data-backdrop="static" data-keyboard="false" aria-labelledby="exampleModalLabel" aria-hidden="true" data-keyboard="false">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header color_arzyz letra_iconos_blancos">
                <h5 class="modal-title" id="titulo_header_factura">Agregar Factura</h5>
                <button id="CerrarModal" type="button" class="close color_blanco" data-dismiss="modal" aria-label="Close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="modal-body">
                <form action="" id="form_cargar_facturas" enctype="multipart/form-data">
                  <div class="row form-group">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblOrdenCompra">Orden de Compra:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtOrdenCompra" name="txtOrdenCompra" disabled>
                    </div>
                  </div>
                  <div class="row form-group">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblRecepcion">Recepción:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtRemision" disabled>
                    </div>
                  </div>
                  <div class="row form-group" style="display:none;">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblFecha_Orden_Compra">Fecha Orden de Compra:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtFechaOc" disabled>
                    </div>
                  </div>
                  <div class="row form-group" style="display:none;">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblRFC">RFC:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtRfc" disabled>
                    </div>
                  </div>
                  <div class="row form-group" style="display:none;">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblTotal">Total:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtTotal" disabled>
                    </div>
                  </div>
                  <div class="row form-group" style="display:none;">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblSubtotal">Subtotal:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtSubtotal" disabled>
                    </div>
                  </div>
                  <div class="row form-group" style="display:none;">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblRfc_Empresa">RFC Empresa:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtRfcEmpresa" disabled>
                    </div>
                  </div>
                  <div class="row form-group">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblTipoMoneda">Tipo de Moneda:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="text" class="form-control" id="txtMonedaDetalleT" disabled>
                    </div>
                  </div>
                  <div class="row form-group">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblFacturaXML">Factura XML:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="file" name="fileToUpload" id="XmlToUpload" class="btn" accept=".xml" onchange="validar_input_file(this)" required="">
                    </div>
                  </div>
                  <div class="row form-group">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <label for="lblFacturaXML">Factura PDF:</label>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <input type="file" name="pdfToUpload" id="pdfToUpload" class="btn" accept=".pdf" onchange="validar_input_file(this)" required="">
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button id="btn_cerrar" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button id="upload" type="button" class="btn btn-success">Subir Documentos</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal detalles factura -->
        <div class="modal fade" id="ModalDetalleFactura" tabindex="-1" data-backdrop="static" data-keyboard="false" aria-labelledby="exampleModalLabel" aria-hidden="true" data-keyboard="false">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header color_arzyz letra_iconos_blancos" style="background: #36AD52;">
                <h5 class="modal-title" id="titulo_header_factura">Detalle de la recepción</h5>
                <button id="CerrarModalDetalle" type="button" class="close color_blanco" data-dismiss="modal" aria-label="Close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="modal-body">
                <form action="" id="form_factura_detalle" enctype="multipart/form-data">
                  <div class="row form-group">
                    <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                      <label for="lblOrdenCompra">Recepción:</label>
                    </div>
                    <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                      <input type="text" class="form-control" id="txtFacturaD" name="txtFacturaD" disabled>
                    </div>
                  </div>
                  <div class="row form-group" id="logo_cargando_detalle_factura_pago">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 centrar_texto">
                      <img id="cargando_tabla_detalle_factura" class="cargando_tablas_modal" src="../assets/img/loading.gif">
                    </div>
                  </div>
                  <div class="row form-group" id="div_tabla_detalle_factura_pago">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <table id="tabla_detalle_factura_pago" class="table table-hover table-bordered table-striped
                      table-responsive-xs table-responsive-sm" style="width: 100%;">
                        <thead>
                          <tr>
                            <th>Descripcion del Articulo</th>
                            <th>Configuración</th>
                            <th>Recibido</th>
                            <th>Pedido</th>
                            <th>Pendiente de entrega</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button id="btn_cerrar_detalle_factura" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <!-- <button id="upload" type="button" class="btn btn-success">Subir Documentos</button> -->
              </div>
            </div>
          </div>
        </div>
        <!-- /.row (main row) -->
      </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
  <footer class="main-footer">
    <strong>Copyright</strong>
    <strong id="icon_copyright">&copy;</strong>
    <strong>2022-2023</strong>
      <!-- <a href="https://linkedin.com/in/leonardo-peña-379165208">Leonardo Peña</a></strong> -->
    <!-- Doofenshmirtz  -->
    <!-- Malvados y Asociados S.A de CV.  -->
    Todos los derechos reservados.
    <div class="float-right d-none d-sm-inline-block">
      <b>Version</b> 3.2.0
    </div>
  </footer>

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
  </aside>
  <!-- /.control-sidebar -->
</div>
<!-- ./wrapper -->

<!-- jQuery -->
<script src="../plugins/jquery/jquery.min.js"></script>
<!-- jQuery UI 1.11.4 -->
<script src="../plugins/jquery-ui/jquery-ui.min.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
  $.widget.bridge('uibutton', $.ui.button)
</script>
<!-- Bootstrap 4 -->
<script src="../plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- daterangepicker -->
<script src="../plugins/moment/moment.min.js"></script>
<script src="../plugins/daterangepicker/daterangepicker.js"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="../plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
<!-- Summernote -->
<script src="../plugins/summernote/summernote-bs4.min.js"></script>
<!-- overlayScrollbars -->
<script src="../plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<!-- AdminLTE App -->
<script src="../dist/js/adminlte.js"></script>
<!-- datatables -->
<script src="https://nightly.datatables.net/js/jquery.dataTables.js"></script>
<script src="https://cdn.datatables.net/buttons/1.2.2/js/buttons.html5.js"></script>
<script src="https://cdn.datatables.net/buttons/1.5.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/1.5.1/js/buttons.colVis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<!-- sweetalert -->
<script src="../assets/js/sweetalert2.js"></script>
<!--CDLCM Se realiza llamado al archivo Javascript propio del portal-->
<script src="../assets/js/payment.js?t=<?=time()?>"></script>
<!-- <script src="javascript/validacion_cumplimiento.js?t=<//?=time()?>"></script> -->
</body>
</html>
