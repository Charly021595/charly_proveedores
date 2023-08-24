<?php
	//
	$serverName = "VMSQL2008";
	//$serverName = "VMDYNAMICSAXDEV";
	//$serverName = "vmdynamicsaxdev";
	//$connectionInfo = array( "Database"=>"MicrosoftDynamicsAx", "UID"=>"sa", "PWD"=>"Dyn4mic$");
	//$connectionInfo = array( "Database"=>"MicrosoftDynamicsAx", "UID"=>"PortalProveedores", "PWD"=>"p0rt41");
	//$connectionInfo = array( "Database"=>"MicrosoftDynamicsAx", "UID"=>"miguel.zapata", "PWD"=>"nInguna");
	$connectionInfo = array( "Database"=>"dbweb_proveedores", "UID"=>"usr_webproveedores", "PWD"=>"Prov33Doreuser21");

	$conn = sqlsrv_connect( $serverName, $connectionInfo);

	if( !$conn ) {
		echo "No se pudo establecer la conexión.<br />";
		die( print_r( sqlsrv_errors(), true));
	}

	/*$sql = "select F.ORDENCOMPRA as 'OrdenCompra',	   
	   F.MONEDA as 'TipoMoneda'

	   FROM PP_FACTURAS F
	INNER JOIN DIRPARTYTABLE E ON E.DATAAREA = F.DATAAREAID	
	--LEFT  JOIN VendInvoiceJour	VIJ ON  VIJ.DATAAREAID = F.DATAAREAID
	WHERE 
		F.RFC = 'CGU180316GU1'
		AND F.BAJA = 0
		AND E.ORGANIZATIONTYPE = 1 -- OBTENER LA EMPRESA
	ORDER BY F.FECHARECEPCION, f.ORDENCOMPRA, f.FACTURA DESC";
	$ejecuta = sqlsrv_query($conn, $sql);

	while($fila = sqlsrv_fetch_array($ejecuta, SQLSRV_FETCH_ASSOC)) {
		print_r($fila);
	}*/
?>