angular
	.module('concursoz', ['ngRoute'])
	.config(function($routeProvider){
		$routeProvider
			.when("/", {
				controller: "controlador",
				controllerAs: "vm",
				templateUrl: "login.html"
			})
			.when("/preguntas", {
				controller: "controlador",
				controllerAs: "vm",
				templateUrl: "preguntas.html"
			})
			.when("/ganador", {
				controller: "controlador",
				controllerAs: "vm",
				templateUrl: "ganador.html"
			})
			.otherwise({ 
				redirectTo: '/' 
			})
	})

	.factory("usuario", function(){
		var persona = {
			nombre: "",
			email: "",
			fecha: ""
		}
		return persona;
	})

	.controller('controlador', ['$http', 'usuario', '$location', concursozCtrl])

	function concursozCtrl($http, usuario, $location){
		var vm = this;
		verificarLogin()

		vm.login = function(){
			loading()
			$http.post("controladores/login.php", {
				nombre: vm.nombre,
				email: vm.email,
				fecha: vm.fecha
			})
			.then(function(r){
				if (r.data){
					usuario.nombre = r.data[0].nombre
					usuario.email = r.data[0].email
					usuario.fecha = r.data[0].fecha
					$location.path('/preguntas')
				}else{
					notificarModal('Lo sentímos, no puede participar mas de una vez.')
				}
			}, function(r){
				console.log("error"+r.error)
			})
			vm.loadingOff()
			
		}

		vm.loadingOff = function(){
			$('.fondo-negro').fadeOut(600)
			$('.cargando').fadeOut(300)
			$('#modal').fadeOut(600)
		}

		function verificarLogin(){
			if (usuario.nombre == "" && usuario.email == "" && usuario.fecha == ""){
				$location.path('/')
			}
		}
	}

	function notificarModal(mensaje){
		var modal = document.getElementById('mensajeModal')
		modal.innerHTML = mensaje;
		$('#modal').fadeIn(300)
	}
	function loading(){
		$('.fondo-negro').fadeIn(600)
		$('.cargando').fadeIn(400)
	}
	