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

	.controller('controlador', ['$http', 'usuario', concursozCtrl])

	function concursozCtrl($http, usuario){
		var vm = this;


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
					notificarModal('Puede responder las preguntas :D')
				}else{
					notificarModal('Lo sentímos, no puede participar mas de una vez.')
				}
			}, function(r){
				console.log("error"+r.error)
			})
		}

		vm.loadingOff = function(){
			$('.fondo-negro').fadeOut(600)
			$('.cargando').fadeOut(300)
			$('#modal').fadeOut(600)
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
	