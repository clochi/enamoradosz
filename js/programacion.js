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
			opciones: ['William Shakespeare', 'Paulo Coelho', 'Indira Gandhi'],
			respuesta: 'Indira Gandhi'
		},
		{
			ide: 3,
			pregunta: '¿Quién fue SAN VALENTÍN?',
			opciones: ['Un sacerdote que celebraba en secreto matrimonios para jóvenes enamorados', 'Acción de marketing de la cadena de centros comerciales WESHOP de Massachusetts (1965)', 'Hermano de San Antonio, santo del amor imposible y difícil'],
			respuesta: 'Un sacerdote que celebraba en secreto matrimonios para jóvenes enamorados'
		}
		]
		return preguntas;
	})


	.controller('controlador', ['$http', 'usuario', 'fPreguntas', '$location', concursozCtrl])

	function concursozCtrl($http, usuario, fPreguntas, $location){
		var vm = this;
		verificarLogin()
		var correcto = document.getElementById('correcto')
		var incorrecto = document.getElementById('incorrecto')
		vm.login = function(){
			if (vm.nombre != undefined || vm.email != undefined || vm.fecha != undefined){
				if (vm.nombre != "" && vm.email != "" && vm.fecha != undefined){
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
						vm.loadingOff()
					}else{
						notificarModal('Lo sentímos, no puede participar mas de una vez.')
					}
				}, function(r){
					console.log("error"+r.error)
				})
				}else{
					notificarModal("Debe completar todos los campos.")
				}
			}
			else{
				notificarModal("Debe completar todos los campos.")
			}
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
			correcto.load()
			incorrecto.load()
			if (fPreguntas.length != 0){

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
			vm.clase = false;
		}

		vm.escoge = function($index, $event, cont){
			if (cont == 0){
				if (vm.preguntas.opciones[$index] == vm.preguntas.respuesta){
					vm.clase = {
						str: "bien",
						first: true
					}
					$event.currentTarget.classList.add('correcto')
					$event.currentTarget.firstElementChild.classList.add('img-res-activo')
					correcto.play()
					if (fPreguntas.length == 0){
						$location.path('/ganador')
					}
				}else{
					vm.clase = {
						str: "mal",
						second: true
					}
					$event.currentTarget.classList.add('incorrecto')
					$event.currentTarget.firstElementChild.classList.add('img-res-activo')
					incorrecto.play()
				}
				vm.cont = vm.cont + 1
			}

		}

		function verificarLogin(){
			if (usuario.nombre == "" && usuario.email == "" && usuario.fecha == ""){
				$location.path('/')
			}
		}
	}

	function notificarModal(mensaje){
		$('.fondo-negro').fadeIn(600)
		var modal = document.getElementById('mensajeModal')
		modal.innerHTML = mensaje;
		$('#modal').fadeIn(300)
	}
	function loading(){
		$('.fondo-negro').fadeIn(600)
		$('.cargando').fadeIn(400)
	}
	