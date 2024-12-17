// Obtener cotizaciones de LocalStorage
function obtenerCotizaciones() {
    const cotizaciones = JSON.parse(localStorage.getItem('favoritos')) || [];
    return cotizaciones;
}

// Mostrar cotizaciones en la tabla
function mostrarCotizaciones(filtro) {
    const tbody = document.getElementById('cotizaciones-tbody');
    tbody.innerHTML = ''; // Limpiar tabla antes de mostrar

    const cotizaciones = obtenerCotizaciones();

    // Filtrar por moneda si se selecciona una
    const cotizacionesFiltradas = filtro === 'TODAS' ? cotizaciones : cotizaciones.filter(c => c.cotizacion === filtro);

    // Agrupar por moneda
    const cotizacionesAgrupadas = cotizacionesFiltradas.reduce((acc, curr) => {
        acc[curr.cotizacion] = acc[curr.cotizacion] || []; // se verifica si ya existe una clave con el nombre de la moneda en el acumulador
        acc[curr.cotizacion].push(curr); 
        return acc;
    }, {});

    // Función para formatear la fecha en formato DD/MM/YYYY
    const formatDate = (isoDate) => {
        const [year, month, day] = isoDate.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    // Iterar sobre las monedas y agregar filas
    for (const nombre in cotizacionesAgrupadas) {
        const cotizacionesPorNombre = cotizacionesAgrupadas[nombre];
        cotizacionesPorNombre.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha

        // Agregar fila de grupo con el nombre de la cotización
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<td colspan="5" style="text-align: left; font-weight: bold; background-color: #f1f1f1; line-height: 1.5;">${nombre}</td>`;
        tbody.appendChild(headerRow);

        // Agregar las cotizaciones individuales
        cotizacionesPorNombre.forEach(cotizacion => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td></td> <!-- Columna vacía para alineación -->
                <td>${formatDate(cotizacion.fecha)}</td>
                <td>${cotizacion.compra}</td>
                <td>${cotizacion.venta}</td>
                <td>${calcularVariacion(cotizacionesPorNombre, cotizacion)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Cambiar el filtro de moneda
document.getElementById('seleccionable').addEventListener('change', (event) => {
    const filtro = event.target.value;
    mostrarCotizaciones(filtro);
    actualizarGrafica(filtro);
});

// Agregar evento DOMContentLoaded para cargar cotizaciones al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const cotizaciones = obtenerCotizaciones();

    // Verificar si hay cotizaciones almacenadas
    if (cotizaciones.length > 0) {
        mostrarCotizaciones('TODAS'); // Mostrar todas por defecto
        actualizarGrafica('TODAS'); 
    } else {
        console.log('No hay cotizaciones almacenadas');
    }
});

// Calcular variación y retornar con el ícono correspondiente
function calcularVariacion(cotizaciones, cotizacionActual) {
    // Encontrar el índice de la cotización actual
    const indiceActual = cotizaciones.findIndex(c => c.fecha === cotizacionActual.fecha);

    // La cotización anterior es la que está justo después en la lista (porque ya están ordenadas)
    const cotizacionAnterior = cotizaciones[indiceActual + 1];

    if (cotizacionAnterior) {
        let icono = '';

        if (cotizacionActual.venta > cotizacionAnterior.venta) {
            icono = '↑'; 
        } else if (cotizacionActual.venta < cotizacionAnterior.venta) {
            icono = '↓'; 
        } else {
            icono = '-'; 
        }

        return `${icono}`;
    }

    return '-'; // Si no hay cotización anterior
}


// Obtener una referencia al elemento canvas del DOM
const $grafica = document.getElementById('miGrafica').getContext('2d');

// Crear una instancia de la gráfica
let miGrafica = new Chart($grafica, {
    type: 'line',
    data: {
        labels: [],  // Se actualizarán dinámicamente
        datasets: []
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Función para actualizar la gráfica
function actualizarGrafica(filtro) {
    const cotizaciones = obtenerCotizaciones();

    // Filtrar las cotizaciones según el filtro
    const cotizacionesFiltradas = filtro === 'TODAS' ? cotizaciones : cotizaciones.filter(c => c.cotizacion === filtro);

    // Obtener las etiquetas (fechas) y datos de compra y venta
    const etiquetas = cotizacionesFiltradas.map(c => new Date(c.fecha).toLocaleDateString());
    const datosCompra = cotizacionesFiltradas.map(c => parseFloat(c.compra));
    const datosVenta = cotizacionesFiltradas.map(c => parseFloat(c.venta));

    // Actualizar los datos de la gráfica
    miGrafica.data.labels = etiquetas;
    miGrafica.data.datasets = [];

    if (filtro === 'TODAS') {
        // Mostrar solo los precios de compra
        miGrafica.data.datasets.push({
            label: 'Precio de Compra',
            data: datosCompra,
            borderColor: 'blue',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true
        });
    } else {
        // Mostrar tanto compra como venta
        miGrafica.data.datasets.push(
            {
                label: 'Precio de Compra',
                data: datosCompra,
                borderColor: 'green',
                fill: false
            },
            {
                label: 'Precio de Venta',
                data: datosVenta,
                borderColor: 'red',
                fill: false
            }
        );
    }

    miGrafica.update(); // Actualizar la gráfica con los nuevos datos
}



// Función para mostrar el formulario
document.getElementById('mostrar-formulario').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('email-form').style.display = 'flex';
});
  
  // Función para cerrar el formulario
function cerrarFormulario() {
    document.getElementById('email-form').style.display = 'none';
}
  
  // Función para enviar el email (usando EmailJS)
function enviarEmail() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
  
    if (!nombre || !email) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    // Aquí se obtienen los datos de la tabla
    const datosTabla = obtenerDatosTabla();
  
    // Configuración de EmailJS (reemplaza con tus IDs)
    emailjs.send("service_44i7yb9", "template_ycprvnq", {
      from_name: nombre,
      to_email: email,
      message: datosTabla,
    })
      .then(() => {
        alert('Email enviado con éxito.');
        cerrarFormulario();
      })
      .catch(() => {
        alert('Hubo un error al enviar el email. Inténtalo de nuevo más tarde.');
      });
}
  
  // Función para obtener los datos de la tabla
function obtenerDatosTabla() {
    const filas = document.querySelectorAll('#cotizaciones-tbody tr');
    let datos = 'MONEDA | FECHA | COMPRA | VENTA | VARIACIÓN\n';
  
    filas.forEach(fila => {
      datos += Array.from(fila.children).map(td => td.textContent).join(' | ') + '\n';
    });
  
    return datos;
}
  

