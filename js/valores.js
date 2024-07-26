// Cuando el cont. del doc se haya cargado, llama a la api para obtener los datos
document.addEventListener('DOMContentLoaded', () => {
    fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta');
    fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl');
    fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue');
    fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto');
    fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta');
    fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramep', 'ventamep');

    // Mapea cada tipo de dólar con su respectiva sección en el DOM
    const sections = {
        "Dólar Oficial": document.querySelector('.item-oficial'),
        "Dólar Blue": document.querySelector('.item-blues'),
        "Dólar Bolsa (MEP)": document.querySelector('.item-mep'),
        "Dólar Contado con Liqui (CCL)": document.querySelector('.item-ccl'),
        "Dólar Tarjeta": document.querySelector('.item-tarjeta'),
        "Dólar Mayorista": document.querySelector('.item-mep'),
        "Dólar Cripto": document.querySelector('.item-cripto')
    };

     // Función para actualizar la visibilidad de las secciones según la selección del usuario
    const updateVisibility = () => {
        const selected = document.getElementById('seleccionable').value;
        // Itera sobre las secciones y actualiza su visibilidad
        for (const key in sections) {
            if (sections.hasOwnProperty(key)) {
                sections[key].style.display = (selected === 'TODAS' || selected === key) ? 'grid' : 'none';
            }
        }
    };

     // Añade un evento al selector para cambiar la visibilidad cuando se cambia la selección
    document.getElementById('seleccionable').addEventListener('change', updateVisibility);

    updateVisibility(); // Llamamos para asegurarnos de que la selección inicial se refleje correctamente

    // Actualiza los datos cada 5 minutos
    setInterval(() => {
        fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta');
        fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl');
        fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue');
        fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto');
        fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta');
        fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramep', 'ventamep');
    }, 5 * 60 * 1000); // 5 minutos en milisegundos
});

const fetchData = (url, compraId, ventaId) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problemas de conexión: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            updatePrices(data, compraId, ventaId); // Actualiza los precios en el DOM
            document.getElementById('fecha-actualizacion').innerText = new Date().toLocaleString(); // Actualiza la fecha de última actualización
            document.getElementById('error-message').style.display = 'none'; // Ocultar mensaje de error
        })
        .catch(error => {
            console.error('Problemas en el fetch:', error);
            document.getElementById('error-message').innerText = 'No se pudieron cargar los datos: ' + error.message;
            document.getElementById('error-message').style.display = 'block';
        });
};

// Función para actualizar los precios en el DOM
const updatePrices = (data, compraId, ventaId) => {
    let preciocompra = data.compra;
    let precioventa = data.venta;

    document.getElementById(compraId).innerHTML = preciocompra;
    document.getElementById(ventaId).innerHTML = precioventa;

    // Almacenar los datos en localStorage
    localStorage.setItem(compraId, JSON.stringify({ compra: preciocompra, venta: precioventa }));
};

// Recuperar datos almacenados en localStorage cuando el documento se haya cargado
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(sections).forEach(key => {
        const storedData = JSON.parse(localStorage.getItem(`${key}_compra`));
        if (storedData) {
            document.getElementById(`${key}_compra`).innerHTML = storedData.compra;
            document.getElementById(`${key}_venta`).innerHTML = storedData.venta;
        }
    });
});
