jQuery(function () {
    localStorage.clear();
    language = 'es';
    localStorage.setItem('language', language);
});

function Login(){
    debugger;
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
		    // dataType: 'JSON',
			success: function(data) {
                console.log(data);
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