// Mapea cada tipo de dólar con su respectiva sección en el DOM
const sections = {
    "Dólar Oficial": document.querySelector('.item-oficial'),
    "Dólar Blue": document.querySelector('.item-blues'),
    "Dólar Bolsa (MEP)": document.querySelector('.item-mep'),
    "Dólar Contado con Liqui (CCL)": document.querySelector('.item-ccl'),
    "Dólar Tarjeta": document.querySelector('.item-tarjeta'),
    "Dólar Mayorista": document.querySelector('.item-mayorista'),
    "Dólar Cripto": document.querySelector('.item-cripto')
};

// Función para borrar todos los datos almacenados en localStorage
function clearLocalStorage() {
    localStorage.clear();
    console.log('Todos los datos de localStorage han sido borrados.');
}

document.addEventListener('DOMContentLoaded', () => {
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
        // Itera sobre las secciones y actualiza su visibilidad
        for (const key in sections) {
            if (sections.hasOwnProperty(key)) {
                if (sections[key]) {
                    sections[key].style.display = (selected === 'TODAS' || selected === key) ? 'grid' : 'none';
                }
            }
        }
    };

    // Añade un evento al selector para cambiar la visibilidad cuando se cambia la selección
    document.getElementById('seleccionable').addEventListener('change', updateVisibility);
    updateVisibility(); // Llamamos para asegurarnos de que la selección inicial se refleje correctamente

    // Actualiza los datos cada 5 minutos
    setInterval(() => {
        fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta', 'nombre-oficial', 'fechaActualizacion-oficial');
        fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl', 'nombre-ccl', 'fechaActualizacion-ccl');
        fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue', 'nombre-blue', 'fechaActualizacion-blue');
        fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto', 'nombre-cripto', 'fechaActualizacion-cripto');
        fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta', 'nombre-tarjeta', 'fechaActualizacion-tarjeta');
        fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramayo', 'ventamayo', 'nombre-mayorista', 'fechaActualizacion-mayorista');
        fetchData("https://dolarapi.com/v1/dolares/bolsa", 'compramep', 'ventamep', 'nombre-mep', 'fechaActualizacion-mep');
    }, 5 * 60 * 1000);
});

// Limpiar localStorage al cargar la página
clearLocalStorage();

const fetchData = (url, compraId, ventaId, nombreId, fechaActualizacionId) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problemas de conexión: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            updatePrices(data, compraId, ventaId, nombreId, fechaActualizacionId); // Actualiza los precios en el DOM y almacena en localStorage
        
            const fechaActualizacionElement = document.getElementById('fecha-actualizacion');
            if (fechaActualizacionElement) {
                fechaActualizacionElement.innerText = new Date().toLocaleString(); // Actualiza la fecha de última actualización
            }
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
    let preciocompra = data.compra;
    let precioventa = data.venta;
    let nombre = data.nombre;
    let fechaActualizacion = data.fechaActualizacion;

    const compraElement = document.getElementById(compraId);
    const ventaElement = document.getElementById(ventaId);
    const nombreElement = document.getElementById(nombreId);
    const fechaElement = document.getElementById(fechaActualizacionId);

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

    // Almacenar los datos en localStorage
    localStorage.setItem(compraId, JSON.stringify({
        compra: preciocompra,
        venta: precioventa,
        nombre: nombre,
        fechaActualizacion: fechaActualizacion
    }));
};

// Recuperar datos almacenados en localStorage cuando el documento se haya cargado
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(sections).forEach(key => {
        const storedData = JSON.parse(localStorage.getItem(`${key}_compra`));
        if (storedData) {
            const compraElement = document.getElementById(`${key}_compra`);
            const ventaElement = document.getElementById(`${key}_venta`);
            const nombreElement = document.getElementById(`${key}_nombre`);
            const fechaElement = document.getElementById(`${key}_fechaActualizacion`);
            if (compraElement && ventaElement && nombreElement && fechaElement) {
                compraElement.innerHTML = storedData.compra;
                ventaElement.innerHTML = storedData.venta;
                nombreElement.innerHTML = storedData.nombre;
                fechaElement.innerHTML = storedData.fechaActualizacion;
            }
        }
    });
});

// Lista para almacenar los favoritos
const favoritos = [];

// Función para manejar el clic en el ícono de corazón
function toggleFavorite(icon) {
    const cotizacion = icon.getAttribute('data-cotizacion');
    
    // Obtener datos de la API para la cotización específica
    fetch(`https://dolarapi.com/v1/dolares/${cotizacion}`)
        .then(response => response.json())
        .then(data => {
            const { compra, venta, nombre, fechaActualizacion } = data;

            const favoriteData = {
                cotizacion: nombre,
                fecha: fechaActualizacion,
                compra: compra,
                venta: venta
            };

            if (favoritos.some(fav => fav.cotizacion === favoriteData.cotizacion && fav.fecha === favoriteData.fecha)) {
                // Si ya está en favoritos, lo eliminamos
                const index = favoritos.findIndex(fav => fav.cotizacion === favoriteData.cotizacion && fav.fecha === favoriteData.fecha);
                if (index > -1) {
                    favoritos.splice(index, 1);
                }
                icon.style.color = 'grey';
            } else {
                favoritos.push(favoriteData);
                icon.style.color = 'red';
            }

            // Guardar la lista de favoritos en localStorage
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            console.log('Favoritos:', favoritos);
        })
        .catch(error => console.error('Error al obtener datos:', error));
}

// Recuperar la lista de favoritos desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos'));
    if (storedFavorites) {
        favoritos.push(...storedFavorites);
        favoritos.forEach(favorite => {
            const icon = document.querySelector(`[data-cotizacion="${favorite.cotizacion}"]`);
            if (icon) {
                icon.style.color = 'red';
            }
        });
    }
});