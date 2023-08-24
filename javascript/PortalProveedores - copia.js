/* Formatting function for row details - modify as you need */
function format1(d) {
    // `d` is the original data object for the row
    console.log(d);      

      let tabla = `<table id="tb-${d.OrdenCompra}" cellpadding="5" cellspacing="0" style="border-collapse: separate; border-spacing: 40px 5px;">
                    <thead>
                        <tr>
                        <th>
                        </th>
                        <th>
                            Factura
                        </th>
                            <th>
                                Fecha
                            </th>
                            <th>
                                Proveedor
                            </th>
                            <th>
                                Cantidad
                            </th>
                            <th>
                                Impuesto
                            </th>
                        </tr>
                        </thead>
                        <tbody>`;
                        //return $(tabla).toArray();
                            d.Factura.forEach(f => {
								tabla += `<tr>
								<td>${f.FechaFactura}</td>
								<td>${f.Factura}</td> 
								<td>${f.Proveedor}</td> 
								<td>${f.Cantidad}</td> 
								<td>${f.Impuesto}</td> 
								<td>${f.FormaPago}</td> 
								<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalCargaFactura">Cargar Factura</button></td>
								
								</tr>`;
							});
                       tabla += '</tbody></table>';
					   // return $(tabla).toArray();
                       return tabla;

}




$(document).ready(function () {
   $('#example').dataTable( {
        responsive : true,
        // "processing": true,
        // "serverSide": true,
         ajax : {
             "type": 'POST',
             "url" : './utileria.php',  
             "dataType": 'JSON',             
             "cache": false,
            /* "dataSrc" : function (json){
                 console.log(json);
                 return denormalize(json);
             },*/
            "data": {
                 'param' : 1,	
                 'proveedor': 'CGU180316GU1',			
             },
         },
         language : {
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontró nada",
            "info": "Mostrando del _START_ al _END_ de un total de _TOTAL_",
            "infoEmpty": "No hay registros",
            "emptyTable": "No hay datos para mostrar",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "paginate": {
                "first": "Primera",
                "last": "Última",
                "next": "Siguiente",
                "previous": "Anterior"
            }
         },    
         //"array.json",
         columns: [          
             {
                 "className":      'details-control',
                 "orderable":      false,
                 "data":           null,
                 "defaultContent": ''
             },
             { "data" : "OrdenCompra" },
             { "data" : "FechaOrdenCompra" },
             { "data" : "Monto"},
             { "data" : "TipoMoneda" },
             { "data" : "Estatus" },                  
             //{ "data" : "Monto_Neto" },
           /*  { "title": "Lote", "data" : "Lote" },
             { "title": "Configuración", "data" : "Configuracion" },
             
            
          /*   { "data" : "Factura" },
             { "data" : "CodigoArticulo" },
             { "data" : "DescripcionArticulo" },
             { "data" : "Cantidad" },
             { "data" : "Precio" },
             { "data" : "Iva" },
             { "data" : "PendienteEntrega" },
             { "data" : "Pedido" },
             { "data" : "Recibido" },
             { "data" : "Estatus" }*/
        ],
         order : [[1, 'desc']],
    } );

    
    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-control', function () {
      let tr = $(this).closest('tr');
        let row = $('#example').DataTable().row(tr);

        let rowData = row.data();

        let tbId = `#tb-${rowData.OrdenCompra}`;

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');

            $(tbId).DataTable().destroy();
        }
        else {
            // Open this row
            row.child(format1(rowData)).show();

            $(tbId).DataTable({                
                data: rowData.Factura,
                "searching": false,
                "bPaginate": false,
                "info" : false,

                columns: [
                    {
                        //"className": 'details-control1',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },               
                    { data: 'Factura' },
                    { data: 'FechaFactura' },
                    { data: 'Proveedor' },
                    { data: 'Cantidad' },
                    { data: 'Impuesto' },
                ],

            });

            $(tbId).on('click', 'td.details-control', function(){
                var tr = $(this).closest('tr');
                var row = $('#example').DataTable().row(tr);
        
                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');

                    $(tbId).DataTable().destroy();
                }
                else {
                    // Open this row
                    row.child(format1(row.data())).show();

                    $(tbId).DataTable({                
                        data: rowData.FechaFactura,
                        "searching": false,
                        "bPaginate": false,
                        "info" : false,
        
                        columns: [               
                            { data: 'FechaFactura' },
                        ],

                    });
                    

                    tr.addClass('shown');
                } 
            });
            
            tr.addClass('shown');
        }
    });

 
    

});


function Login(){
	var usuario = $("#username").val();
	var pasword = $("#password").val();
	if(usuario.replace(/\s/g,"") != "" && pasword.replace(/\s/g,"") != ""){
		$.ajax({
			type: "POST",
			//async: false,
			data1: {
			  param: 6,
			  username: usuario,
			  password: pasword
			  
			},
			
			url: "./utileria.php", 
		    dataType: 'JSON',
			success: function(data1) {
				$('.cargando').hide(); // Oculta la imagen de cargando 
				if(data1.length){
					window.location='index.php';
				}
				else{
					 //No se encontró el usuario, verifique los datos.
					 $('#mensaje').append("<pre>No se encontró el usuario, verifique los datos.</pre>");
					 $("#username").val("");
					 $("#password").val("");
				}
				
			}
		});
		
	}
	
}
/*
function MostrarDetalleFactura(Factura){
	$('#ModalDetalleFactura').modal('show');
	$("#txtFacturaD").val(Factura);
	if(Factura !=""){
		
		$.ajax({
				type: "POST",
				//async: false,
				data: {
				  param: 2,
				  Factura: Factura,
				  //password: pasword
				  
				},
				
				url: "./utileria.php", 
				dataType: 'JSON',
				success: function(data) {
					$('.cargando').hide(); // Oculta la imagen de cargando 
					
					if(data.length){
						for(var i=0;i<data.length;i++){
							//if(data[i]['RECID_CATEGORIA'] !=NombreCategoria)
							alert(data[i]['Factura']);
						}
					}
					else{
						 //No se encontró el usuario, verifique los datos.
						 $('#mensaje').append("<pre>No se encontró el usuario, verifique los datos.</pre>");
						 $("#username").val("");
						 $("#password").val("");
					}
					
				}
			});
			
	}else{
		
	}
	
	
}
*/

