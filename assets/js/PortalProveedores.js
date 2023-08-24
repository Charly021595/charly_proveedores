disabled = [0,2,3,5]

disabledIndirectos = [2,3,5];

let language;

var estados = ['Ninguno','Recibido','Validacion','En proceso de pago','Documentacion erronea','Nota de credito'];

var tipoproveedorg = '';

let contador = 0;

let table_facturas_pendiente;
let table_invoices_pending;
let nombre_proveedor;

//JSSH Función para deshabilitar el boton despues de la carga de documentos
function clickEnviar(boton) {
    boton.disabled = true; 
}

function validaCheck(){
    CheckCpteg = $("#cartaPrt").prop('checked');
    if(CheckCpteg == true){
        $("#xmlCartaPorteToUpload").val(''); 
        $("#pdfCartaPorteToUpload").val(''); 
        btnUpload.attr("disabled", false);
                 
    }else{
        btnUpload.attr("disabled", true);
    }validation(); 

}

//disabledProvIndirecto = [2,3,4,5]

var tipoproveedorg = $("#txttipoproveedor").val();
var CheckCpteg = $("#cartaPrt").prop('checked');

//JSSH Variable global RFCEmpresa
var RFCEmpresag = $("#txtRfcEmpresa").val();

//JSSH Total tabla de Dynamics 
if(TotalDynamics == ""){
    var TotalDynamics = $("#txtTotal").val();
}

var fileFacturaXML = $("#XmlToUpload");
var fileFacturaPDF = $("#pdfToUpload");
var fileEvidenciaPDF = $("#evidenciaPDFCpte"); 
var checkFilesSeparated = $("#cartaPrt");
var fileCartaPorteXML = $("#xmlCartaPorteToUpload");
var fileCartaPortePDF = $("#pdfCartaPorteToUpload");
var btnUpload = $("#upload");

function validation() {
    if(tipoproveedorg != '1'){
        if(fileFacturaXML.val() && fileFacturaPDF.val()) {
            btnUpload.attr("disabled", false);
        }
        else {
            btnUpload.attr("disabled", true);
        }
    }else if(tipoproveedorg == '1' && (CheckCpteg == false || CheckCpteg == undefined)){
        if(fileFacturaXML.val() && fileFacturaPDF.val() && fileEvidenciaPDF.val()){
            btnUpload.attr("disabled", false); 
        }else {
            btnUpload.attr("disabled", true);
        }
    }else if(tipoproveedorg == '1' & CheckCpteg == true){
        if(fileFacturaXML.val() && fileFacturaPDF.val() && fileEvidenciaPDF.val() && fileCartaPorteXML.val() && fileCartaPortePDF.val()){
            btnUpload.attr("disabled", false); 
        }else {
            btnUpload.attr("disabled", true);
        }
    }

} 

//JSSH Función para mostrar la carga de carta porte PDF y XML en caso de que se tenga separada
$(function() {;
    var checkBox = $(".checkCartaPorte");
    var hidden = $(".div_a_mostrar");

    hidden.hide();
        checkBox.change(function(){
            if(checkBox.is(':checked')) {
                $(".div_a_mostrar").fadeIn("200")
            } else {
                $(".div_a_mostrar").fadeOut("200")
                $('input[type=checkbox').prop('checked',false);
            }
        });
});

/* Formatting function for row details - modify as you need */
function format(d) {
    $tipoproveedor = $("#txttipoproveedor").val();
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
                    `<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalCargaFactura" onclick="CargarFactura('${result.OrdenCompra.trim()}' , '${result.Factura.trim()}',  '${result.FechaFactura.trim()}', '${result.RFC.trim()}', '${result.Total.trim()}', '${result.Subtotal.trim()}', '${result.RFCEmpresa.trim()}', '${result.TipoMonedaDetalle.trim()}')"`;
                    if($tipoproveedor == '0' || $tipoproveedor == '11' || $tipoproveedor == '12' || $tipoproveedor == '9' || $tipoproveedor == '6' || $tipoproveedor == '13' || $tipoproveedor == '5' || $tipoproveedor == '1'){
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
                '</tr>';
                html += `>Cargar Documentos</button>
                        <button type="button" class="btn btn-primary" onclick="MostrarDetalleFactura('${result.Factura.trim()}')">Ver Detalle</button>
                        </td>
                        </tr>`;
    }

    html += '</tbody></table>';
    return html;  
}

function format_english(d) {
    $tipoproveedor = $("#txttipoproveedor").val();
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
                    `<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalCargaFactura" onclick="CargarFactura('${result.OrdenCompra.trim()}' , '${result.Factura.trim()}',  '${result.FechaOrdenCompra.trim()}', '${result.RFC.trim()}', '${result.Total.trim()}', '${result.Subtotal.trim()}', '${result.RFCEmpresa.trim()}', '${result.TipoMonedaDetalle.trim()}')"`;
                    if($tipoproveedor == '0' || $tipoproveedor == '11' || $tipoproveedor == '12' || $tipoproveedor == '9' || $tipoproveedor == '6' || $tipoproveedor == '13' || $tipoproveedor == '5' || $tipoproveedor == '1'){
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
                '</tr>';
                html += `>Upload Documents</button>
                        <button type="button" class="btn btn-primary" onclick="MostrarDetalleFactura('${result.Factura.trim()}')">View Detail</button>
                        </td>
                        </tr>`;
                       
        
    }

    html += '</tbody></table>';
    return html;  
}

let datos;
let i = 0;

$(document).ready(function () {
    tipo_lenguaje();
    setTimeout(traer_datos_dashboard, 3000);
    
});

function traer_datos_dashboard() {
    $.ajax({
        url:"./utileria.php",
        type:"post",
        data:{
            'param' : 1,'proveedor': $("#txtRFC").val()},
        success: function(res){
            datos = JSON.parse(res).data;
            if (language == 'en') {
                list_pending_invoices(datos);  
            }else{
                listar_facturas_pendientes(datos);
            }
        }
    });
}

function listar_facturas_pendientes(datos){
    nombre_provedor = $("#nombre_provedor").val();
    if(table_facturas_pendiente != null){
      table_facturas_pendiente.clear().draw();
      table_facturas_pendiente.destroy();
    }
    $("#example").html('');
    table_facturas_pendiente = $("#example").DataTable({
        "order": [],
        "targets": "no-sort",
        "ordertable": false,
        responsive: true,
        order : [[1, 'desc']],
        data: datos,
        "columns":[
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            {title: "Orden de compra", "data":"OrdenCompra" , className: "dt-head-center"},
            {title: "Fecha Orden de Compra", "data":"FechaOrdenCompra", className: "dt-head-center"},
            {title: "Moneda", "data":"TipoMoneda", className: "dt-head-center"},
            {
                data: null,
                visible: false,
                render: function (data, type, row, meta) {
                  return meta.row;
                }
            }
        ],
  
        "columnDefs": [
          { width: "auto", targets: "_all" },
          {"className": "text-center", targets: "_all"},
        ],

        dom: "<'row'<'form-inline'"
          +"<'col-sm-6'l>"
          +"<'col-sm-5'f><'col-sm-offset-7'B>>>"
                  +"<rt>"
                  +"<'row'<'form-inline'"
                  +"<'col-sm-6 col-md-6 col-lg-6'i>"
                  +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        buttons: [{
            extend: 'excelHtml5',
            title: nombre_provedor.replace(/ /g, "_")+'_Facturas_Pendientes',
            text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i>',
            titleAttr: "Exportar a Excel",
            customize: function( xlsx ) {
              let table = $('#example').DataTable();
              let contador = 0;
              // Get number of columns to remove last hidden index column.
              let numColumns = table.columns().header().count();
              
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
                //   console.log(table.row(':eq(' + rowIndex + ')').data());
                  let childData = table.row(':eq(' + rowIndex + ')').data().Factura;
                  let data = table.row(':eq(' + rowIndex + ')').data();
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
    
        "language": idioma_espanol,
    });
    crear_columnas_hijas("#example tbody", table_facturas_pendiente);
}

function list_pending_invoices(datos){
    nombre_provedor = $("#nombre_provedor").val();
    if(table_invoices_pending != null){
      table_invoices_pending.clear().draw();
      table_invoices_pending.destroy();
    }
    $("#example").html('');
    table_invoices_pending = $("#example").DataTable({
        "order": [],
        "targets": "no-sort",
        "ordertable": false,
        responsive: true,
        order : [[1, 'desc']],
        data: datos,
        "columns":[
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            {title: "Purchase Order", "data":"OrdenCompra" , className: "dt-head-center"},
            {title: "Purchase Order Date", "data":"FechaOrdenCompra", className: "dt-head-center"},
            {title: "Currency", "data":"TipoMoneda", className: "dt-head-center"},
            {
                data: null,
                visible: false,
                render: function (data, type, row, meta) {
                  return meta.row;
                }
            }
        ],
  
        "columnDefs": [
          { width: "auto", targets: "_all" },
          {"className": "text-center", targets: "_all"},
        ],

        dom: "<'row'<'form-inline'"
          +"<'col-sm-6'l>"
          +"<'col-sm-5'f><'col-sm-offset-7'B>>>"
                  +"<rt>"
                  +"<'row'<'form-inline'"
                  +"<'col-sm-6 col-md-6 col-lg-6'i>"
                  +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        buttons: [{
            extend: 'excelHtml5',
            title: nombre_provedor.replace(/ /g, "_")+'_Pending_Invoices',
            text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i>',
            titleAttr: "Export Excel",
            customize: function( xlsx ) {
              let table = $('#example').DataTable();
              let contador = 0;
              // Get number of columns to remove last hidden index column.
              let numColumns = table.columns().header().count();
              
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
                //   console.log(table.row(':eq(' + rowIndex + ')').data());
                  let childData = table.row(':eq(' + rowIndex + ')').data().Factura;
                  let data = table.row(':eq(' + rowIndex + ')').data();
                  if (childData.length > 0) {
                    // Prepare Excel formated row
                    headerRow = '<row r="' + 1 + 
                              '" s="2"><c t="inlineStr" r="A' + 1 + 
                              '"><is><t>' + 
                              '</t></is></c><c t="inlineStr" r="B' + 1 + 
                              '" s="2"><is><t>Purchase Order' + 
                              '</t></is></c><c t="inlineStr" r="C' + 1 + 
                              '" s="2"><is><t>Purchase Order Date' + 
                              '</t></is></c><c t="inlineStr" r="D' + 1 + 
                              '" s="2"><is><t>Invoice' + 
                              '</t></is></c><c t="inlineStr" r="E' + 1 + 
                              '" s="2"><is><t>Subtotal' + 
                              '</t></is></c><c t="inlineStr" r="F' + 1 + 
                              '" s="2"><is><t>Tax' + 
                              '</t></is></c><c t="inlineStr" r="G' + 1 + 
                              '" s="2"><is><t>Total' + 
                              '</t></is></c><c t="inlineStr" r="H' + 1 + 
                              '" s="2"><is><t>Status' + 
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

                    let estatus_ingles = child.Estatus == 'Ninguno' ? 'None' : child.Estatus == 'Recibido' ? 'Received' : 
                    child.Estatus == 'Validacion' ? 'validation' : child.Estatus == 'En proceso de pago' ? 'In payment process' : 
                    child.Estatus == 'Documentacion erronea' ? 'Wrong documentation': 
                    child.Estatus == 'Nota de credito' ? 'Credit note' : 'Other';
                    
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
                              '"><is><t>' + estatus_ingles + 
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
    
        "language": idioma_english,
    });
    create_child_columns("#example tbody", table_invoices_pending);
}

let crear_columnas_hijas = function(tbody, table_facturas_pendiente){
    $(tbody).on("click", "td.dt-control", function(){
        let tr = $(this).closest('tr');
        let row = $('#example').DataTable().row(tr);
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

let create_child_columns = function(tbody, table_invoices_pending){
    $(tbody).on("click", "td.dt-control", function(){
        let tr = $(this).closest('tr');
        let row = $('#example').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format_english(row.data())).show();
            tr.addClass('shown');
        }
    });
}

$(document).ready(function () {
    $('#payment').dataTable( {
         responsive : true,
         // "processing": true,
         // "serverSide": true,
          ajax : {
              "type": 'POST',
              "url" : './utileria.php',  
              "dataType": 'JSON',             
              "cache": false,
             "data": {
                  'param' : 3,	
                  'proveedor': $("#txtRFC").val(),			
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
              { "data" : "TipoMoneda" },                  
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
     $('#payment').on('click', 'td.details-control', function () {
       var tr = $(this).closest('tr');
         var row = $('#payment').DataTable().row(tr);
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
 
});

function Login(){
	var usuario = $("#username").val();
	var pasword = $("#password").val();
	var captcha = hcaptcha.getResponse();
	if(usuario.replace(/\s/g,"") != "" && pasword.replace(/\s/g,"") != ""){
		$.ajax({
			type: "POST",
			//async: false,
			data: {
			  param: 6,
			  username: usuario,
			  password: pasword,
			  captcha: captcha
			  
			},
			
			url: "./utileria.php", 
		    dataType: 'JSON',
			success: function(data) {
				$('.cargando').hide(); // Oculta la imagen de cargando 
				if(data.length){
					for(i=0;i<data.length;i++){
						if(data[i]['usuario'] !=""){
							if( data[i]['usuario'] == "Favor de Capturar el captcha"){
								document.getElementById('mensaje').innerHTML = '';
								$('#mensaje').append("<pre>Favor de Capturar el captcha.</pre>");
							}
							else if(data[i]['usuario'] == "Error en envio de información"){
								document.getElementById('mensaje').innerHTML = '';
								$('#mensaje').append("<pre>Error en envio de información.</pre>");
							}
							else{
								window.location='dashboard.php';
							}
							
						}else{
							 document.getElementById('mensaje').innerHTML = '';
							 $('#mensaje').append("<pre>No se encontró el usuario, verifique los datos.</pre>");
						}
					}
                    localStorage.setItem('nombre_proveedor', usuario);
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
        $('#mensaje').append("<pre>Favor de validar usuario o contraseña</pre>");
   }
	
}

function Validar() {
	//var e = document.getElementById("password").value;
	var elInput = document.getElementById('password');
	elInput.addEventListener('keyup', function(e) {
	  var keycode = e.keyCode || e.which;
	  if (keycode == 13) {
		Login();
	  }
	});
}

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

// Recuperar contraseña
$(document).on('click', '#recuperar_password', function(e){
    e.preventDefault();
    if (!$('#username').val()) 
    { 
        alert('Se necesita especificar el usuario.')
    }
    else{
        if(confirm('Enviar correo a la cuenta del usuario ' + $('#username').val() + '?'))
        {
            
            $.ajax({
                type: "POST",
                data: {
                  param: 8,
                  usuario: $('#username').val()
                },
                url: "./utilerias.php",
                success: function(data) {
                  $('#mensaje').append(data);
                }
            });
            
        }
    };
});


function MostrarDetalleFactura(Factura){
	$('#ModalDetalleFactura').modal('show');
	$("#txtFacturaD").val(Factura);
	if(Factura !=""){
		$("#DetalleFacturas").find("tr").remove();
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
							var tabla = "<tr>";
							
						//	tabla += "<td>"+data[i]['CodigoArticulo']+" </td>";
							tabla += "<td>"+data[i]['DescripcionArticulo']+" </td>";
                            tabla += "<td>"+data[i]['Configuracion']+" </td>";
							tabla += "<td>"+data[i]['Recibido']+" </td>";
							tabla += "<td>"+data[i]['Pedido']+" </td>";
                            tabla += "<td>"+data[i]['Pendiente']+" </td>";


							$('#DetalleFacturas').append(tabla);
						}
					}
					else{
						 //No se encontró el usuario, verifique los datos.
						 $('#mensajeD').append("<pre>No se encontró el usuario, verifique los datos.</pre>");
						
					}
					
				}
			});
			
	}else{
		$('#mensajeD').append("<pre>No se encontró el usuario, verifique los datos.</pre>");
	}
	
	
}

//CargarFactura(${f.OrdenCompra} , ${f.Factura})
function CargarFactura(OrdenCompra, Factura, FechaOrdenCompra, Rfc, Total, Subtotal, RFCEmpresa, TipoMonedaDetalle){
	$("#txtOrdenCompra").val(OrdenCompra);
	$("#txtRemision").val(Factura);
    $("#txtFechaOc").val(FechaOrdenCompra);
    $("#txtRfc").val(Rfc);   
    $("#txtTotal").val(Total);
    $("#txtSubtotal").val(Subtotal);
	$("#txtRfcEmpresa").val(RFCEmpresa);
	$("#txtMonedaDetalleT").val(TipoMonedaDetalle);
	$("#fileToUploadXML").val(''); 
	$("#pdfToUploadPDF").val(''); 
}

function ValidarArchivosCpte(){
    var alerta = $(".alert");
    var ValorPDFCpte = $('#pdfCartaPorteToUpload').val();
    var ValorXMLCpte = $('#xmlCartaPorteToUpload').val();
    var ValorEvidenciaCpte = $('#evidenciaPDFCpte').val();

    if(ValorPDFCpte != "" && ValorPDFCpte != undefined && ValorXMLCpte != "" && ValorXMLCpte != undefined && ValorEvidenciaCpte != "" && ValorEvidenciaCpte != undefined){
        var ValidarNombrePDFCpte = document.getElementById('pdfCartaPorteToUpload').files[0].name;
        var ValidarNombreXMLCpte = document.getElementById('xmlCartaPorteToUpload').files[0].name;
        var ValidarEvidenciaCpte = document.getElementById('evidenciaPDFCpte').files[0].name;

        var arcPDFCpte = ValidarNombrePDFCpte.replace(/^.*[\\\/]/,'');
        var arcXMLCpte = ValidarNombreXMLCpte.replace(/^.*[\\\/]/,'');
        var arcEvidencia = ValidarEvidenciaCpte.replace(/^.*[\\\/]/,'');

        var regexCpte = /([^-\w.]*)/gm;
        
        var arcPDFCpte2 = arcPDFCpte.replace(regexCpte, '');
        var arcXMLCpte2 = arcXMLCpte.replace(regexCpte, '');
        var arcEvidencia2 = arcEvidencia.replace(regexCpte, '');

        if(!(arcPDFCpte == arcPDFCpte2) || !(arcXMLCpte == arcXMLCpte2) || !(arcEvidencia == arcEvidencia2)) {
            alerta.addClass("visible");
            $('#pdfCartaPorteToUpload').val('');
            $('#xmlCartaPorteToUpload').val('');
            $('#evidenciaPDFCpte').val('');
            return;
        }
    }
    
}

function ValidarArchivos(){
    var alerta = $(".alert");
	var ValorPDF = $('#pdfToUpload').val();
	var ValorXML = $('#XmlToUpload').val();
	if(ValorPDF != "" && ValorPDF != undefined && ValorXML != "" && ValorXML != undefined ){
		var ValidarNombrePDF = document.getElementById('pdfToUpload').files[0].name;
		var ValidarNombreXML = document.getElementById('XmlToUpload').files[0].name;


        //JSSH Validación que no permita cargar archivos los cuales
        //contenga espacios en blanco o caracteres especiales
        var arcPDF = ValidarNombrePDF.replace(/^.*[\\\/]/,'');
        var arcXML = ValidarNombreXML.replace(/^.*[\\\/]/,'');

        var regex = /([^-\w.]*)/gm; 

        var arcPDF2  = arcPDF.replace(regex, ''); 
        var  arcXML2  = arcXML.replace(regex, '');

        if( !(arcPDF==arcPDF2)  || !(arcXML==arcXML2)) {
            alerta.addClass("visible");
            $('#XmlToUpload').val('');
            $('#pdfToUpload').val('');
            return;
        }

        //Validación que el nombre de los archivos correspondan
		var NombrePDF= ValidarNombrePDF.substring(0, ValidarNombrePDF.length - 4);
		var NombreXML= ValidarNombreXML.substring(0, ValidarNombreXML.length - 4);
		if(NombrePDF == NombreXML){
			//alert("Los datos son correctos. ");
           
		}else{
			alert("Favor de validar que los documentos correspondan con el mismo nombre. ");
            $('#XmlToUpload').val('');
            $('#pdfToUpload').val('');
		}
	}

    
}

// JSSH Función que carga los documentos
$(document).ready(function(){

    $("#upload").on("click", function(){
        const ArchivoXml = $("#XmlToUpload").prop('files')[0];
        const ArchivoPDF = $("#pdfToUpload").prop('files')[0];

        //JSSH Archivo PDF y XML carta Porte
        var tipoproveedorg = $("#txttipoproveedor").val();
   
        

        if(tipoproveedorg == '1'){
            var CheckCpte = $("#cartaPrt").prop('checked');
            if(CheckCpte == undefined || CheckCpte == false){
                CheckCpte = "";
               var ArchivoPDFCpte = "";
               var ArchivoXMLCpte = "";
               var ArchivoEvidCpte = "";           
            }else{
            var ArchivoPDFCpte = $("#pdfCartaPorteToUpload").prop('files')[0];
                if(ArchivoPDFCpte == undefined){
                    ArchivoPDFCpte = "";
                }
    
            var ArchivoXMLCpte = $("#xmlCartaPorteToUpload").prop('files')[0];
                if(ArchivoXMLCpte == undefined){
                    ArchivoXMLCpte = "";
                }
            }
            var ArchivoEvidCpte = $("#evidenciaPDFCpte").prop('files')[0];
            if(ArchivoEvidCpte == undefined){
                ArchivoEvidCpte = "";
        }
            
        }else{
            ArchivoPDFCpte = "";
            ArchivoXMLCpte = "";
            ArchivoEvidCpte = "";
            CheckCpte = "";
        }

        if(tipoproveedorg == '1' && CheckCpte == true){
            var ArchivoEvidCpte = $("#evidenciaPDFCpte").prop('files')[0];
            if(ArchivoEvidCpte == undefined){
                ArchivoEvidCpte = "";
            }
        }
     

        //Validación para comprobar que sea el formato corecto
        if (ArchivoXml.type !== 'text/xml' && ArchivoPDF.type !== 'text/pdf' && ArchivoPDFCpte.type !== 'text/pdf' && ArchivoXMLCpte.type !== 'text/xml' && ArchivoEvidCpte.type !== 'text/pdf') {
            $('#XmlToUpload').val('');
            $('#pdfToUpload').val('');
            //JSSH Archivo PDF y XML Carta Porte
            $('#pdfCartaPorteToUpload').val('');
            $('#xmlCartaPorteToUpload').val('');

            $('#evidenciaPDFCpte').val('');

            alert('Por favor seleccione los archivos con el formato correcto');
          }        

        const datosForm = new FormData;

        datosForm.append('ordenCompra' , $("#txtOrdenCompra").val());
        datosForm.append('subtotal', $("#txtSubtotal").val());

        datosForm.append("RfcEmpresa", $("#txtRfcEmpresa").val());		

        datosForm.append("XmlToUpload", ArchivoXml);
        datosForm.append("pdfToUpload", ArchivoPDF);
        //JSSH Archivo PDF Y XML Carta Porte
        datosForm.append("txttipoproveedor", tipoproveedorg);

		//JSSH Agregamos al data la variable txtTotal
		datosForm.append("TotalDynamics", $("#txtTotal").val());

        datosForm.append("cartaPrt", CheckCpte);

        datosForm.append("pdfCartaPorteToUpload", ArchivoPDFCpte);
        datosForm.append("xmlCartaPorteToUpload", ArchivoXMLCpte);

        //JSSH Archivo de evidencia de la entrega
        datosForm.append("evidenciaPDFCpte", ArchivoEvidCpte);

        datosForm.append('factura', $('#txtRemision').val());
		datosForm.append('TipoMonedaDetalle', $('#txtMonedaDetalleT').val());
        const filePath="server.php"
        //console.log(ArchivoXml);
        $.ajax({
            type:'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: datosForm,
            url:filePath
        }).done(function(data){
            
            alert(data)
            location.reload();
        }).fail(function(){
            alert('El archivo no se pudo cargar')
        });       
    });   
});

$("#btn_ingles").on("click", function(e){
    language = 'en';
    localStorage.setItem('language', language);
    location.href ="dashboard-en.php";
    return;
});

$("#btn_espanol").on("click", function(e){
    language = 'es';
    localStorage.setItem('language', language);
    location.href ="dashboard.php";
    return;
});

function tipo_lenguaje(){
    language  = localStorage.getItem('language');
}

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

