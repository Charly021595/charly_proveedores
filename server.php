<?php
  // Obtén número de factura o cadena vacía
  $factura = (isset($_POST['factura'])) ? trim($_POST['factura']) : '';
  //print_r($factura);
  //echo "Probando";

  // Define el arreglo que vas a devolver
  $res = [
	  'factura' => ($factura != ''),
	  'xml' => (isset($_FILES["XmlToUpload"]) && $_FILES["XmlToUpload"]['error'] == 0),
	  'pdf' => (isset($_FILES["pdfToUpload"]) && $_FILES["pdfToUpload"]['error'] == 0),

    // JSSH Define dentro de arreglo archivo PDF y XML Carta Porte
    'cartaPortePdf' => (isset($_FILES["pdfCartaPorteToUpload"]) && $_FILES["pdfCartaPorteToUpload"]['error'] == 0),
    'cartaPorteXml' => (isset($_FILES["xmlCartaPorteToUpload"]) && $_FILES["xmlCartaPorteToUpload"]['error'] == 0),
    'evidenciaCpte' => (isset($_FILES["evidenciaPDFCpte"]) && $_FILES["evidenciaPDFCpte"]['error'] == 0)
  ];

  $RFCTabla = (isset($_POST['RfcEmpresa'])) ? trim($_POST['RfcEmpresa']) : ''; 

  // Solo si hay número de factura
  if($res['factura']) {

    $errores = array( UPLOAD_ERR_OK => 'Carga exitosa', UPLOAD_ERR_INI_SIZE => 'Excede el tamaño de carga (PHP)', UPLOAD_ERR_FORM_SIZE => 'Excede el tamaño de carga (HTML)', 
    UPLOAD_ERR_PARTIAL => 'Carga incompleta', UPLOAD_ERR_NO_FILE => 'No se seleccionó archivo', UPLOAD_ERR_NO_TMP_DIR => 'Falta carpeta temporal', 
    UPLOAD_ERR_CANT_WRITE => 'No se guardó el archivo', UPLOAD_ERR_EXTENSION => 'Una extensión bloqueó la carga'
    );
      
    //************************************ */
    $PDF2 = $_FILES["pdfToUpload"]["name"];
    $XML2 = $_FILES['XmlToUpload']['name'];

    //JSSH Declara variable de nombre de PDF y XML de Carta Porte
    $tipoproveedor = $_POST["txttipoproveedor"];
    $CheckCpte = $_POST["cartaPrt"];
    if($tipoproveedor == '1' && $CheckCpte != ""){


      $PDFCPTE = $_FILES["pdfCartaPorteToUpload"]["name"];     
      $XMLCPTE = $_FILES["xmlCartaPorteToUpload"]["name"]; 
      $EVIDPDF = $_FILES["evidenciaPDFCpte"]["name"];
      


      
      //     if($tipoproveedor == '1' && $CheckCpte == ""){
              //JSSH Declara variable para evidencia de entrega
      //       $EVIDPDF = $_FILES["evidenciaPDFCpte"]["name"];
      //   }else{
      //       $EVIDPDF = "";
      //   }

    }else{
      $PDFCPTE = "";
      $XMLCPTE = "";
      $EVIDPDF = "";
      
    }     
      
    //TipoModenaDetalle
    $TipoMonedaDetalle = $_POST["TipoMonedaDetalle"];

    $xml3 = new SimpleXMlElement( $_FILES['XmlToUpload']['tmp_name'], 0, true );
    $UUID2 = (string)$xml3->children('cfdi',true)->Complemento->children('tfd',true)->attributes()['UUID'];

    $serverName = "vmsql2008";
    $connectionInfo = array( "Database"=>"dbweb_proveedores", "UID"=>"usr_webproveedores", "PWD"=>"Prov33Doresuser21");            
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( $conn === false ){
      die(print_r(sqlsrv_errors(), true));
    }

    $sql = "{call PortalProveedores_ValidarNombreArchivos(?,?,?)}";
    $params = array($XML2,$PDF2,$UUID2);
    // print_r($params);
    $stmt = sqlsrv_query($conn, $sql, $params);
    while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ){
      $existeRegistro = $row['Existe'];
    }

    if($existeRegistro == '1'){
      // Solo si se subió archivo PDF y no tuvo error
      if($res['pdf']) {
        
        $archivo = $_FILES["pdfToUpload"]["name"];
        $ruta ="//Srvwebapps/PDF/";
      
        if(!move_uploaded_file($_FILES["pdfToUpload"]["tmp_name"], $ruta . $archivo)) {
          // Hubo error, poner propiedad en falso
          $res['pdf'] = false;
        }       
      }
      // Solo si se subió archivo XML y no tuvo error
      if($res['xml']){
        
        if( $_FILES['XmlToUpload']['error'] !== UPLOAD_ERR_OK ){
          // error_log($errores[$_FILES['XmlToUpload']['error']]);
          die( $errores[$_FILES['XmlToUpload']['error']] );
        }

      

        //JSSH Variables en uso para la carga del PDF Carta Porte
        if($tipoproveedor == '1' && $CheckCpte != ""){
          $archivoPDFCpte = $_FILES["pdfCartaPorteToUpload"]["name"];
          $rutaPDFCpte = "//Srvwebapps/CARTAPDF/";

          $archivoXMLCpte = $_FILES["xmlCartaPorteToUpload"]["name"];
          $rutaXMLCpte = "//Srvwebapps/CARTAXML/";
    
          // $evidenceCpte = $_FILES["evidenciaPDFCpte"]["name"];
          // $evidenceCpte = $_FILES["evidenciaPDFCpte"]["name"];
          //$rutaEvidenceCpte = "//Srvwebapps/EVIDENCIA/";

          $evidenceCpte = $_FILES["evidenciaPDFCpte"]["name"];
          $rutaEvidenceCpte = "//Srvwebapps/EVIDENCIA/";
          $filepathEvidencia = $rutaEvidenceCpte.$evidenceCpte;
          $filepathPDFCpte = $rutaPDFCpte.$archivoPDFCpte;
          $filepathXMLCpte = $rutaXMLCpte.$archivoXMLCpte;

        }else if($tipoproveedor == '1' && $CheckCpte == ""){
          $evidenceCpte = $_FILES["evidenciaPDFCpte"]["name"];
          $rutaEvidenceCpte = "//Srvwebapps/EVIDENCIA/";
          $filepathEvidencia = $rutaEvidenceCpte.$evidenceCpte;
          $archivoPDFCpte = "";
          $filepathPDFCpte = "";         
          $archivoXMLCpte = "";
          $filepathXMLCpte = "";
          //$rutaEvidenceCpte = "";

          //$filepathEvidencia = "";
        }else{
          $evidenceCpte = "";
          $archivoPDFCpte = "";
          $filepathPDFCpte = "";
          $archivoXMLCpte = "";
          $filepathXMLCpte = "";
          $filepathEvidencia = "";
        }

        $ordenCompra = (isset($_POST['ordenCompra'])) ? trim($_POST['ordenCompra']) : '';
        $subtotal = (isset($_POST['subtotal'])) ? trim($_POST['subtotal']) : '';


        $xml = new SimpleXMlElement( $_FILES['XmlToUpload']['tmp_name'], 0, true );
        $factura = (isset($_POST['factura'])) ? trim($_POST['factura']) : ''; 
        //$total = (float)$xml['Total'];
        //JSSH Se realiza cambio para que el tipo de dato de la tabla sea numerico 25/08/22
        $total = (string)$xml['Total'];
        $folio = (string)$xml['Folio'];
        $rfc = (string)$xml->children('cfdi',true)->Emisor[0]->attributes()['Rfc'];
        $uuid = (string)$xml->children('cfdi',true)->Complemento->children('tfd',true)->attributes()['UUID'];
      
        $rfcEmpresa = (string)$xml->children('cfdi',true)->Receptor[0]->attributes()['Rfc'];
      
        $fechaEntrada = (string)$xml['Fecha'];


        
        $moneda = (string)$xml['Moneda'];
        //$fechaActual = date('d-m-Y H:i:s');
        $tipoRegistro = (string)$xml['TipoDeComprobante'];

        $filepath = $ruta.$archivo;
      
      
        //JSSH Obtener Total real desde la etiqueta
        $TotalReal = str_replace(',','',$_POST["TotalDynamics"]);
      
        //JSSH Margen definida por el área contable
        $margen = 20.00;
      
        $serverName = "vmsql2008";
        $connectionInfo = array( "Database"=>"dbweb_proveedores", "UID"=>"usr_webproveedores", "PWD"=>"Prov33Doresuser21");            
        $conn = sqlsrv_connect( $serverName, $connectionInfo);

        if( $conn === false ){
          die(print_r(sqlsrv_errors(), true));
        }
        if($TipoMonedaDetalle == $moneda){
          if($rfcEmpresa == $RFCTabla){
            $sql = "{call PortalProveedores_ValidarXML(?,?,?)}";

            $params = array($rfc, $total, $factura,);
            $result = sqlsrv_query( $conn, $sql, $params );

            if( $row = sqlsrv_fetch_array($result) ){

              $archivoXML = $_FILES['XmlToUpload']['name'];
              $rutaXML = "//Srvwebapps/XML/";

              $filepathXML = $rutaXML.$archivoXML;

              

              if(move_uploaded_file( $_FILES['XmlToUpload']['tmp_name'], $rutaXML . $archivoXML)){
                //JSSH Validación para ir al directorio y cargar el documento PDF de Carta Porte
                if($tipoproveedor == '1'  && $CheckCpte != ""){
                  if(move_uploaded_file($_FILES["pdfCartaPorteToUpload"]["tmp_name"], $rutaPDFCpte . $archivoPDFCpte)){
                  }
                  //JSSH Validación para ir al directorio y cargar el documento XML de Carta Porte
                  if(move_uploaded_file($_FILES["xmlCartaPorteToUpload"]["tmp_name"], $rutaXMLCpte . $archivoXMLCpte)){
          
                  }
                  if(move_uploaded_file($_FILES["evidenciaPDFCpte"]["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
                  }  
                  
                }

                if($tipoproveedor == '1' && $CheckCpte == ""){
                  if(move_uploaded_file($_FILES["evidenciaPDFCpte"]["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
                  }                 
                }


                
                

                



                echo 'Documentos cargados exitosamente';       
                //echo $existeRegistro;
              
                $serverName = "vmsql2008";
                $connectionInfo = array( "Database"=>"dbweb_proveedores", "UID"=>"usr_webproveedores", "PWD"=>"Prov33Doresuser21");            
                $conn = sqlsrv_connect( $serverName, $connectionInfo);

                if( $conn === false ){
                  die(print_r(sqlsrv_errors(), true));
                }

                $sql =  "{call PortalProveedores_InsertarDatosOrdenCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";                       
                $params = array($ordenCompra,$rfc,$folio,$factura,$filepathXML,$filepath,$archivoXML,$archivo,$uuid,$subtotal,$total,$moneda,$tipoRegistro,$fechaEntrada,$archivoPDFCpte,$filepathPDFCpte,$archivoXMLCpte,$filepathXMLCpte,$evidenceCpte,$filepathEvidencia);//,,,,);

            
              


              $stmt = sqlsrv_query($conn, $sql, $params);
              
                if ( $stmt === false) {
                  die( print_r( sqlsrv_errors(), true) );
                }

                sqlsrv_free_stmt( $stmt);		
                sqlsrv_close($conn); 

                      // ¿Se subieron los dos archivos?
                if($res['xml'] && $res['pdf']) {
                  // Aquí ejecutas la consulta para actualizar estado de factura
                  // Ya tienes el número en la variable $factura
                      $query = array();
                      include './db/conectar.php';
                      $sql = "{call PortalProveedores_CambioEstatus(?,?)}";

                      $factura = (isset($_POST['factura'])) ? ltrim(rtrim($_POST['factura'])) : '';
                    
                      $params = array($factura,$ordenCompra);
                    // print_r($params);

                      $stmt = sqlsrv_query($conn, $sql, $params);
                      if ( $stmt === false) {
                          die( print_r( sqlsrv_errors(), true) );
                      }

                      session_start();


                      sqlsrv_free_stmt( $stmt);		
                  sqlsrv_close($conn);
                }
              }else{
                echo 'Error al mover a directorio destino';
              } 

              //JSSH En caso de no coincidir exactamente en la validación del SP VALIDA_XML en el total real 
              //entrara a validar si la diferencia en el monto cumple con el margen especificado
            }else if($total >= $TotalReal - $margen && $total <= $TotalReal + $margen){
                
              $archivoXML = $_FILES['XmlToUpload']['name'];
              $rutaXML = "//Srvwebapps/XML/";

              $filepathXML = $rutaXML.$archivoXML;

              if(move_uploaded_file( $_FILES['XmlToUpload']['tmp_name'], $rutaXML . $archivoXML)){
                //JSSH Validación para ir al directorio y cargar el documento PDF de Carta Porte
                if($tipoproveedor == '1'  && $CheckCpte != ""){
                  if(move_uploaded_file($_FILES["pdfCartaPorteToUpload"]["tmp_name"], $rutaPDFCpte . $archivoPDFCpte)){
                  }
                  //JSSH Validación para ir al directorio y cargar el documento XML de Carta Porte
                  if(move_uploaded_file($_FILES["xmlCartaPorteToUpload"]["tmp_name"], $rutaXMLCpte . $archivoXMLCpte)){
          
                  }
                  if(move_uploaded_file($_FILES["evidenciaPDFCpte"]["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
                  }  
                  
                }

                if($tipoproveedor == '1' && $CheckCpte == ""){
                  if(move_uploaded_file($_FILES["evidenciaPDFCpte"]["tmp_name"], $rutaEvidenceCpte . $evidenceCpte)){ 
                  }                 
                }

                echo 'Documentos cargados exitosamente';       
                //echo $existeRegistro;
                
                $serverName = "vmsql2008";
                $connectionInfo = array( "Database"=>"dbweb_proveedores", "UID"=>"usr_webproveedores", "PWD"=>"Prov33Doresuser21");            
                $conn = sqlsrv_connect( $serverName, $connectionInfo);
          
                if( $conn === false ){
                  die(print_r(sqlsrv_errors(), true));
                }
          
                $sql =  "{call PortalProveedores_InsertarDatosOrdenCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";                       
                $params = array($ordenCompra,$rfc,$folio,$factura,$filepathXML,$filepath,$archivoXML,$archivo,$uuid,$subtotal,$total,$moneda,$tipoRegistro,$fechaEntrada,$archivoPDFCpte,$filepathPDFCpte,$archivoXMLCpte,$filepathXMLCpte,$evidenceCpte,$filepathEvidencia);//,,,,);
                $stmt = sqlsrv_query($conn, $sql, $params);
                
                if ( $stmt === false) {
                  die( print_r( sqlsrv_errors(), true) );
                }
          
                sqlsrv_free_stmt( $stmt);		
                sqlsrv_close($conn); 

                      // ¿Se subieron los dos archivos?
                if($res['xml'] && $res['pdf']) {
                  // Aquí ejecutas la consulta para actualizar estado de factura
                  // Ya tienes el número en la variable $factura
                  $query = array();
                  include './db/conectar.php';
                  $sql = "{call PortalProveedores_CambioEstatus(?,?)}";

                  $factura = (isset($_POST['factura'])) ? ltrim(rtrim($_POST['factura'])) : '';
                
                  $params = array($factura,$ordenCompra);
                  // print_r($params);

                  $stmt = sqlsrv_query($conn, $sql, $params);
                  if ( $stmt === false) {
                      die( print_r( sqlsrv_errors(), true) );
                  }

                  session_start();


                  sqlsrv_free_stmt( $stmt);		
                  sqlsrv_close($conn);
                }
              }
              
              
                  
            }else{
              echo 'Por favor verifique el contenido de los documentos';
            }        
          }else{
            echo 'Por favor validar que este facturando a la empresa correcta';
          }
        }else{
          echo 'Por favor validar el tipo de moneda en la factura';
        }
      }
    }else{  
      echo 'Los archivos ya se han cargado previamente, por favor verifiquelos.';
      //echo $existeRegistro;
    } 
  }
  // Devuelves el arreglo
  // echo json_encode($res);

?>