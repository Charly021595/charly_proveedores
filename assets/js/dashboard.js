let table_facturas_pendiente,
table_invoices_pending,
table_detalle_factura,
table_detail_invoice;
let nombre_proveedor;
let estados = ['Ninguno','Recibido','Validacion','En proceso de pago','Documentacion erronea','Nota de credito'],
disabled = [0,2,3,5],
disabledIndirectos = [2,3,5],
today_actual = '',
nombre_archivo = '';

//CDLCM nueva version del document ready, funciona de la misma manera al cargar lapagina o el archivo js se ejecutaran las funciones que esten dentro.
jQuery(function () {
    cargargrid();
});

//CDLCM Esta función permite al usuario salir destruyendo la sesion activa. 
function CerrarSesion(){
	$.ajax({
        type: "POST",
        //async: false,
        data: {
            param: 7
        },
        
        url: "./utileria.php", 
        dataType: 'JSON',
        success: function(data) {
            $('.cargando').hide(); // Oculta la imagen de cargando 
            if(data.length){
                window.location='index.php';
            }
            
            
        }
    });
	
}

//CDLCM Esta función nos permite obtener la fecha actual.
function FechaHoraActual(){ 
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var minute = today.getMinutes();
    var hours = today.getHours();
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    today = 'Fecha: ' + dd + '/' + mm + '/' + yyyy;
    nombre_archivo = dd + '_' + mm + '_' + yyyy;
    today_actual = today;
}

//CDLCM Esta función nos permite abrir el modal de factura y visualizar los datos.
function CargarFactura(OrdenCompra, Factura, FechaOrdenCompra, Rfc, Total, Subtotal, RFCEmpresa, TipoMonedaDetalle, tipoproveedor){
    $("#info_carta_porte").hide();
    $("#carta_porte_xml").hide();
    $("#carta_porte_pdf").hide();
    $("#carta_porte_evidencia").hide();

	$("#txtOrdenCompra").val(OrdenCompra);
	$("#txtRemision").val(Factura);
    $("#txtFechaOc").val(FechaOrdenCompra);
    $("#txtRfc").val(Rfc);   
    $("#txtTotal").val(Total);
    $("#txtSubtotal").val(Subtotal);
	$("#txtRfcEmpresa").val(RFCEmpresa);
	$("#txtMonedaDetalleT").val(TipoMonedaDetalle);
    $("#XmlToUpload").val("");
    $("#pdfToUpload").val("");
	$("#fileToUploadXML").val(''); 
	$("#pdfToUploadPDF").val('');
    if (tipoproveedor == '1') {
        $("#info_carta_porte").show();
        $("#carta_porte_xml").show();
        $("#carta_porte_pdf").show();
        $("#carta_porte_evidencia").show();
    } 
}

//CDLCM Esta función nos permite cargar la tabla con información desde que cargue el html.
function cargargrid() {
    $('#mostrar_facturas_pendientes').hide();
    $("#cargando_tabla").show();
    let proveedor = localStorage.getItem('nombre_proveedor'),
    language = localStorage.getItem('language');
    $.ajax({
        url:"./utileria.php",
        type:"post",
        data:{'param' : 1,'proveedor':proveedor},
        success: function(resultado){
            $("#cargando_tabla").hide();
            $('#mostrar_facturas_pendientes').show();
            let datos = JSON.parse(resultado).data;
            if (language == 'en') {
                list_pending_invoices(datos);  
            }else{
                listar_facturas_pendientes(datos);
            }
        }
    });
}

//CDLCM Esta función nos permite crear la tabla de información con las datatables.
function listar_facturas_pendientes(datos){
    if(table_facturas_pendiente != null && table_facturas_pendiente != ''){
        table_facturas_pendiente.clear().draw();
        table_facturas_pendiente.destroy();
    }
    table_facturas_pendiente = $("#tabla_facturas_pendientes").DataTable({
        "order": [],
        "targets": "no-sort",
        "ordertable": false,
        data: datos,
        "columns":[
            {"className":'dt-control',
            "orderable":false,
            "data": null,
            "defaultContent":""},
            {"data":"OrdenCompra"},
            {"data":"FechaOrdenCompra"},
            {"data":"TipoMoneda"}
        ],

        "columnDefs": [
            { width: "auto", targets: "_all" },
            {"className": "text-center", "targets": "_all"}
        ],

        fixedColumns: true,
    
        "language": idioma_espanol,

        dom: "<'row'<'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'<'row'"
            +"<'col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2'l>"
            +"<'col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 botones_datatables'B>"
            +"<'col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6'f>>>>"
                +"<rt>"
                +"<'row'<'col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'<'form-inline'"
                +"<'col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6'i>"
                +"<'col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 float-rigth'p>>>>",
        buttons: [{
            extend: 'excelHtml5',
            title: "Listado_Facturas_Pendientes",
            text: '<i class="fa-solid fa-file-excel"></i>',
            titleAttr: "Exportar a Excel",
            attr:  {
                id: 'boton_Excel'
            },
            customize: function( xlsx ) {
                let table_facturas_pendiente_excel = $('#tabla_facturas_pendientes').DataTable();
                let contador = 0;
                // Get number of columns to remove last hidden index column.
                let numColumns = table_facturas_pendiente_excel.columns().header().count();
                
                // Get sheet.
                let sheet = xlsx.xl.worksheets['sheet1.xml'];
        
                let col = $('col', sheet);
                // Set the column width.
                $(col[1]).attr('width', 20);
        
                // Get a clone of the sheet data.        
                let sheetData = $('sheetData', sheet).clone();
                
                // Clear the current sheet data for appending rows.
                $('sheetData', sheet).empty();
        
                // Row count in Excel sheet.
                let rowCount = 0;
                let rowCountData = 2;
                
                // Itereate each row in the sheet data.
                $(sheetData).children().each(function(index) {
        
                // Used for DT row() API to get child data.
                let rowIndex = index - 1;
                
                // Don't process row if its the header row.
                if (index > 0) {
                    
                    // Get row
                    let row = $(this.outerHTML);
                
                    // Set the Excel row attr to the current Excel row count.
                    row.attr('r', rowCount);
                    
                    let colCount = 0;
                    
                    // Iterate each cell in the row to change the rwo number.
                    row.children().each(function(index) {
                    let cell = $(this);
                    
                    // Set each cell's row value.
                    let rc = cell.attr('r');
                    rc = rc.replace(/\d+$/, "") + rowCount;
                    cell.attr('r', rc);         
                    
                    if (colCount === numColumns) {
                        cell.html('');
                    }
                    
                    colCount++;
                    });
        
                    // Get the row HTML and append to sheetData.
                    // row = row[0].outerHTML;
                    // $('sheetData', sheet).append(row);
                    rowCount++;
                    
                    // Get the child data - could be any data attached to the row.
                    let childData = table_facturas_pendiente_excel.row(':eq(' + rowIndex + ')').data().Factura;
                    let data = table_facturas_pendiente_excel.row(':eq(' + rowIndex + ')').data();
                    if (childData.length > 0) {
                    // Prepare Excel formated row
                    headerRow = '<row r="' + 1 + 
                                '" s="2"><c t="inlineStr" r="A' + 1 + 
                                '"><is><t>' + 
                                '</t></is></c><c t="inlineStr" r="B' + 1 + 
                                '" s="2"><is><t>Orden de Compra' + 
                                '</t></is></c><c t="inlineStr" r="C' + 1 + 
                                '" s="2"><is><t>Fecha Orden de Compra' + 
                                '</t></is></c><c t="inlineStr" r="D' + 1 + 
                                '" s="2"><is><t>Factura' + 
                                '</t></is></c><c t="inlineStr" r="E' + 1 + 
                                '" s="2"><is><t>Subtotal' + 
                                '</t></is></c><c t="inlineStr" r="F' + 1 + 
                                '" s="2"><is><t>impuesto' + 
                                '</t></is></c><c t="inlineStr" r="G' + 1 + 
                                '" s="2"><is><t>Total' + 
                                '</t></is></c><c t="inlineStr" r="H' + 1 + 
                                '" s="2"><is><t>Estatus' + 
                                '</t></is></c></row>';
                    
                    // Append header row to sheetData.
                    if (contador == 0) {
                        $('sheetData', sheet).append(headerRow);
                    }
                    rowCount++; // Inc excelt row counter.
                        
                    }
                    
                    // The child data is an array of rows
                    for (c=0; c<childData.length; c++) {
                    
                    // Get row data.
                    child = childData[c];
                    
                    // Prepare Excel formated row
                    childRow = '<row r="' + rowCountData + 
                                '"><c t="inlineStr" r="A' + rowCountData + 
                                '"><is><t>' + 
                                '</t></is></c><c t="inlineStr" r="B' + rowCountData + 
                                '"><is><t>' + data.OrdenCompra + 
                                '</t></is></c><c t="inlineStr" r="C' + rowCountData + 
                                '"><is><t>' + child.FechaFactura + 
                                '</t></is></c><c t="inlineStr" r="D' + rowCountData + 
                                '"><is><t>' + child.Factura + 
                                '</t></is></c><c t="inlineStr" r="E' + rowCountData + 
                                '"><is><t>' + child.Subtotal + 
                                '</t></is></c><c t="inlineStr" r="F' + rowCountData + 
                                '"><is><t>' + child.Impuesto + 
                                '</t></is></c><c t="inlineStr" r="G' + rowCountData + 
                                '"><is><t>' + child.Total + 
                                '</t></is></c><c t="inlineStr" r="H' + rowCountData + 
                                '"><is><t>' + child.Estatus + 
                                '</t></is></c></row>';
                    
                    // Append row to sheetData.
                    $('sheetData', sheet).append(childRow);
                    rowCountData++; // Inc excelt row counter.
                        
                    }
                    contador++;
                // Just append the header row and increment the excel row counter.
                } else {
                    let row = $(this.outerHTML);
                    
                    let colCount = 1;
                    
                    // Remove the last header cell.
                    row.children().each(function(index) {
                    let cell = $(this);
                    
                    if (colCount === numColumns) {
                        cell.html('');
                    }
                    
                    colCount++;
                    });
                    row = row[0].outerHTML;
                    // $('sheetData', sheet).append(row);
                    rowCount++;
                }
                });        
            },
        }],
        
        initComplete: function(settings, json) {
            $("#tabla_facturas_pendientes").removeClass("hide");
            $("#tabla_facturas_pendientes").show();
            $("#cargando_tabla").hide();
        },

    });
    crear_columnas_hijas("#tabla_facturas_pendientes tbody", table_facturas_pendiente);
}

//CDLCM Esta función nos permite crear la tabla de información pero con las opciones en ingles
function list_pending_invoices(datos){
    if(table_invoices_pending != null){
      table_invoices_pending.clear().draw();
      table_invoices_pending.destroy();
    }
    table_invoices_pending = $("#table_invoices_pending").DataTable({
        "order": [],
        "targets": "no-sort",
        "ordertable": false,
        data: datos,
        "columns":[
            {"className":'dt-control',
            "orderable":false,
            "data": null,
            "defaultContent":""},
            {"data":"OrdenCompra"},
            {"data":"FechaOrdenCompra"},
            {"data":"TipoMoneda"}
        ],

        "columnDefs": [
            { width: "auto", targets: "_all" },
            {"className": "text-center", "targets": "_all"}
        ],

        fixedColumns: true,
    
        "language": idioma_english,

        dom: "<'row'<'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'<'row'"
            +"<'col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2'l>"
            +"<'col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 botones_datatables'B>"
            +"<'col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6'f>>>>"
                +"<rt>"
                +"<'row'<'col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'<'form-inline'"
                +"<'col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6'i>"
                +"<'col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 float-rigth'p>>>>",
        buttons: [{
            extend: 'excelHtml5',
            title: "Listado_Facturas_Pendientes",
            text: '<i class="fa-solid fa-file-excel"></i>',
            titleAttr: "Exportar a Excel",
            attr:  {
                id: 'boton_Excel'
            },
            customize: function( xlsx ) {
                let table_facturas_pendiente_excel = $('#table_invoices_pending').DataTable();
                let contador = 0;
                // Get number of columns to remove last hidden index column.
                let numColumns = table_facturas_pendiente_excel.columns().header().count();
                
                // Get sheet.
                let sheet = xlsx.xl.worksheets['sheet1.xml'];
        
                let col = $('col', sheet);
                // Set the column width.
                $(col[1]).attr('width', 20);
        
                // Get a clone of the sheet data.        
                let sheetData = $('sheetData', sheet).clone();
                
                // Clear the current sheet data for appending rows.
                $('sheetData', sheet).empty();
        
                // Row count in Excel sheet.
                let rowCount = 0;
                let rowCountData = 2;
                
                // Itereate each row in the sheet data.
                $(sheetData).children().each(function(index) {
        
                // Used for DT row() API to get child data.
                let rowIndex = index - 1;
                
                // Don't process row if its the header row.
                if (index > 0) {
                    
                    // Get row
                    let row = $(this.outerHTML);
                
                    // Set the Excel row attr to the current Excel row count.
                    row.attr('r', rowCount);
                    
                    let colCount = 0;
                    
                    // Iterate each cell in the row to change the rwo number.
                    row.children().each(function(index) {
                    let cell = $(this);
                    
                    // Set each cell's row value.
                    let rc = cell.attr('r');
                    rc = rc.replace(/\d+$/, "") + rowCount;
                    cell.attr('r', rc);         
                    
                    if (colCount === numColumns) {
                        cell.html('');
                    }
                    
                    colCount++;
                    });
        
                    // Get the row HTML and append to sheetData.
                    // row = row[0].outerHTML;
                    // $('sheetData', sheet).append(row);
                    rowCount++;
                    
                    // Get the child data - could be any data attached to the row.
                    let childData = table_facturas_pendiente_excel.row(':eq(' + rowIndex + ')').data().Factura;
                    let data = table_facturas_pendiente_excel.row(':eq(' + rowIndex + ')').data();
                    if (childData.length > 0) {
                    // Prepare Excel formated row
                    headerRow = '<row r="' + 1 + 
                                '" s="2"><c t="inlineStr" r="A' + 1 + 
                                '"><is><t>' + 
                                '</t></is></c><c t="inlineStr" r="B' + 1 + 
                                '" s="2"><is><t>Orden de Compra' + 
                                '</t></is></c><c t="inlineStr" r="C' + 1 + 
                                '" s="2"><is><t>Fecha Orden de Compra' + 
                                '</t></is></c><c t="inlineStr" r="D' + 1 + 
                                '" s="2"><is><t>Factura' + 
                                '</t></is></c><c t="inlineStr" r="E' + 1 + 
                                '" s="2"><is><t>Subtotal' + 
                                '</t></is></c><c t="inlineStr" r="F' + 1 + 
                                '" s="2"><is><t>impuesto' + 
                                '</t></is></c><c t="inlineStr" r="G' + 1 + 
                                '" s="2"><is><t>Total' + 
                                '</t></is></c><c t="inlineStr" r="H' + 1 + 
                                '" s="2"><is><t>Estatus' + 
                                '</t></is></c></row>';
                    
                    // Append header row to sheetData.
                    if (contador == 0) {
                        $('sheetData', sheet).append(headerRow);
                    }
                    rowCount++; // Inc excelt row counter.
                        
                    }
                    
                    // The child data is an array of rows
                    for (c=0; c<childData.length; c++) {
                    
                    // Get row data.
                    child = childData[c];
                    
                    // Prepare Excel formated row
                    childRow = '<row r="' + rowCountData + 
                                '"><c t="inlineStr" r="A' + rowCountData + 
                                '"><is><t>' + 
                                '</t></is></c><c t="inlineStr" r="B' + rowCountData + 
                                '"><is><t>' + data.OrdenCompra + 
                                '</t></is></c><c t="inlineStr" r="C' + rowCountData + 
                                '"><is><t>' + child.FechaFactura + 
                                '</t></is></c><c t="inlineStr" r="D' + rowCountData + 
                                '"><is><t>' + child.Factura + 
                                '</t></is></c><c t="inlineStr" r="E' + rowCountData + 
                                '"><is><t>' + child.Subtotal + 
                                '</t></is></c><c t="inlineStr" r="F' + rowCountData + 
                                '"><is><t>' + child.Impuesto + 
                                '</t></is></c><c t="inlineStr" r="G' + rowCountData + 
                                '"><is><t>' + child.Total + 
                                '</t></is></c><c t="inlineStr" r="H' + rowCountData + 
                                '"><is><t>' + child.Estatus + 
                                '</t></is></c></row>';
                    
                    // Append row to sheetData.
                    $('sheetData', sheet).append(childRow);
                    rowCountData++; // Inc excelt row counter.
                        
                    }
                    contador++;
                // Just append the header row and increment the excel row counter.
                } else {
                    let row = $(this.outerHTML);
                    
                    let colCount = 1;
                    
                    // Remove the last header cell.
                    row.children().each(function(index) {
                    let cell = $(this);
                    
                    if (colCount === numColumns) {
                        cell.html('');
                    }
                    
                    colCount++;
                    });
                    row = row[0].outerHTML;
                    // $('sheetData', sheet).append(row);
                    rowCount++;
                }
                });        
            },
        }],
        
        initComplete: function(settings, json) {
            $("#table_invoices_pending").removeClass("hide");
            $("#table_invoices_pending").show();
            $("#cargando_tabla").hide();
        },

    });
    create_child_columns("#table_invoices_pending tbody", table_invoices_pending);
}

//CDLCM Esta función nos permite crear por cada registro una subtabla.
let crear_columnas_hijas = function(tbody, table_facturas_pendiente){
    $(tbody).on("click", "td.dt-control", function(){
        let tr = $(this).closest('tr');
        let row = table_facturas_pendiente.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
}

//CDLCM Esta función nos permite crear por cada registro una subtabla pero en ingles.
let create_child_columns = function(tbody, table_invoices_pending){
    $(tbody).on("click", "td.dt-control", function(){
        let tr = $(this).closest('tr');
        let row_invoices_pending = table_invoices_pending.row(tr);
        if (row_invoices_pending.child.isShown()) {
            // This row is already open - close it
            row_invoices_pending.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row_invoices_pending.child(format_english(row_invoices_pending.data())).show();
            tr.addClass('shown');
        }
    });
}

//CDLCM Esta función nos permite pintar una subtabla para cada registro al ser seleccionado el registro.
function format(d) {
    tipoproveedor = $("#txttipoproveedor").val();
    let html = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class="table table-bordered table-hover TablaResponsiva">' +
                '<thead>' +  
                    '<tr>' +
                        '<th>Fecha de recepción</th>' +
                        '<th>Recepción</th>' +
                        '<th>Monto</th>' +
                        '<th>Impuesto</th>' +
                        '<th>Total</th>' +
                        '<th>Estatus</th>' +
                        '<th>Acciónes</th>' +
                    '</tr>' +
                '</thead>';
    for (i=0; i<d.Factura.length; i++) {
        result = d.Factura[i];
        html += '<tr>' +
                    '<td class="text-left">' + result.FechaFactura + '</td>' +
                    '<td class="text-left">' + result.Factura + '</td>' +
                    '<td class="text-left">' + result.Subtotal + '</td>' +
                    '<td class="text-left">' + result.Impuesto + '</td>' +
                    '<td class="text-left">' + result.Total + '</td>' +
                    '<td class="text-left">' + result.Estatus + '</td>' +
                    `<td><button id="id_cargar_documentos_${result.Factura}" type="button" class="btn btn-success" data-toggle="modal" data-target="#ModalCargaFactura" onclick="CargarFactura('${result.OrdenCompra}', 
                    '${result.Factura}', '${result.FechaFactura}', '${result.RFC}', '${result.Total}', '${result.Subtotal}', 
                    '${result.RFCEmpresa}', '${result.TipoMonedaDetalle}', '${tipoproveedor}', '${result.Estatus}', '${tipoproveedor}')"`;
                    if(tipoproveedor == '0' || tipoproveedor == '11' || tipoproveedor == '12' || tipoproveedor == '9' || tipoproveedor == '6' || tipoproveedor == '13' || tipoproveedor == '5' || tipoproveedor == '1'){
                        let numEstado = estados.indexOf(result.Estatus);
                        if (disabledIndirectos.indexOf(numEstado) > -1) {
                            html += ` disabled `;
                        }
                    }else{
                        let numEstado = estados.indexOf(result.Estatus);
                        if (disabled.indexOf(numEstado) > -1) {
                            html += ` disabled `;
                        }
                    }
                    let date = new Date();
                    let dia_actual = date.getDate();
                    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					if(dia_actual == ultimoDia.getDate()){ 
						html += ` disabled `;
					}
                '</tr>';
                html += `>Cargar Documentos</button>
                        <button type="button" class="btn btn-success" onclick="MostrarDetalleFactura('${result.Factura.trim()}')">Ver Detalle</button>
                        </td>
                        </tr>`;
    }

    html += '</tbody></table>';
    return html;  
}

//CDLCM Esta función nos permite pintar una subtabla para cada registro al ser seleccionado el registro en ingles.
function format_english(d) {
    tipoproveedor = $("#txttipoproveedor").val();
    let html = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class="table table-bordered table-hover TablaResponsiva">' +
                '<thead>' +  
                    '<tr>' +
                        '<th>Reception date</th>' +
                        '<th>Reception</th>' +
                        '<th>Amount</th>' +
                        '<th>Tax</th>' +
                        '<th>Total</th>' +
                        '<th>Status</th>' +
                        '<th>Action</th>' +
                    '</tr>' +
                '</thead>';
    for (i=0; i<d.Factura.length; i++) {
        result = d.Factura[i];
        let estatus_ingles = result.Estatus == 'Ninguno' ? 'None' : result.Estatus == 'Recibido' ? 'Received' : 
        result.Estatus == 'Validacion' ? 'validation' : result.Estatus == 'En proceso de pago' ? 'In payment process' : 
        result.Estatus == 'Documentacion erronea' ? 'Wrong documentation': 
        result.Estatus == 'Nota de credito' ? 'Credit note' : 'Other';
        html += '<tr>' +
                    '<td class="text-left">' + result.FechaFactura + '</td>' +
                    '<td class="text-left">' + result.Factura + '</td>' +
                    '<td class="text-left">' + result.Subtotal + '</td>' +
                    '<td class="text-left">' + result.Impuesto + '</td>' +
                    '<td class="text-left">' + result.Total + '</td>' +
                    '<td class="text-left">' + estatus_ingles + '</td>' +
                    `<td><button type="button" class="btn btn-success" data-toggle="modal" data-target="#ModalCargaFactura" onclick="CargarFactura('${result.OrdenCompra}' , '${result.Factura}',  '${result.FechaOrdenCompra}', '${result.RFC}', '${result.Total}', '${result.Subtotal}', '${result.RFCEmpresa}', '${result.TipoMonedaDetalle}')"`;
                    if(tipoproveedor == '0' || tipoproveedor == '11' || tipoproveedor == '12' || tipoproveedor == '9' || tipoproveedor == '6' || tipoproveedor == '13' || tipoproveedor == '5' || tipoproveedor == '1'){
                        let numEstado = estados.indexOf(result.Estatus);
                        if (disabledIndirectos.indexOf(numEstado) > -1) {
                            html += ` disabled `;
                        }
                    }else{
                        let numEstado = estados.indexOf(result.Estatus);
                        if (disabled.indexOf(numEstado) > -1) {
                            html += ` disabled `;
                        }
                    }
                    
                    let date = new Date();
                    let dia_actual = date.getDate();
                    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					if(dia_actual == ultimoDia.getDate()){ 
						html += ` disabled `;
					}
                '</tr>';
                html += `>Upload Documents</button>
                        <button type="button" class="btn btn-success" onclick="MostrarDetalleFactura('${result.Factura}')">View Detail</button>
                        </td>
                        </tr>`;
    }

    html += '</tbody></table>';
    return html;  
}

//CDLCM Esta función nos permite crear la tabla detalles de una factura al dar click en detalle.
function listar_detalle_facturas(datos){
    if(table_detalle_factura != null && table_detalle_factura != ''){
        table_detalle_factura.clear().draw();
        table_detalle_factura.destroy();
    }
    table_detalle_factura = $("#tabla_detalle_factura").DataTable({
        "order": [],
        "targets": "no-sort",
        "ordertable": false,
        data: datos,
        "columns":[
            {"data":"DescripcionArticulo"},
            {"data":"Configuracion"},
            {"data":"Recibido"},
            {"data":"Pedido"},
            {"data":"Pendiente"}
        ],

        "columnDefs": [
            { width: "auto", targets: "_all" },
            {"className": "text-center", "targets": "_all"}
        ],

        fixedColumns: true,
    
        "language": idioma_espanol,
        
        initComplete: function(settings, json) {
            $("#tabla_detalle_factura").removeClass("hide");
            $("#tabla_detalle_factura").show();
            $("#cargando_tabla").hide();
        },

    });
}

//CDLCM Esta función nos permite crear la tabla detalles de una factura al dar click en detalle en ingles.
function list_detail_invoices(datos){
    if(table_detail_invoice != null && table_detail_invoice != ''){
        table_detail_invoice.clear().draw();
        table_detail_invoice.destroy();
    }
    table_detail_invoice = $("#tabla_detail_invoice").DataTable({
        "order": [],
        "targets": "no-sort",
        "ordertable": false,
        data: datos,
        "columns":[
            {"data":"DescripcionArticulo"},
            {"data":"Configuracion"},
            {"data":"Recibido"},
            {"data":"Pedido"},
            {"data":"Pendiente"}
        ],

        "columnDefs": [
            { width: "auto", targets: "_all" },
            {"className": "text-center", "targets": "_all"}
        ],

        fixedColumns: true,
    
        "language": idioma_english,
        
        initComplete: function(settings, json) {
            $("#tabla_detail_invoice").removeClass("hide");
            $("#tabla_detail_invoice").show();
            $("#cargando_tabla").hide();
        },

    });
}

//CDLCM Esta función nos permite mostrar la tabla con la información de la tabla detalle de factura y nos carga la información de facturas.
function MostrarDetalleFactura(Factura){
    $('#div_tabla_detalle_factura').hide();
	$('#ModalDetalleFactura').modal('show');
    $('#logo_cargando_detalle_factura').show();
    $("#txtFacturaD").val('');
	$("#txtFacturaD").val(Factura);
    let language = localStorage.getItem('language');
	if(Factura !=""){
		$("#DetalleFacturas").find("tr").remove();
		$.ajax({
				type: "POST",
				data: {"param": 2, "Factura": Factura},				
				url: "./utileria.php", 
				success: function(result) {
                    let data = JSON.parse(result);
                    if (data.estatus == 'success') {
                        let datos = data.data;
                        if (language == 'en') {
                            list_detail_invoices(datos);
                        }else{
                            listar_detalle_facturas(datos);
                        }
                        $('#logo_cargando_detalle_factura').hide();
                        $('#div_tabla_detalle_factura').show();
                    }else{
                        // No se encontró el usuario, verifique los datos. 
                        Swal.fire(data.mensaje, 'No se encontró el usuario, verifique los datos', 'info');
                    }
				}
			});
			
	}else{
	    $('#mensajeD').append("<pre>No se encontró el usuario, verifique los datos.</pre>");
	}
}

//CDLCM Esta función nos permite validar todos los input file, validamos los formatos junto con el nombre que no contenga espacios.
function validar_input_file(input_file){
    let input_id = input_file.id,
    input_extension = input_file.files[0].type,
    nombre_documento = input_file.files[0].name.replace(/[^a-zA-Z0-9.]/g, ''),
    regex = /([^-\w.]*)/gm,
    documento_XML = '',
    documento_XML2 = ''
    documento_PDF = '',
    documento_PDF2 = '',
    NombreDocumentoXML = '',
    NombreDocumentoPDF = '';
    switch (input_id) {
        case 'XmlToUpload':
            documento_XML2  = nombre_documento.replace(regex, '');
            documento_PDF = $('#pdfToUpload').val() != '' ? $('#pdfToUpload').prop("files")[0].name.replace(/[^a-zA-Z0-9.]/g, '') :'';
            NombreDocumentoXML = nombre_documento.substring(0, nombre_documento.length - 4);
            NombreDocumentoPDF = documento_PDF.substring(0, documento_PDF.length - 4);
            if (input_extension != 'text/xml'){
                Swal.fire('El formato de la Factura XML esta erróneo', '', 'info');
                $('#XmlToUpload').val('');
                return false;
            }
            
            if (documento_XML2 != nombre_documento){
                Swal.fire('Favor de validar que el nombre de los documentos no tengan espacios ni caracteres especiales.', '', 'info');
                $('#XmlToUpload').val('');
                return false;
            }

            //Validación para que los archivos tengan el mismo nombre
            if((NombreDocumentoPDF != NombreDocumentoXML) && (NombreDocumentoPDF != '' && NombreDocumentoXML != '')){
                Swal.fire('Favor de validar que los documentos correspondan con el mismo nombre.', '', 'info');
                $('#XmlToUpload').val('');
                $('#pdfToUpload').val('');
                return false;
            }
        break;

        case 'pdfToUpload':
            documento_PDF2  = nombre_documento.replace(regex, '');
            documento_XML = $('#XmlToUpload').val() != '' ? $('#XmlToUpload').prop("files")[0].name.replace(/[^a-zA-Z0-9.]/g, '') :'';
            NombreDocumentoPDF = nombre_documento.substring(0, nombre_documento.length - 4);
            NombreDocumentoXML = documento_XML.substring(0, documento_XML.length - 4);
            if (input_extension != 'text/pdf' && input_extension != 'application/pdf'){
                Swal.fire('El formato de la Factura PDF esta erróneo', '', 'info');
                $('#pdfToUpload').val('');
                return false;
            }
            
            if (documento_PDF2 != nombre_documento){
                Swal.fire('Favor de validar que el nombre de los documentos no tengan espacios ni caracteres especiales.', '', 'info');
                $('#XmlToUpload').val('');
                return false;
            }

            //Validación para que los archivos tengan el mismo nombre
            if((NombreDocumentoPDF != NombreDocumentoXML) && (NombreDocumentoPDF != '' && NombreDocumentoXML != '')){
                Swal.fire('Favor de validar que los documentos correspondan con el mismo nombre.', '', 'info');
                $('#XmlToUpload').val('');
                $('#pdfToUpload').val('');
                return false;
            }
        break;

        case 'xmlCartaPorteToUpload':
            if (input_extension != 'text/xml'){
                Swal.fire('El formato de la Carta Porte XML esta erróneo', '', 'info');
                $('#pdfToUpload').val('');
            }  
        break;

        case 'pdfCartaPorteToUpload':
            if (input_extension != 'text/pdf'){
                Swal.fire('El formato de la Carta Porte PDF esta erróneo', '', 'info');
                $('#xmlCartaPorteToUpload').val('');
            }  
        break;

        case 'evidenciaPDFCpte':
            if (input_extension != 'text/pdf'){
                Swal.fire('El formato de la Evidencia PDF esta erróneo', '', 'info');
                $('#evidenciaPDFCpte').val('');
            }   
        break;
    }
}

//CDLCM Obtenemos la variable guardada en el localstorage del navegador para cambiar el lenguaje de la pagina.
function tipo_lenguaje(){
    language  = localStorage.getItem('language');
}

//CDLCM al dar click en el boton para cargar los archivos activamos este codigo que nos valida y nos guarda la información que estamos enviando de nuestra orden de compra.
$("#upload").on("click", function(e){
    e.preventDefault();
    $("#upload").addClass("deshabilitar");
  	$('#upload').attr("disabled", true);

    let ArchivoXml = $("#XmlToUpload").val() != '' ? $("#XmlToUpload").prop('files')[0] : '',
    ArchivoPDF = $("#pdfToUpload").val() != '' ? $("#pdfToUpload").prop('files')[0] : '',
    tipoproveedorg = $("#txttipoproveedor").val(),
    CheckCpte =  $('#cartaPrt').prop('checked') ? $('#cartaPrt').val() : '',
    ArchivoPDFCpte = $('#cartaPrt').prop('checked') ? $("#pdfCartaPorteToUpload").prop('files')[0] : '',
    ArchivoXMLCpte = $('#cartaPrt').prop('checked') ? $("#xmlCartaPorteToUpload").prop('files')[0] : '',
    ArchivoEvidCpte = $('#cartaPrt').prop('checked') ? $("#evidenciaPDFCpte").prop('files')[0] : '',
    ordenCompra = $("#txtOrdenCompra").val(),
    factura = $('#txtRemision').val(),
    FechaOc = $("#txtFechaOc").val(),
    Rfc = $("#txtRfc").val(),
    TotalDynamics = $("#txtTotal").val(),
    subtotal = $("#txtSubtotal").val(),
    RfcEmpresa = $("#txtRfcEmpresa").val(),
    TipoMonedaDetalle = $('#txtMonedaDetalleT').val();

    if (ArchivoXml == '') {
        Swal.fire('El archivo xml es requerido', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (ArchivoPDF == '') {
        Swal.fire('El archivo pdf es requerido', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (tipoproveedorg == '') {
        Swal.fire('El tipo de proveedor viene vacío', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (CheckCpte == '' && tipoproveedorg == '1') {
        Swal.fire('Seleccionar casilla carta aporte', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (ArchivoPDFCpte == '' && tipoproveedorg == '1') {
        Swal.fire('La carga de la carta aporte en PDF es requerida', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (ArchivoXMLCpte == '' && tipoproveedorg == '1') {
        Swal.fire('La carga de la carta aporte en XML es requerida', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (ArchivoEvidCpte == '' && tipoproveedorg == '1') {
        Swal.fire('La carga de la evidencia es requerida', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (ordenCompra == '') {
        Swal.fire('La orden de compra viene vacía', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (FechaOc == '') {
        Swal.fire('La Recepción viene vacía', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (Rfc == '') {
        Swal.fire('La Recepción viene vacía', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (subtotal == '') {
        Swal.fire('El subtotal viene vacío', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (RfcEmpresa == '') {
        Swal.fire('El RFC de la empresa viene vacío', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (factura == '') {
        Swal.fire('La Recepción viene vacía', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (TipoMonedaDetalle == '') {
        Swal.fire('El tipo de moneada viene vacío', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }else if (TotalDynamics == '') {
        Swal.fire('El total viene vacío', '', 'info');
        $("#upload").removeAttr("disabled, disabled");
        $("#upload").removeClass("deshabilitar");
        $('#upload').attr("disabled", false);
        return false;
    }

    $("#txtOrdenCompra").removeAttr('disabled');
    $('#txtRemision').removeAttr('disabled');
    $("#txtFechaOc").removeAttr('disabled');
    $("#txtRfc").removeAttr('disabled');
    $("#txtTotal").removeAttr('disabled');
    $("#txtSubtotal").removeAttr('disabled');
    $("#txtRfcEmpresa").removeAttr('disabled');
    $('#txtMonedaDetalleT').removeAttr('disabled');

    let formData = new FormData(document.getElementById("form_cargar_facturas"));
    formData.append("dato", "valor");
    formData.append("XmlToUpload", ArchivoXml);
    formData.append("pdfToUpload", ArchivoPDF);
    formData.append("txttipoproveedor", tipoproveedorg);
    formData.append("cartaPrt", CheckCpte);
    formData.append("pdfCartaPorteToUpload", ArchivoPDFCpte);
    formData.append("xmlCartaPorteToUpload", ArchivoXMLCpte);

    //CDLCM Archivo de evidencia de la entrega
    formData.append("evidenciaPDFCpte", ArchivoEvidCpte);
    formData.append("param", 12);
    $.ajax({
        url: "./utileria.php",
        type: "post",
		data: formData,
		dataType: "html",
		cache: false,
		contentType: false,
		processData: false,
        success: function(result) {
            let data = JSON.parse(result);
            if (data.estatus == 'success') {
                $("#XmlToUpload").val("");
                $("#pdfToUpload").val("");
                $("#fileToUploadXML").val(''); 
                $("#pdfToUploadPDF").val('');
                if (tipoproveedorg == '1') {
                    $("#info_carta_porte").show();
                    $("#carta_porte_xml").show();
                    $("#carta_porte_pdf").show();
                    $("#carta_porte_evidencia").show();
                }
                $("#txtOrdenCompra").attr('disabled', true);
                $('#txtRemision').attr('disabled', true);
                $("#txtFechaOc").attr('disabled', true);
                $("#txtRfc").attr('disabled', true);
                $("#txtTotal").attr('disabled', true);
                $("#txtSubtotal").attr('disabled', true);
                $("#txtRfcEmpresa").attr('disabled', true);
                $('#txtMonedaDetalleT').attr('disabled', true);
                Swal.fire( 
                    data.mensaje,
                    '',
                    'success'
                );
                $("#upload").removeAttr("disabled, disabled");
                $("#upload").removeClass("deshabilitar");
                $('#upload').attr("disabled", false);
            }else if(data.estatus == 'info'){
                $("#XmlToUpload").val("");
                $("#pdfToUpload").val("");
                $("#fileToUploadXML").val(''); 
                $("#pdfToUploadPDF").val('');
                if (tipoproveedorg == '1') {
                    $("#info_carta_porte").show();
                    $("#carta_porte_xml").show();
                    $("#carta_porte_pdf").show();
                    $("#carta_porte_evidencia").show();
                }
                $("#txtOrdenCompra").attr('disabled', true);
                $('#txtRemision').attr('disabled', true);
                $("#txtFechaOc").attr('disabled', true);
                $("#txtRfc").attr('disabled', true);
                $("#txtTotal").attr('disabled', true);
                $("#txtSubtotal").attr('disabled', true);
                $("#txtRfcEmpresa").attr('disabled', true);
                $('#txtMonedaDetalleT').attr('disabled', true);
                Swal.fire( 
                    data.mensaje,
                    '',
                    'info'
                );
            }else{
                $("#XmlToUpload").val("");
                $("#pdfToUpload").val("");
                $("#fileToUploadXML").val(''); 
                $("#pdfToUploadPDF").val('');
                if (tipoproveedorg == '1') {
                    $("#info_carta_porte").show();
                    $("#carta_porte_xml").show();
                    $("#carta_porte_pdf").show();
                    $("#carta_porte_evidencia").show();
                } 
                $("#txtOrdenCompra").attr('disabled', true);
                $('#txtRemision').attr('disabled', true);
                $("#txtFechaOc").attr('disabled', true);
                $("#txtRfc").attr('disabled', true);
                $("#txtTotal").attr('disabled', true);
                $("#txtSubtotal").attr('disabled', true);
                $("#txtRfcEmpresa").attr('disabled', true);
                $('#txtMonedaDetalleT').attr('disabled', true);
                if (data.estatus == 'error_consulta') {
                    Swal.fire( 
                        data.mensaje+''+data.sp,
                        '',
                        'info'
                    );   
                }else{
                    Swal.fire( 
                        data.mensaje,
                        '',
                        'info'
                    );
                }
                $("#upload").removeAttr("disabled, disabled");
                $("#upload").removeClass("deshabilitar");
                $('#upload').attr("disabled", false);
            }
        }
    });
});

//CDLCM nos permite cambiar el idioma de español a ingles
$("#btn_ingles").on("click", function(e){
    language = 'en';
    localStorage.setItem('language', language);
    location.href ="dashboard-en.php";
    return;
});

//CDLCM nos permite cambiar el idioma de ingles a español
$("#btn_espanol").on("click", function(e){
    language = 'es';
    localStorage.setItem('language', language);
    location.href ="dashboard.php";
    return;
});

$("#icon_copyright").hover(function(){
    $("#div_dinos").show();
    }, function(){
        $("#div_dinos").hide();
});

//CDLCM variable global que nos 
let idioma_espanol = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Actilet para ordenar la columna de manera ascendente",
        "sSortDescending": ": Actilet para ordenar la columna de manera descendente"
    }
}

let idioma_english = {
    "emptyTable": "No data available in table",
    "info": "Showing _START_ to _END_ of _TOTAL_ entries",
    "infoEmpty": "Showing 0 to 0 of 0 entries",
    "infoFiltered": "(filtered from _MAX_ total entries)",
    "infoThousands": ",",
    "lengthMenu": "Show _MENU_ entries",
    "loadingRecords": "Loading...",
    "processing": "Processing...",
    "search": "Search:",
    "zeroRecords": "No matching records found",
    "thousands": ",",
    "paginate": {
        "first": "First",
        "last": "Last",
        "next": "Next",
        "previous": "Previous"
    },
    "aria": {
        "sortAscending": ": activate to sort column ascending",
        "sortDescending": ": activate to sort column descending"
    }
}