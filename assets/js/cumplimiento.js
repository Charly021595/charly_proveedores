let language;

jQuery(function () {
  tipo_lenguaje();
});

function tipo_lenguaje(){
  language  = localStorage.getItem('language');
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

document.querySelector('#cumplimiento_pago').addEventListener('change', function(e) {
    let boxFile = document.querySelector('.boxFile');
    boxFile.classList.remove('attached');
    boxFile.innerHTML = boxFile.getAttribute("data-text");
    if(this.value != '') {
      let allowedExtensions = /(\.pdf)$/i;
      if(allowedExtensions.exec(this.value)) {
        boxFile.innerHTML = e.target.files[0].name;
        boxFile.classList.add('attached');
      } else {
        this.value = '';
        if (language == 'en') {
          Swal.fire( 
            "The file you are trying to upload is not allowed. Allowed files are . pdff",
            '',
            'info'
          );
        }else{
          Swal.fire( 
            "El archivo que intentas subir no está permitido.\nLos archivos permitidos son .pdf",
            '',
            'info'
          ); 
        }
        boxFile.classList.remove('attached');
      }
    }
});

$("#guardar_cumplimiento_pago").on("click", function(e){
    $("#guardar_cumplimiento_pago").addClass("deshabilitar");
    $('#guardar_cumplimiento_pago').attr("disabled", true);
    let archivo_cpm = $('#cumplimiento_pago').val(), 
    boxFile = document.querySelector('.boxFile');
    if (archivo_cpm == '' || archivo_cpm == null) {
      if (language == 'en') {
        Swal.fire('You must upload the payment fulfillment document', "","info");
      }else{
        Swal.fire('Debes cargar el documento cumplimiento de pago', "","info");
      }
      $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
      $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
      $('#guardar_cumplimiento_pago').attr("disabled", false);
      return false;
    }
    e.preventDefault();
    let formData = new FormData(document.getElementById("form_cumplimiento_pago"));
    formData.append("dato", "valor");
    $.ajax({
      url: "./utileria.php",
      type: "post",
      data: formData,
      dataType: "html",
      cache: false,
      contentType: false,
      processData: false,
      success: function(result){
          let data = JSON.parse(result);
          $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
          $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
          $('#guardar_cumplimiento_pago').attr("disabled", false);
          if (data.estatus == 'success') {
              $('#archivo_cpm').val('');
              if (language == 'en') {
                boxFile.innerHTML = "Charge your payment compliance";
                boxFile.classList.remove('attached');
                Swal.fire('The file was successfully uploaded', "","success");
              }else{
                boxFile.innerHTML = "Carga tu cumplimiento de pago";
                boxFile.classList.remove('attached');
                Swal.fire('El archivo se subió correctamente', "","success");
              }
              $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
              $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
              $('#guardar_cumplimiento_pago').attr("disabled", false);
          }else if (data.estatus == 'error_archivo_duplicado') {
            $('#archivo_cpm').val('');
            if (language == 'en') {
              boxFile.innerHTML = "Charge your payment compliance";
              boxFile.classList.remove('attached');
              Swal.fire('Your file for this month has already been uploaded', "","info");
            }else{
              boxFile.innerHTML = "Carga tu cumplimiento de pago";
              boxFile.classList.remove('attached');
              Swal.fire(data.Mensaje, "","info");
            }
            $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
            $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
            $('#guardar_cumplimiento_pago').attr("disabled", false);
          }else if(data.estatus == 'error_sql'){
              $('#archivo_cpm').val('');
              if (language == 'en') {
                boxFile.innerHTML = "Charge your payment compliance";
                boxFile.classList.remove('attached');
                Swal.fire(data.Mensaje, "","info");
              }else{
                boxFile.innerHTML = "Carga tu cumplimiento de pago";
                boxFile.classList.remove('attached');
                Swal.fire(data.Mensaje, "","info");
              }
              $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
              $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
              $('#guardar_cumplimiento_pago').attr("disabled", false);
          }else if (data.estatus == 'error_datos_incompletos') {
            $('#archivo_cpm').val('');
            if (language == 'en') {
              boxFile.innerHTML = "Charge your payment compliance";
              boxFile.classList.remove('attached');
              Swal.fire("There are no parameters to perform the action.", "","info");
            }else{
              boxFile.innerHTML = "Carga tu cumplimiento de pago";
              boxFile.classList.remove('attached');
              Swal.fire(data.Mensaje, "","info"); 
            }
            $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
            $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
            $('#guardar_cumplimiento_pago').attr("disabled", false);
          }else{
            $('#archivo_cpm').val('');
            if (language == 'en') {
              boxFile.innerHTML = "Charge your payment compliance";
              boxFile.classList.remove('attached');
              Swal.fire("An error occurred", "","info");
            }else{
              boxFile.innerHTML = "Carga tu cumplimiento de pago";
              boxFile.classList.remove('attached');
              Swal.fire(data.Mensaje, "","info");
            }
            $("#guardar_cumplimiento_pago").removeAttr("disabled, disabled");
            $("#guardar_cumplimiento_pago").removeClass("deshabilitar");
            $('#guardar_cumplimiento_pago').attr("disabled", false);
          }
        }
    });
});

$("#btn_ingles").on("click", function(e){
  language = 'en';
  localStorage.setItem('language', language);
  location.href ="payment_compliance.php";
  return;
});

$("#btn_espanol").on("click", function(e){
  language = 'es';
  localStorage.setItem('language', language);
  location.href ="cumplimiento_pago.php";
  return;
});