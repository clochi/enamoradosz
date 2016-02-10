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
	.factory("fPreguntas", function(){
		var preguntas = [{
			ide: 0,
			pregunta: '¿Cómo se dice AMOR en Italiano?',
			opciones: ['Amore', 'Amare', 'Amor'],
			respuesta: 'Amore'
		},
		{
			ide: 1,
			pregunta: '¿Cuántas porciones tiene una PIZZA de nuestra carta?',
			opciones: [10, 8, 9],
			respuesta: 8
		},
		{
			ide: 2,
			pregunta: '¿Quién dijo la frase:  “El amor jamás reclama; da siempre. El amor tolera, jamás se irrita, nunca se venga”?',
			opciones: ['William Shakespeare', 'Paulo Coelho', 'Dalai Lama'],
			respuesta: 'Dalai Lama'
		},
		{
			ide: 3,
			pregunta: '¿Quién fue SAN VALENTÍN?',
			opciones: ['San Valentín era un sacerdote que, hacia el siglo III, celebraba en secreto matrimonios para jóvenes enamorados.', 'Acción de marketing de la cadena de centros comerciales WESHOP de Massachusetts, creada en 1965', 'Hermano de San Antonio, santo del amor imposible y difícil.'],
			respuesta: 'Dalai Lama'
		}
		]
		return preguntas;
	})
	/*.factory("pregunta", function(){
		var pregunta = {
			ide: "",
			pregunta: "",
			opciones: "",
			respuesta: "",
		}
		return pregunta;
	})*/

	.controller('controlador', ['$http', 'usuario', 'fPreguntas', '$location', concursozCtrl])

	function concursozCtrl($http, usuario, fPreguntas, $location){
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
		vm.getRoute = function(){
			return $location.path()
		}
		vm.siguiente = function(){

			if (vm.vector == undefined){
				var i = 0;
				var vec = []
				for (var i = 0; i < 4; i++){
					vec.push(i)
				}
				i = 0
				while (i < vec.length){
					var random = Math.floor((Math.random() * vec.length))
					var aux = vec[i]
					vec[i]= vec[random]
					vec[random] = aux
					i = i+1
				}
				vm.vector = vec
			}

			i = 0
			j = 0

			loop1:
			while (i < vm.vector.length){
				var j = 0
				loop2:
				while (j < fPreguntas.length){
					if (vm.vector[i] == fPreguntas[j].ide){
						break loop1;
					}
					j = j + 1
				}
				i= i+1
			}

			if (fPreguntas.length == 0){
				$location.path('/ganador')
			}

			if (vm.vector[i] == fPreguntas[j].ide){
				vm.preguntas = fPreguntas[j]
			}

			
			fPreguntas.splice(j,1)
			vm.vector.splice(i,1)
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
	