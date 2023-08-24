jQuery(function () {
    validar_cumplimientopago();
});

function validar_cumplimientopago(){
    let nombre_proveedor = $("#nombre_provedor").val();
	language  = localStorage.getItem('language');
    $.ajax({
		url: "./utileria.php",
		type: "post",
		data: {"param":10, "nombre_proveedor":nombre_proveedor},
		success: function(result) {
			data = JSON.parse(result);
			if (data.estatus == "info"){
				if (language == 'en') {
					Swal.fire('Please attach your payment compliance for the corresponding month', "","info").then(function(){
						location.href = "payment_compliance.php";
					});
				}else{
					Swal.fire(data.Mensaje, "","info").then(function(){
						location.href = "cumplimiento_pago.php";
					});
				}
			}else if(data.estatus == "error_datos_incompletos"){
				if (language == 'en') {
					Swal.fire('missing parameters to perform the action', "","info").then(function(){
						location.href = "payment_compliance.php";
					});	
				}else{
					Swal.fire(data.Mensaje, "","info").then(function(){
						location.href = "cumplimiento_pago.php";
					});	
				}
			}
		}
	});
}