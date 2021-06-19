const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
	formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
	e.preventDefault();
	console.log('Buscando el clima...');

	// Validar
	const ciudad = document.querySelector('#ciudad').value;
	const pais = document.querySelector('#pais').value;
	// console.log(ciudad);
	// console.log(pais);
	if (ciudad === '' || pais === '') {
		mostrarError('Ambos casos son obligatorios');
		return;
	}
	// Consultar API
	consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
	if (!document.querySelector('.bg-red-100')) {
		// Crear una alarta
		const alerta = document.createElement('div');
		alerta.classList.add(
			'bg-red-100',
			'border-red-400',
			'text-red-700',
			'px-4',
			'py-3',
			'rounded',
			'max-w-md',
			'mx-auto',
			'mt-6',
			'text-center'
		);
		alerta.innerHTML = `
      <strong class="font-bold">Error</strong>
      <span class="block">${mensaje}</span>`;
		container.appendChild(alerta);
		// Eliminar alerta
		setTimeout(() => {
			alerta.remove();
		}, 3000);
	}
}

function consultarAPI(ciudad, pais) {
	const appId = 'ed82ba73cec7dbfec888a074e88c8b63';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
	// console.log(url);
	// Muestra un spinner de carga
	spinner();
	fetch(url)
		.then((respuesta) => {
			return respuesta.json();
		})
		.then((datos) => {
			// console.log(datos);
			limpiarHTML(); // Limpiar HTML previo
			if (datos.cod === '404') {
				mostrarError('Ciudad no encontrada');
				const indicacion = document.createElement('p');
				indicacion.className = 'text-center text-white mt-6';
				indicacion.textContent = 'Agrega tu ciudad y país, el resultado se mostrará aquí';
				resultado.appendChild(indicacion);
				formulario.reset();
				return;
			}
			// Imprime la respuesta en el HTML
			mostrarClima(datos);
		});
}

function mostrarClima(datos) {
	const { name, main: { temp, temp_max, temp_min } } = datos;
	// console.log(temp);
	const centigrados = kelvinACentigrados(temp);
	const max = kelvinACentigrados(temp_max);
	const min = kelvinACentigrados(temp_min);

	const nombreCiudad = document.createElement('p');
	const actual = document.createElement('p');
	const tempMax = document.createElement('p');
	const tempMin = document.createElement('p');
	const resultadoDiv = document.createElement('div');

	// Asignar contenido a las etiquetas Y colocar clases
	nombreCiudad.textContent = `Clima en ${name}`;
	nombreCiudad.classList.add('font-bold', 'text-2xl');

	actual.innerHTML = `${centigrados} &#8451;`;
	actual.classList.add('font-bold', 'text-6xl');
	tempMax.innerHTML = `Max: ${max} &#8451;`;
	tempMax.classList.add('text-xl');

	tempMin.innerHTML = `Min: ${min} &#8451;`;
	tempMin.classList.add('text-xl');

	resultadoDiv.classList.add('text-center', 'text-white');

	// Agregar etiquetas al HTML
	resultadoDiv.appendChild(nombreCiudad);
	resultadoDiv.appendChild(actual);
	resultadoDiv.appendChild(tempMax);
	resultadoDiv.appendChild(tempMin);
	resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function spinner() {
	limpiarHTML();
	const divSpinner = document.createElement('div');
	divSpinner.classList.add('sk-fading-circle');
	divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  `;
	resultado.appendChild(divSpinner);
}
