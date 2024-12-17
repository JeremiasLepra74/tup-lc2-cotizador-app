// Mapea cada tipo de dólar con su elemento del DOM correspondiente
const sections = {
    "Dólar Oficial": document.querySelector('.item-oficial'),
    "Dólar Blue": document.querySelector('.item-blues'),
    "Dólar Bolsa (MEP)": document.querySelector('.item-mep'),
    "Dólar Contado con Liqui (CCL)": document.querySelector('.item-ccl'),
    "Dólar Tarjeta": document.querySelector('.item-tarjeta'),
    "Dólar Mayorista": document.querySelector('.item-mayorista'),
    "Dólar Cripto": document.querySelector('.item-cripto')
};

document.addEventListener('DOMContentLoaded', () => {

    const fechaActualizacionElement = document.getElementById('fecha-actualizacion');
    if (fechaActualizacionElement) {
        fechaActualizacionElement.innerText = new Date().toLocaleString();
    }

    // Llamados a las apis. Cada llamada pasa los parámetros necesarios para actualizar la información de compra, venta... en el DOM.
    fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta', 'nombre-oficial', 'fechaActualizacion-oficial');
    fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl', 'nombre-ccl', 'fechaActualizacion-ccl');
    fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue', 'nombre-blue', 'fechaActualizacion-blue');
    fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto', 'nombre-cripto', 'fechaActualizacion-cripto');
    fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta', 'nombre-tarjeta', 'fechaActualizacion-tarjeta');
    fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramayo', 'ventamayo', 'nombre-mayorista', 'fechaActualizacion-mayorista');
    fetchData("https://dolarapi.com/v1/dolares/bolsa", 'compramep', 'ventamep', 'nombre-mep', 'fechaActualizacion-mep');

    // Función para actualizar la visibilidad de las secciones según la selección del usuario
    const updateVisibility = () => {
        const selected = document.getElementById('seleccionable').value;
        // Itera sobre las propiedades del objeto sections.
        for (const key in sections) {
            // Se verifica si la propiedad actual (referenciada por key) realmente pertenece al objeto sections
            if (sections.hasOwnProperty(key)) {
                if (sections[key]) {
                    // Si el valor seleccionado es "TODAS" o es igual a la key, la propiedad style.display de la sección correspondiente se establece en 'grid' (haciendo que sea visible).
                    sections[key].style.display = (selected === 'TODAS' || selected === key) ? 'grid' : 'none';
                }
            }
        }
    };

    // Añade un evento al selector para cambiar la visibilidad cuando se cambia la selección
    document.getElementById('seleccionable').addEventListener('change', updateVisibility);
    updateVisibility();

    // Actualiza los datos cada 5 minutos
    setInterval(() => {
        fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta', 'nombre-oficial', 'fechaActualizacion-oficial');
        fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl', 'nombre-ccl', 'fechaActualizacion-ccl');
        fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue', 'nombre-blue', 'fechaActualizacion-blue');
        fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto', 'nombre-cripto', 'fechaActualizacion-cripto');
        fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta', 'nombre-tarjeta', 'fechaActualizacion-tarjeta');
        fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramayo', 'ventamayo', 'nombre-mayorista', 'fechaActualizacion-mayorista');
        fetchData("https://dolarapi.com/v1/dolares/bolsa", 'compramep', 'ventamep', 'nombre-mep', 'fechaActualizacion-mep');

        if (fechaActualizacionElement) {
            fechaActualizacionElement.innerText = new Date().toLocaleString();
        }
    }, 5 * 60 * 1000);
});

const fetchData = (url, compraId, ventaId, nombreId, fechaActualizacionId) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problemas de conexión: ' + response.statusText);
            }
            return response.json();
        })
        // data es la respuesta en formato Json
        .then(data => {
            updatePrices(data, compraId, ventaId, nombreId, fechaActualizacionId); // Actualiza los precios en el DOM y almacena en localStorage

        })
        .catch(error => {
            console.error('Problemas en el fetch:', error);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.innerText = 'No se pudieron cargar los datos: ' + error.message;
                errorMessage.style.display = 'block';
            }
        });
};

// Función para actualizar los precios en el DOM
const updatePrices = (data, compraId, ventaId, nombreId, fechaActualizacionId) => {

    // Toma los datos de la respuesta y los asigna a variables locales
    let preciocompra = data.compra;
    let precioventa = data.venta;
    let nombre = data.nombre;
    let fechaActualizacion = data.fechaActualizacion;

    // Se obtienen los elementos del DOM
    const compraElement = document.getElementById(compraId);
    const ventaElement = document.getElementById(ventaId);
    const nombreElement = document.getElementById(nombreId);
    const fechaElement = document.getElementById(fechaActualizacionId);

    // Se asignan los valores de la api a los elementos del DOM
    if (compraElement) {
        compraElement.innerHTML = preciocompra;
    }
    if (ventaElement) {
        ventaElement.innerHTML = precioventa;
    }
    if (nombreElement) {
        nombreElement.innerHTML = nombre;
    }
    if (fechaElement) {
        fechaElement.innerHTML = fechaActualizacion;
    }

    // Almacenar los datos en localStorage, setItem almacena un valor bajo una clave
    localStorage.setItem(compraId, JSON.stringify({ // localStorage solo puede almacenar cadenas de texto
        compra: preciocompra,
        venta: precioventa,
        nombre: nombre,
        fechaActualizacion: fechaActualizacion
    }));
};

const favoritos = [];

// Función para manejar el clic en el ícono de corazón
function toggleFavorite(icon) {
    const cotizacion = icon.getAttribute('data-cotizacion');
    
    // Obtener datos de la API para la cotización específica
    fetch(`https://dolarapi.com/v1/dolares/${cotizacion}`)
        .then(response => response.json())
        .then(data => {

            // desestructuración de objetos
            const { compra, venta, nombre, fechaActualizacion } = data;

            const favoriteData = {
                cotizacion: nombre,
                fecha: fechaActualizacion,
                compra: compra,
                venta: venta
            };

            // Verificar si la cotización ya está en favoritos
            if (favoritos.some(fav => fav.cotizacion === favoriteData.cotizacion && fav.fecha === favoriteData.fecha)) {
                alert('La cotización ya se encuentra almacenada.');
            } else {
                // Agregar a favoritos
                favoritos.push(favoriteData);
                icon.style.color = 'red';
                alert('La cotización se ha agregado correctamente.');
            }

            // Guardar la lista de favoritos en localStorage
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            console.log('Favoritos:', favoritos);
        })
        .catch(error => console.error('Error al obtener datos:', error));
}

// Se recupera la lista de favoritos desde localStorage y se agregan al array favoritos
document.addEventListener('DOMContentLoaded', () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos'));
    if (storedFavorites) {
        favoritos.push(...storedFavorites);
        favoritos.forEach(favorite => {
            // Busca un elemento que tenga un atributo data-cotizacion cuyo valor coincida con el valor de favorite.cotizacion
            const icon = document.querySelector(`[data-cotizacion="${favorite.cotizacion}"]`);
            if (icon) {
                icon.style.color = 'red';
            }
        });
    }
});