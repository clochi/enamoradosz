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
					alert("Puedes responder las preguntas "+usuario.nombre)
				}else{
					alert("No puedes participar nuevamente.")
				}
			}, function(r){
				console.log("error"+r.error)
			})
		}
	}