<?php
	header('Content-Type: text/html; charset=utf-8');

	$param = $_POST['param'];
	switch($param) {
        case '1':
			$data = array();
			$query = array();
			$query2 = array();
			$proveedor = utf8_encode($_POST['proveedor']);
			$mensaje = "";
			$validar = true;
			$ultimaOrden = '';
			$ultimaFactura = '';
			
			include './db/conectar.php';
			$sql = "{call PortalProveedores_ObtenerRecepciones(?)}";
			$params = array($proveedor);
			$stmt = sqlsrv_query($conn, $sql, $params);
			$stmt1 = sqlsrv_query($conn, $sql, $params);

			if($stmt === false) {
				$validar = false;
				$mensaje = sqlsrv_errors();
				$data = array(
					"estatus" => 'error_consulta',
					"Validar" => $validar,
					"mensaje" => $mensaje[0]['message']
				);
				echo json_encode($data);
				die();
			}else{
				while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
					// var_dump($row);
					$record = array(
						"Factura"  => $row['Factura']
					);
					array_push($query, $record);
				}

				// die();

				while( $row1 = sqlsrv_fetch_array($stmt1, SQLSRV_FETCH_ASSOC)) {
					if(strcmp($ultimaOrden, $row1['OrdenCompra']) != 0) {
						$query2[] = [
							"OrdenCompra"       => $row1['OrdenCompra'], //Orden de compra
							"FechaOrdenCompra"  => $row1['FechaOrdenCompra']->format('d/m/Y'), //Fecha de orden de compra						 
							"TipoMoneda"        => $row1['TipoMoneda'], //Moneda
							"RFCEmpresa"		=> $row1['RFCEmpresa'], //RFC de la intercompañia ARZYZ
							"Factura" 		   => [] //Arreglo para agregar factura asociadas a la orden de compra
						];
						$ultimaOrden = $row1['OrdenCompra'];
					}
	
					$indice = count($query2) - 1;
					if($indice < 0) {
						die('Error: No se agregó orden de compra.');
					}
	
					if(strcmp($ultimaFactura, utf8_encode ($row1['Factura'])) != 0) {
					
						$query2[$indice]["Factura"][] = [
							"OrdenCompra"       => $row1['OrdenCompra'], //Orden de compra
							"FechaFactura" => $row1['FechaFactura'] != null ? $row1['FechaFactura']->format('d/m/Y'):"", //Fecha de recepcion
							"Factura" 		   => utf8_encode ($row1['Factura']), //No Factura	
							"Subtotal" 			=> number_format($row1['Subtotal'],2), //Subtotal											
							"Impuesto"			=> $row1['Impuesto'],
							"Total" 			=> number_format($row1['Total'],2), //Total
							"Estatus"	 		=> $row1['Estatus'],
							"RFC"	 			=> $row1['RFC'],
							"RFCEmpresa"		=> $row1['RFCEmpresa'], //RFC de la intercompañia ARZYZ
							"TipoMonedaDetalle"        => $row1['TipoMoneda'], //Moneda				
						];
					
						$ultimaFactura = utf8_encode ($row1['Factura']);
					}
				}

				if(count($query2) > 0){
					$data = array(
						"estatus" => "success",
						"data" => $query2
					);
				}else{
					$data = array(
						"estatus" => 'error',
						"mensaje" => "No hay registros"
					);	
				}
				sqlsrv_free_stmt( $stmt);		
				sqlsrv_close($conn);
			}	

			ob_clean();//clears the output buffer
			echo json_encode($data);
		break;
		
		case '2': //Consulta
			$data = array();
			$query = array();
			$Factura = $_POST['Factura'];
			$mensaje = "";
			$validar = true;
			
			include './db/conectar.php';
			$sql = "{call PortalProveedores_ObtenerDetalleRecepciones(?)}";
			$params = array($Factura);
			$stmt = sqlsrv_query($conn, $sql, $params);
			if($stmt === false) {
				$validar = false;
				$mensaje = sqlsrv_errors();
				$data = array(
					"estatus" => 'error_consulta',
					"Validar" => $validar,
					"mensaje" => $mensaje[0]['message']
				);
				echo json_encode($data);
				die();
			}else{
				while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
					$record = array(
						"DescripcionArticulo" => utf8_encode($row['DescripcionArticulo']),
						"Configuracion" => utf8_encode($row['Configuracion']),				
						"Recibido" => $row['Recibido'],	
						"Pedido" => $row['Pedido'],
						"Pendiente" => $row['Pendiente'],		
					);		
					array_push($query, $record);
				}

				if(count($query) > 0){
					$data = array(
						"estatus" => "success",
						"data" => $query
					);
				}else{
					$data = array(
						"estatus" => 'error',
						"mensaje" => "No hay registros"
					);	
				}
				sqlsrv_free_stmt($stmt);		
				sqlsrv_close($conn);
			}
			ob_clean();//clears the output buffer
			echo json_encode($data);	
		break;

		case '3': //Consulta
			$data = array();
			$query = array();
			$query2 = array();
			$proveedor = utf8_encode($_POST['proveedor']);
			$mensaje = "";
			$validar = true;
			$ultimaOrden = '';
			$ultimaFactura = '';
			
			include './db/conectar.php';
			$sql = "{call PortalProveedores_ObtenerRecepcionesEnProcesoDePago(?)}";
			$params = array($proveedor);
			$stmt = sqlsrv_query($conn, $sql, $params);
			$stmt1 = sqlsrv_query($conn, $sql, $params);

			if($stmt === false) {
				$validar = false;
				$mensaje = sqlsrv_errors();
				$data = array(
					"estatus" => 'error_consulta',
					"Validar" => $validar,
					"mensaje" => $mensaje[0]['message']
				);
				echo json_encode($data);
				die();
			}else{
				while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
					$record = array(
						"Factura"  => $row['Factura']
					);
					array_push($query, $record);
				}

				while( $row1 = sqlsrv_fetch_array($stmt1, SQLSRV_FETCH_ASSOC)) {
					if(strcmp($ultimaOrden, $row1['OrdenCompra']) != 0) {
						$query2[] = [
							"OrdenCompra"       => $row1['OrdenCompra'], //Orden de compra
							"FechaOrdenCompra"  => $row1['FechaOrdenCompra']->format('d/m/Y'), //Fecha de orden de compra						 
							"TipoMoneda"        => $row1['TipoMoneda'], //Moneda
							"RFCEmpresa"		=> $row1['RFCEmpresa'], //RFC de la intercompañia ARZYZ
							"Factura" 		   => [] //Arreglo para agregar factura asociadas a la orden de compra
						];
						$ultimaOrden = $row1['OrdenCompra'];
					}
	
					$indice = count($query2) - 1;
					if($indice < 0) {
						$data = array(
							"estatus" => 'error',
							"mensaje" => 'Error: No se agregó orden de compra.'
						);
						echo json_encode($data);
						die();
					}
	
					if(strcmp($ultimaFactura, utf8_encode ($row1['Factura'])) != 0) {
						$query2[$indice]["Factura"][] = [
							"OrdenCompra"       => $row1['OrdenCompra'], //Orden de compra
							"FechaFactura" => $row1['FechaFactura'] != null ? $row1['FechaFactura']->format('d/m/Y'):"", //Fecha de recepcion
							"Factura" 		   	=> utf8_encode ($row1['Factura']), //No Factura	
							"Subtotal" 			=> number_format($row1['Subtotal'],2), //Subtotal											
							"Impuesto"			=> $row1['Impuesto'],
							"Total" 			=> number_format($row1['Total'],2), //Total
							"Estatus"	 		=> $row1['Estatus'],
							"RFC"	 			=> $row1['RFC'],			
						];
					
						$ultimaFactura = utf8_encode ($row1['Factura']);
					}
				}

				if(count($query2) > 0){
					$data = array(
						"estatus" => "success",
						"data" => $query2
					);
				}else{
					$data = array(
						"estatus" => 'error',
						"mensaje" => "No hay registros"
					);	
				}
				sqlsrv_free_stmt( $stmt);		
				sqlsrv_close($conn);
			}	

			ob_clean();//clears the output buffer
			echo json_encode($data);
		break;

		case '6': //Consulta
			//JSSH Se obtiene URL a la que se accede desde el navegador
			$URL  = "http://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
			
			$USER = $_POST['username'];
			$PASS = $_POST['password'];
			$query = array();
			$query2 = array();
				//
				if(isset($_POST['captcha'])){
				  $captcha=$_POST['captcha'];
				}
				if(!$captcha){
					$record2 = array(
						"usuario" => "Favor de Capturar el captcha"
						
					);
					array_push($query, $record2);
					session_start();
					$_SESSION['validacion'] = $query;
				}else{
					/*
					$secretKey = "6Lcf2fcbAAAAAMBfVkIXGhBaxFYLhMZ8_T3v0tol";
					$url =  'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secretKey) .  '&response=' . urlencode($captcha);
					$response = file_get_contents($url);
					$responseKeys = json_decode($response,true);
					if($responseKeys["success"]) {
					*/
					$secret = '0xb233eDE533c821E94A437BC0Fd7C9f293358457c';
					$verifyResponse = file_get_contents('https://hcaptcha.com/siteverify?secret='.$secret.'&response='.$captcha.'&remoteip='.$_SERVER['REMOTE_ADDR']);
					$responseData = json_decode($verifyResponse);
					if($responseData->success){
					//
					/*------>>>-----<<<------*/
					/*------>>>-----<<<------*/
			
						include './db/conectar.php';
						//JSSH Se agrega tercer parametro URL
						$sql = "{call PortalProveedores_ValidarCredenciales(?,?,?)}";
						$params = array($USER ,$PASS,$URL);
						$stmt = sqlsrv_query($conn, $sql, $params);
						if ( $stmt === false) {
							die( print_r( sqlsrv_errors(), true) );
						}	
						session_start();
						while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
							$record = array(
								"usuario"	=> utf8_encode($row['USUARIO']),
								"nombre" 	=> utf8_encode($row['NOMBRE']),
								"ultimoacceso" => $row['ACCESO'],
								"tipoproveedor" => $row['TIPOPROVEEDOR']
								
								);
									
							array_push($query, $record);
							
						}
						$size = sizeof($query);
						if($size != 0){
							$_SESSION["acceso"] = time();	
						}
						//$_SESSION["acceso"] = time();
						$_SESSION['validacion'] = $query;
					/*------>>>-----<<<------*/
					/*------>>>-----<<<------*/
					//
					sqlsrv_free_stmt( $stmt);		
					sqlsrv_close($conn);
					}else{
						$record2 = array(
						"usuario" => "Error en envio de información"
						);
						array_push($query, $record2);
						session_start();
						$_SESSION['validacion'] = $query;
					}
				}
					
			
			echo json_encode($_SESSION['validacion']);
			//return $envio; 
			

		break;

		case '7': //Consulta
			session_start();
			session_unset();
			session_destroy();
			echo json_encode("true");

		break;

		case '8': //Consulta
			$query = array();
			include './db/conectar2.php';
			$sql = "{call PortalProveedores_RecuperarContrasena(?)}";
			$params = array($username);
			$stmt = sqlsrv_query($conn, $sql, $params);

			if ( $stmt === false) {
				//die( print_r( sqlsrv_errors(), true) );	// Se comentó esta línea por que manda un array con con valores del correo de sql
				return array(
					"correo"=> true
				);
			}

			while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
				if ($row['CORREO']){
					$registro = array(
						"correo"	=> utf8_encode($row['CORREO']),
					);
					array_push($query, $registro);
				}			
			}
			sqlsrv_free_stmt( $stmt);		
			sqlsrv_close($conn);

			return array(
				"correo"=> count($query) > 0 ? true : false,
				"data"=>$query
			);
		
		break;
		case '9':
			$datos = array();
			$data = null;
			$query = array();
			$validar = true;
			$mensaje;
			include './db/conectar.php';

			if (isset($_POST['nombre_provedor']) && (isset($_FILES['cumplimiento_pago']) && $_FILES['cumplimiento_pago']['error'] === UPLOAD_ERR_OK)) {
				$nombre_proveedor = utf8_encode($_POST['nombre_provedor']);
				$archivo_cumplimiento = $_FILES['cumplimiento_pago'];
				$temp =  $archivo_cumplimiento['tmp_name'];
				$fname = date('Y-m-d').'_'.$archivo_cumplimiento['name'];
				$fecha_actual = date('Y-m-d');
				$path_documento = "//LP-CDELACRUZ/cumplimientos_pago/".$fname;

				$sp = "{call PortalProveedores_validar_cumplimientopago(?,?)}";
				$params = array($nombre_proveedor, $fecha_actual);
				$stmt = sqlsrv_query($conn, $sp, $params);

				if ( $stmt === false) {
					$data = array(
						"estatus" => "error",
						"Validar" => false,
						"mensaje" => "Ocurrio un error inesperado"
					);
					echo json_encode($data);
					die();
				}

				$row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
				$row = $row == NULL ? array() : $row;
				if (count($row) <= 1) {
					$sql = "{call portalproveedores_insertar_cumplimientopago(?,?,?,?)}";
				
					$params = array($nombre_proveedor, $fname, $path_documento, $fecha_actual);
					$stmt = sqlsrv_query($conn, $sql, $params);

					if ($stmt) {
						$move =  move_uploaded_file($temp, $path_documento);
				
						sqlsrv_free_stmt( $stmt);		
						sqlsrv_close($conn);

						if ($validar) {
							$data = array(
								"estatus" => "success",
								"Validar" => $validar
							);
						}else{
							$data = array(
								"estatus" => "error",
								"Validar" => $validar,
								"mensaje" => "Ocurrio un error"
							);
						}

					}else{
						$validar = false;
						$mensaje = sqlsrv_errors();

						$data = array(
							"estatus" => "error_sql",
							"Validar" => $validar,
							"mensaje" => $mensaje
						);
					}	
				}else{
					$data = array(
						"estatus" => "error_archivo_duplicado",
						"mensaje" => "Su archivo de este mes ya fue cargado con anterioridad"
					);
				}
			}else{
				$data = array(
					"estatus" => "error_datos_incompletos",
					"Validar" => $validar,
					"mensaje" => "faltan parametros para realizar la acción."
				);
			}
			echo json_encode($data);
		break;

		case '10':
			$data = null;
			$query = array();
			$validar = true;
			$mensaje;
			include './db/conectar.php';

			if (isset($_POST['nombre_proveedor']) ) {
				$nombre_proveedor = utf8_encode($_POST['nombre_proveedor']);
				$fecha_actual = date('Y-m-d');

				$sql = "{call PortalProveedores_validar_mes_cumplimientopago(?,?)}";
				$params = array($nombre_proveedor, $fecha_actual);
				$stmt = sqlsrv_query($conn, $sql, $params);
				
				if ($stmt) {
					$row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
					$row = $row == NULL ? array() : $row;
					if (count($row) > 0) {
						list ($year,$month,$day) = explode("-", $row['fecha_registro']);
						list ($year_now,$month_now,$day_now) = explode("-", date('Y-m-d'));

						if ($day >= 1 && $month != $month_now) {
							$data = array(
								"estatus" => "info",
								"mensaje" => "Favor de adjuntar su cumplimiento de pago del mes correspondiente"
							);
						}else{
							$data = array(
								"estatus" => "success"
							);
						}
					}else{
						$data = array(
							"estatus" => "info",
							"mensaje" => "Favor de adjuntar su cumplimiento de pago del mes correspondiente"
						);
					}
					sqlsrv_free_stmt( $stmt);		
					sqlsrv_close($conn);
				}else{
					$validar = false;
					$mensaje = sqlsrv_errors();

					$data = array(
						"estatus" => "error_sql",
						"Validar" => $validar,
						"mensaje" => $mensaje
					);
				}	
			}else{
				$data = array(
					"estatus" => "error_datos_incompletos",
					"Validar" => $validar,
					"mensaje" => "faltan parametros para realizar la acción."
				);
			}
			echo json_encode($data);
		break;

		case '11':
			$data = null;
			$query = array();
			$validar = true;
			$mensaje;
			include './db/conectar.php';

			if (isset($_POST['nombre_proveedor']) ) {
				$nombre_proveedor = utf8_encode($_POST['nombre_proveedor']);
				$fecha_actual = date('Y-m-d');

				$sql = "{call PortalProveedores_validar_mes_cumplimientopago(?,?)}";
				$params = array($nombre_proveedor, $fecha_actual);
				$stmt = sqlsrv_query($conn, $sql, $params);
				
				if ($stmt) {
					$row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
					$row = $row == NULL ? array() : $row;
					if (count($row) > 0) {
						list ($year,$month,$day) = explode("-", $row['fecha_registro']);
						list ($year_now,$month_now,$day_now) = explode("-", date('Y-m-d'));

						if ($day >= 1 && $month != $month_now) {
							$data = array(
								"estatus" => "info",
								"mensaje" => "Favor de adjuntar su cumplimiento de pago del mes correspondiente"
							);
						}else{
							$data = array(
								"estatus" => "success"
							);
						}
					}else{
						$data = array(
							"estatus" => "info",
							"mensaje" => "Favor de adjuntar su cumplimiento de pago del mes correspondiente"
						);
					}
					sqlsrv_free_stmt( $stmt);		
					sqlsrv_close($conn);
				}else{
					$validar = false;
					$mensaje = sqlsrv_errors();

					$data = array(
						"estatus" => "error_sql",
						"Validar" => $validar,
						"mensaje" => $mensaje
					);
				}	
			}else{
				$data = array(
					"estatus" => "error_datos_incompletos",
					"Validar" => $validar,
					"mensaje" => "faltan parametros para realizar la acción."
				);
			}
			echo json_encode($data);
		break;

		case '12':
			$data = null;
			$query = array();
			$validar = true;
			$mensaje;
			include './db/conectar.php';

			// Declaramos y definimos las variables necesarias que vienen del formulario html.
			// cada variable se valida con el operador ternario para verificar si existe en caso de no existir 
			// se crea y se le asigna un valor vacío.
			$ordenCompra = (isset($_POST['txtOrdenCompra'])) ? trim($_POST['txtOrdenCompra']) : '';
			$Remision = (isset($_POST['txtRemision'])) ? trim($_POST['txtRemision']) : '';
			$FechaOc = (isset($_POST['txtFechaOc'])) ? trim($_POST['txtFechaOc']) : '';
			$Rfc = (isset($_POST['txtRfc'])) ? trim($_POST['txtRfc']) : '';
			$Total = (isset($_POST['txtTotal'])) ? trim($_POST['txtTotal']) : '';
			$Subtotal = (isset($_POST['txtSubtotal'])) ? trim($_POST['txtSubtotal']) : '';
			$RfcEmpresa = (isset($_POST['txtRfcEmpresa'])) ? trim($_POST['txtRfcEmpresa']) : '';
			$RFCTabla = (isset($_POST['txtRfcEmpresa'])) ? trim($_POST['txtRfcEmpresa']) : '';
			$MonedaDetalleT = (isset($_POST['txtMonedaDetalleT'])) ? ($_POST['txtMonedaDetalleT']) : '';
			$XmlToUpload = (isset($_FILES['XmlToUpload'])) ? ($_FILES['XmlToUpload']) : 0;
			$pdfToUpload = (isset($_FILES['pdfToUpload'])) ? ($_FILES['pdfToUpload']) : 0;
			// Cuando el tipo de proveedor es igual a 1 y se selecciona la casilla carta aporte estas variables reciben la informacion de los siguientes 3 archivos. 
			$cartaPorte = (isset($_POST['cartaPrt'])) ? trim($_POST['cartaPrt']) : '';
			$xmlCartaPorteToUpload = (isset($_FILES['xmlCartaPorteToUpload'])) ? ($_FILES['xmlCartaPorteToUpload']) : 0;
			$pdfCartaPorteToUpload = (isset($_FILES['pdfCartaPorteToUpload'])) ? ($_FILES['pdfCartaPorteToUpload']) : 0;
			$evidenciaPDFCpte = (isset($_FILES['evidenciaPDFCpte'])) ? ($_FILES['evidenciaPDFCpte']) : 0;
			$tipo_proveedor = (isset($_POST['txttipoproveedor'])) ? trim($_POST['txttipoproveedor']) : '';
			//CDLCM Margen definida por el área contable
			$margen = 20.00;

			// se define un arreglo con las posibles respuestas de los archivos cargados
			$errores = array(UPLOAD_ERR_OK => 'Carga exitosa'
			, UPLOAD_ERR_INI_SIZE => 'Excede el tamaño de carga (PHP)'
			, UPLOAD_ERR_FORM_SIZE => 'Excede el tamaño de carga (HTML)'
			, UPLOAD_ERR_PARTIAL => 'Carga incompleta'
			, UPLOAD_ERR_NO_FILE => 'No se seleccionó archivo'
			, UPLOAD_ERR_NO_TMP_DIR => 'Falta carpeta temporal'
			, UPLOAD_ERR_CANT_WRITE => 'No se guardó el archivo'
			, UPLOAD_ERR_EXTENSION => 'Una extensión bloqueó la carga');

			$res = [
				'factura' => ($Remision != ''),
				'xml' => $XmlToUpload,
				'pdf' => $pdfToUpload,
				'cartaPortePdf' => $pdfCartaPorteToUpload,
				'cartaPorteXml' => $xmlCartaPorteToUpload,
				'evidenciaCpte' => $evidenciaPDFCpte
			];

			$xml = new SimpleXMlElement($XmlToUpload['tmp_name'], 0, true);
			$uuid_xml = (string)$xml->children('cfdi',true)->Complemento->children('tfd',true)->attributes()['UUID'];

			$sql = "{call PortalProveedores_ValidarNombreArchivos(?,?,?)}";
			$params = array($XmlToUpload['tmp_name'], $pdfToUpload['tmp_name'], $uuid_xml);
			$stmt = sqlsrv_query($conn, $sql, $params);

			if ($stmt === false) {
				$validar = false;
				$mensaje = sqlsrv_errors();
				$data = array(
					"estatus" => 'error_consulta',
					"Validar" => $validar,
					"mensaje" => $mensaje[0]['message'],
					"sp" => $sql,
				);
				echo json_encode($data);
				die();
			}

			while($row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ){
				$existeRegistro = $row['Existe'];
			}

			switch ($tipo_proveedor) {
				case '1':
					//CDLCM Se valida si el archivo cargado ya existe en la base de datos en caso de que si seguira el flujo normal.
					if ($existeRegistro == '1') {
						//CDLCM Se valida si dentro del arreglo res existe el indice pdf.
						if($res['pdf']) {
							//CDLCM Se obtiene el nombre del archivo.
							$archivo = $pdfToUpload["name"];
							//CDLCM Aqui se define la ruta donde se alamacenaran los archivos xml.
							//$ruta ="//C:/PDF_Proveedores/";
							$ruta ="PDF_Proveedores/";
							// $ruta = 'prueba_provedores/';
							//CDLCM Se valida si el archivo no se guardo correctamene en la carpeta indicada.
							if(!move_uploaded_file($pdfToUpload["tmp_name"], $ruta . $archivo)) {
							  // Hubo error, poner propiedad en falso
							  $res['pdf'] = false;
							}     
						}
						//CDLCM Se valida si dentro del arreglo res existe el indice xml.
						if($res['xml']){
							//CDLCM Se valida si el archivo xml esta cargado correctamente o no.
							if( $XmlToUpload['error'] !== UPLOAD_ERR_OK ){
								// error_log($errores[$_FILES['XmlToUpload']['error']]);
								$data = array(
									"estatus" => "error",
									"Validar" => false,
									"mensaje" => $errores[$XmlToUpload['error']]
								);
								echo json_encode($data);
								die();
							}
					
							//CDLCM Se valida si el tipo de provedor es 1, si es 1 entonces se valida si los 3 archivos extra estan cargados o no.
							if($tipo_proveedor == '1' && $CheckCpte != ""){
								$archivoPDFCpte = $pdfCartaPorteToUpload["name"];
								//$rutaPDFCpte ="//C:/CARTAPDF_Proveedores/";
								$rutaPDFCpte = "CARTAPDF_Proveedores/";
					
								$archivoXMLCpte = $xmlCartaPorteToUpload["name"];
								//$rutaXMLCpte ="//C:/CARTAXML_Proveedores/";
								$rutaXMLCpte = "CARTAXML_Proveedores/";
					
								$evidenceCpte = $evidenciaPDFCpte["name"];
								//$rutaEvidenceCpte ="//C:/EVIDENCIA_Proveedores/";
								$rutaEvidenceCpte = "EVIDENCIA_Proveedores/";
								$filepathEvidencia = $rutaEvidenceCpte.$evidenceCpte;
								$filepathPDFCpte = $rutaPDFCpte.$archivoPDFCpte;
								$filepathXMLCpte = $rutaXMLCpte.$archivoXMLCpte;
					
							}else if($tipo_proveedor == '1' && $CheckCpte == ""){
								$evidenceCpte = $evidenciaPDFCpte["name"];
								//$rutaEvidenceCpte = "//C:/EVIDENCIA_Proveedores/";
								$rutaEvidenceCpte = "EVIDENCIA_Proveedores/";
								$filepathEvidencia = $rutaEvidenceCpte.$evidenceCpte;
								$archivoPDFCpte = "";
								$filepathPDFCpte = "";         
								$archivoXMLCpte = "";
								$filepathXMLCpte = "";
								//$rutaEvidenceCpte = "";
					
								//$filepathEvidencia = "";
							}
					
							//CDLCM definimos las siguientes variables y las igualamos a las propiedades del objeto xml.
							$total_xml = (string)$xml['Total'];
							$folio_xml = (string)$xml['Folio'];
							$rfc_xml = (string)$xml->children('cfdi',true)->Emisor[0]->attributes()['Rfc'];
							
							$rfcEmpresa_xml = (string)$xml->children('cfdi',true)->Receptor[0]->attributes()['Rfc'];
							$fechaEntrada_xml = (string)$xml['Fecha'];
					
							$moneda_xml = (string)$xml['Moneda'];
							$tipoRegistro_xml = (string)$xml['TipoDeComprobante'];
							$filepath = $ruta.$archivo;

							//CDLCM Se obtiene el total que viene del formulario.
							$TotalReal = str_replace(',', '', $Total);
							$TotalReal_menos = $TotalReal - $margen;
							$TotalReal_mas = $TotalReal + $margen;

							if ($total_xml <= $TotalReal_menos && $total_xml >= $TotalReal_mas) {
								$data = array(
									"estatus" => "error",
									"mensaje" => 'Monto de factura no coincide.'
								);
								echo json_encode($data);
								die();
							}

							if ($rfcEmpresa_xml != $RFCTabla) {
								$data = array(
									"estatus" => "error",
									"mensaje" => 'Los rfc de la empresa no coinciden.'
								);
								echo json_encode($data);
								die();
							}
							
							//CDLCM Se valida que la moneda proveniente del xml y del formulario sean iguales para continuar con el flujo.
							if($MonedaDetalleT == $moneda_xml){
								//CDLCM Se valida que el rfc empresa proveniente del xml y del formulario sean iguales para continuar con el flujo.
								if($rfcEmpresa_xml == $RFCTabla){
									$total_xml = str_replace(",","",$total_xml);
									//CDLCM el sp valida que la información del xml sea correcta y corresponda a nuesra información.
									$sql = "{call PortalProveedores_ValidarXML(?,?,?)}";
									$params = array($rfc_xml, $total_xml, $Remision);
									$result = sqlsrv_query($conn, $sql, $params );

									if ($result === false) {
										$validar = false;
										$mensaje = sqlsrv_errors();
										$data = array(
											"estatus" => 'error_consulta',
											"Validar" => $validar,
											"mensaje" => $mensaje[0]['message'],
											"sp" => $sql,
										);
										echo json_encode($data);
										die();
									}
						
									//CDLCM Se valida que el sp no haya traido registros de ser asi continuamos con el flujo.
									if($row = sqlsrv_fetch_array($result)){
										//CDLCM se obtine el nombre del archivo.
										$archivoXML = $XmlToUpload['name'];
										//CDLCM Definimos la ruta en la que se guardaran los archivos.
										//$rutaXML = "//C:/XML_Proveedores/";
										$rutaXML = 'XML_Proveedores/';
										$filepathXML = $rutaXML.$archivoXML;

										//CDLCM Validamos si el archivo se guardo correctamente en la ruta indicada.
										if(move_uploaded_file($XmlToUpload['tmp_name'], $rutaXML . $archivoXML)){
											//CDLCM Validamos si el proveedor es tipo 1 continuamos y validamos los siguientes archivos requeridos en caso de que no esas variables se mandan vacias.
											if($tipoproveedor == '1'  && $CheckCpte != ""){
												if(move_uploaded_file($pdfCartaPorteToUpload["tmp_name"], $rutaPDFCpte . $archivoPDFCpte)){
												}
												//JSSH Validación para ir al directorio y cargar el documento XML de Carta Porte
												if(move_uploaded_file($xmlCartaPorteToUpload["tmp_name"], $rutaXMLCpte . $archivoXMLCpte)){
										
												}
												if(move_uploaded_file($evidenciaPDFCpte["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
												}  
											}
							
											if($tipoproveedor == '1' && $CheckCpte == ""){
												if(move_uploaded_file($evidenciaPDFCpte["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
												}                 
											}       
							
											//CDLCM El siguiente sp nos inserta la información de la orden de compra.
											$sql =  "{call PortalProveedores_InsertarDatosOrdenCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";                       
											$params = array($ordenCompra,$rfc_xml,$folio_xml,$Remision,$filepathXML,$filepath,$archivoXML,$archivo,$uuid_xml,$Subtotal,$total_xml,$moneda_xml,$tipoRegistro_xml,$fechaEntrada_xml,$archivoPDFCpte,$filepathPDFCpte,$archivoXMLCpte,$filepathXMLCpte,$evidenceCpte,$filepathEvidencia);
											$stmt = sqlsrv_query($conn, $sql, $params);
											
											if($stmt === false){
												$mensaje = sqlsrv_errors();
												$data = array(
													"estatus" => "error",
													"Validar" => false,
													"mensaje" => $mensaje[0]['message'],
													"sp" => $sql
												);
												echo json_encode($data);
												die();
											}
							
											sqlsrv_free_stmt( $stmt);		
							
											//CDLCM Se valida que dentro del arreglo res existan las propiedades de los archivos xml y pdf, cargados anterior mente.
											if($res['xml'] && $res['pdf']) {
												//CDLCM El siguiente sp nos permite actualizar el estatus de la factura.
												$sql = "{call PortalProveedores_CambioEstatus(?,?)}";
												$params = array($Remision, $ordenCompra);
												$stmt = sqlsrv_query($conn, $sql, $params);
												if ($stmt === false) {
													$mensaje = sqlsrv_errors();
													$data = array(
														"estatus" => "error",
														"Validar" => false,
														"mensaje" => $mensaje[0]['message'],
														"sp" => $sql
													);
													echo json_encode($data);
													die();
												}
												sqlsrv_free_stmt($stmt);
											}
											sqlsrv_close($conn);
											$data = array(
												"estatus" => "success",
												"mensaje" => 'Documentos cargados exitosamente'
											);
											echo json_encode($data);
										}else{
											$data = array(
												"estatus" => "error",
												"mensaje" => 'Error al mover a directorio destino'
											);
											echo json_encode($data);
											die();
										} 
						
										//JSSH En caso de no coincidir exactamente en la validación del SP VALIDA_XML en el total real 
										//entrara a validar si la diferencia en el monto cumple con el margen especificado
									}else if($total_xml >= $TotalReal - $margen && $total_xml <= $TotalReal + $margen){
										
										$archivoXML = $XmlToUpload['name'];
										//$rutaXML = "//C:/XML_Proveedores/";
										$rutaXML = "XML_Proveedores/";
						
										$filepathXML = $rutaXML.$archivoXML;
						
										if(move_uploaded_file($XmlToUpload['tmp_name'], $rutaXML . $archivoXML)){
											//CDLCM Validamos si el proveedor es tipo 1 continuamos y validamos los siguientes archivos requeridos en caso de que no esas variables se mandan vacias.
											if($tipoproveedor == '1'  && $CheckCpte != ""){
												if(move_uploaded_file($pdfCartaPorteToUpload["tmp_name"], $rutaPDFCpte . $archivoPDFCpte)){
												}
												//JSSH Validación para ir al directorio y cargar el documento XML de Carta Porte
												if(move_uploaded_file($xmlCartaPorteToUpload["tmp_name"], $rutaXMLCpte . $archivoXMLCpte)){
										
												}
												if(move_uploaded_file($evidenciaPDFCpte["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
												}  
												
											}
							
											if($tipoproveedor == '1' && $CheckCpte == ""){
												if(move_uploaded_file($evidenciaPDFCpte["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
												}                 
											}     
											
											//CDLCM El siguiente sp nos inserta la información de la orden de compra.
											$sql =  "{call PortalProveedores_InsertarDatosOrdenCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";                       
											$params = array($ordenCompra,$rfc_xml,$folio_xml,$Remision,$filepathXML,$filepath,$archivoXML,$archivo,$uuid_xml,$Subtotal,$total_xml,$moneda_xml,$tipoRegistro_xml,$fechaEntrada_xml,$archivoPDFCpte,$filepathPDFCpte,$archivoXMLCpte,$filepathXMLCpte,$evidenceCpte,$filepathEvidencia);
											$stmt = sqlsrv_query($conn, $sql, $params);
											
											if ($stmt === false) {
												$mensaje = sqlsrv_errors();
												$data = array(
													"estatus" => "error",
													"Validar" => false,
													"mensaje" => $mensaje[0]['message'],
													"sp" => $sql
												);
												echo json_encode($data);
												die();
											}
											sqlsrv_free_stmt( $stmt);		
							
											//CDLCM Se valida que dentro del arreglo res existan las propiedades de los archivos xml y pdf, cargados anterior mente.
											if($res['xml'] && $res['pdf']) {
												//CDLCM El siguiente sp nos permite actualizar el estatus de la factura.
												$sql = "{call PortalProveedores_CambioEstatus(?,?)}";
												$params = array($Remision,$ordenCompra);
							
												$stmt = sqlsrv_query($conn, $sql, $params);
												if ($stmt === false) {
													$mensaje = sqlsrv_errors();
													$data = array(
														"estatus" => "error",
														"Validar" => false,
														"mensaje" => $mensaje[0]['message'],
														"sp" => $sql
													);
													echo json_encode($data);
													die();
												}
												sqlsrv_free_stmt( $stmt);		
											}
											sqlsrv_close($conn);
											$data = array(
												"estatus" => "success",
												"mensaje" => 'Documentos cargados exitosamente'
											);
											echo json_encode($data);
										}
									}else{
										$data = array(
											"estatus" => "error",
											"mensaje" => 'Por favor verifique el contenido de los documentos'
										);
										echo json_encode($data);
										die();
									}        
								}else{
									$data = array(
										"estatus" => "error",
										"mensaje" => 'Los rfc de la empresa no coinciden.'
									);
									echo json_encode($data);
									die();
								}
							}else{
								$data = array(
									"estatus" => "error",
									"mensaje" => 'Por favor validar el tipo de moneda en la factura'
								);
								echo json_encode($data);
								die();
							}
						}
					}else{
						$data = array(
							"estatus" => "info",
							"mensaje" => 'Tus documentos ya fueron cargados con anterioridad.'
						);
						echo json_encode($data);
						die();
					}
				break;
				
				default:
					//CDLCM Se valida si el archivo cargado ya existe en la base de datos en caso de que no seguira el flujo normal.
					if ($existeRegistro == '1') {
						// Solo si se subió archivo PDF y no tuvo error
						if($res['pdf']) {
							$archivo = $pdfToUpload["name"];
							//CDLCM Definimos la ruta en la que se guardaran los archivos.
							//$ruta ="//C:/PDF_Proveedores/";
							$ruta ="PDF_Proveedores/";
							if(!move_uploaded_file($pdfToUpload["tmp_name"], $ruta . $archivo)) {
							  // Hubo error, poner propiedad en falso
							  $res['pdf'] = false;
							}     
						}
						if($res['xml']){
							//CDLCM Se valida si el archivo xml esta cargado correctamente o no.
							if( $XmlToUpload['error'] !== UPLOAD_ERR_OK ){
								// error_log($errores[$_FILES['XmlToUpload']['error']]);
								$data = array(
									"estatus" => "error",
									"Validar" => false,
									"mensaje" => $errores[$XmlToUpload['error']]
								);
								echo json_encode($data);
								die();
							}
					
							//CDLCM Se tiene que definir estas variables aunque no se usen para que no falle el sp.
							$evidenceCpte = "";
							$archivoPDFCpte = "";
							$filepathPDFCpte = "";
							$archivoXMLCpte = "";
							$filepathXMLCpte = "";
							$filepathEvidencia = "";
					
							//CDLCM definimos las siguientes variables y las igualamos a las propiedades del objeto xml.
							$total_xml = (string)$xml['Total'];
							$folio_xml = (string)$xml['Folio'];
							$rfc_xml = (string)$xml->children('cfdi',true)->Emisor[0]->attributes()['Rfc'];
							
							$rfcEmpresa_xml = (string)$xml->children('cfdi',true)->Receptor[0]->attributes()['Rfc'];
							$fechaEntrada_xml = (string)$xml['Fecha'];
					
							$moneda_xml = (string)$xml['Moneda'];
							$tipoRegistro_xml = (string)$xml['TipoDeComprobante'];
							$filepath = $ruta.$archivo;
					
							//CDLCM Se obtiene el total que viene del formulario.
							$TotalReal = str_replace(',', '', $Total);
							$TotalReal_menos = $TotalReal - $margen;
							$TotalReal_mas = $TotalReal + $margen;
							
							if ($total_xml <= $TotalReal_menos && $total_xml >= $TotalReal_mas) {
								$data = array(
									"estatus" => "error",
									"mensaje" => 'Monto de factura no coincide.'
								);
								echo json_encode($data);
								die();
							}

							if ($rfcEmpresa_xml != $RFCTabla) {
								$data = array(
									"estatus" => "error",
									"mensaje" => 'Los rfc de la empresa no coinciden.'
								);
								echo json_encode($data);
								die();
							}
							
							//CDLCM Se valida que la moneda proveniente del xml y del formulario sean iguales para continuar con el flujo.
							if($MonedaDetalleT == $moneda_xml){
								//CDLCM Se valida que el rfc empresa proveniente del xml y del formulario sean iguales para continuar con el flujo.
								if($rfcEmpresa_xml == $RFCTabla){
									$total_xml = str_replace(",","",$total_xml);
									//CDLCM el sp valida que la información del xml sea correcta y corresponda a nuesra información.
									$sql = "{call PortalProveedores_ValidarXML(?,?,?)}";
									$params = array($rfc_xml, $total_xml, $Remision);
									$result = sqlsrv_query($conn, $sql, $params);

									if ($result === false) {
										$validar = false;
										$mensaje = sqlsrv_errors();
										$data = array(
											"estatus" => 'error_consulta',
											"Validar" => $validar,
											"mensaje" => $mensaje[0]['message'],
											"sp" => $sql,
										);
										echo json_encode($data);
										die();
									}
									
									//CDLCM Se valida que el sp no haya traido registros de ser asi continuamos con el flujo.
									if($row = sqlsrv_fetch_array($result)){
										//CDLCM se obtine el nombre del archivo.
										$archivoXML = $XmlToUpload['name'];
										//CDLCM Definimos la ruta en la que se guardaran los archivos.
										//$rutaXML = "//C:/XML_Proveedores/";
										$rutaXML = 'XML_Proveedores/';
										$filepathXML = $rutaXML.$archivoXML;
						
										//CDLCM Validamos si el archivo se guardo correctamente en la ruta indicada.
										if(move_uploaded_file($XmlToUpload['tmp_name'], $rutaXML . $archivoXML)){
											//CDLCM El siguiente sp nos inserta la información de la orden de compra.
											$sql =  "{call PortalProveedores_InsertarDatosOrdenCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";                       
											$params = array($ordenCompra,$rfc_xml,$folio_xml,$Remision,$filepathXML,$filepath,$archivoXML,$archivo,$uuid_xml,$Subtotal,$total_xml,$moneda_xml,$tipoRegistro_xml,$fechaEntrada_xml,$archivoPDFCpte,$filepathPDFCpte,$archivoXMLCpte,$filepathXMLCpte,$evidenceCpte,$filepathEvidencia);
											$stmt = sqlsrv_query($conn, $sql, $params);
											
											if($stmt === false){
												$mensaje = sqlsrv_errors();
												$data = array(
													"estatus" => "error",
													"Validar" => false,
													"mensaje" => $mensaje[0]['message'],
													"sp" => $sql
												);
												echo json_encode($data);
												die();
											}

											sqlsrv_free_stmt($stmt);				
							
											//CDLCM Se valida que dentro del arreglo res existan las propiedades de los archivos xml y pdf, cargados anterior mente.
											if($res['xml'] && $res['pdf']){
												//Aquí ejecutas la consulta para actualizar estado de factura
												//Ya tienes el número en la variable $factura
												$query = array();
												$sql = "{call PortalProveedores_CambioEstatus(?,?)}";
												$params = array($Remision, $ordenCompra);
												$stmt = sqlsrv_query($conn, $sql, $params);
												if ($stmt === false) {
													$mensaje = sqlsrv_errors();
													$data = array(
														"estatus" => "error",
														"Validar" => false,
														"mensaje" => $mensaje[0]['message'],
														"sp" => $sql
													);
													echo json_encode($data);
													die();
												}
												sqlsrv_free_stmt($stmt);
											}
											sqlsrv_close($conn);
											$data = array(
												"estatus" => "success",
												"mensaje" => 'Documentos cargados exitosamente'
											);
											echo json_encode($data);
										}else{
											$data = array(
												"estatus" => "error",
												"mensaje" => 'Error al mover a directorio destino'
											);
											echo json_encode($data);
											die();
										} 
						
										//JSSH En caso de no coincidir exactamente en la validación del SP VALIDA_XML en el total real 
										//entrara a validar si la diferencia en el monto cumple con el margen especificado
									}else if($total_xml >= $TotalReal - $margen && $total_xml <= $TotalReal + $margen){
										
										$archivoXML = $XmlToUpload['name'];
										// $rutaXML = "//C:/XML_Proveedores/";
										$rutaXML = "XML_Proveedores/";
						
										$filepathXML = $rutaXML.$archivoXML;
						
										if(move_uploaded_file($XmlToUpload['tmp_name'], $rutaXML . $archivoXML)){
											//CDLCM El siguiente sp nos inserta la información de la orden de compra.
											$sql =  "{call PortalProveedores_InsertarDatosOrdenCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";                       
											$params = array($ordenCompra,$rfc_xml,$folio_xml,$Remision,$filepathXML,$filepath,$archivoXML,$archivo,$uuid_xml,$Subtotal,$total_xml,$moneda_xml,$tipoRegistro_xml,$fechaEntrada_xml,$archivoPDFCpte,$filepathPDFCpte,$archivoXMLCpte,$filepathXMLCpte,$evidenceCpte,$filepathEvidencia);//,,,,);
											$stmt = sqlsrv_query($conn, $sql, $params);
											
											if ($stmt === false) {
												$mensaje = sqlsrv_errors();
												$data = array(
													"estatus" => "error",
													"Validar" => false,
													"mensaje" => $mensaje[0]['message'],
													"sp" => $sql
												);
												echo json_encode($data);
												die();
											}

											sqlsrv_free_stmt( $stmt);				
							
											//CDLCM Se valida que dentro del arreglo res existan las propiedades de los archivos xml y pdf, cargados anterior mente.
											if($res['xml'] && $res['pdf']) {
												//CDLCM El siguiente sp nos permite actualizar el estatus de la factura.
												$sql = "{call PortalProveedores_CambioEstatus(?,?)}";
												$params = array($Remision,$ordenCompra);
							
												$stmt = sqlsrv_query($conn, $sql, $params);
												if ($stmt === false) {
													$mensaje = sqlsrv_errors();
													$data = array(
														"estatus" => "error",
														"Validar" => false,
														"mensaje" => $mensaje[0]['message'],
														"sp" => $sql
													);
													echo json_encode($data);
													die();
												}
												sqlsrv_free_stmt( $stmt);		
											}
											sqlsrv_close($conn);
											$data = array(
												"estatus" => "success",
												"mensaje" => 'Documentos cargados exitosamente'
											);
											echo json_encode($data);
										}
									}else{
										$data = array(
											"estatus" => "error",
											"mensaje" => 'Por favor verifique el contenido de los documentos'
										);
										echo json_encode($data);
										die();
									}        
								}else{
									$data = array(
										"estatus" => "error",
										"mensaje" => 'Por favor validar que este facturando a la empresa correcta'
									);
									echo json_encode($data);
									die();
								}
							}else{
								$data = array(
									"estatus" => "error",
									"mensaje" => 'Por favor validar el tipo de moneda en la factura'
								);
								echo json_encode($data);
								die();
							}
						}
					}else{
						$data = array(
							"estatus" => "info",
							"mensaje" => 'Tus documentos ya fueron cargados con anterioridad.'
						);
						echo json_encode($data);
						die();
					}
				break;
			}
		break;
  	}

?>

