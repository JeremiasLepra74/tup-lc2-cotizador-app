// Obtener cotizaciones de LocalStorage
function obtenerCotizaciones() {
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];
    console.log(cotizaciones[0]); 
    return cotizaciones;
}

// Mostrar cotizaciones en la tabla
function mostrarCotizaciones(filtro) {
    const tbody = document.getElementById('cotizaciones-tbody');
    tbody.innerHTML = ''; // Limpiar tabla antes de mostrar

    const cotizaciones = obtenerCotizaciones();
    // Filtrar por moneda si se selecciona una
    const cotizacionesFiltradas = filtro === 'TODAS' ? cotizaciones : cotizaciones.filter(c => c.nombre === filtro);

    // Agrupar por moneda
    const cotizacionesAgrupadas = cotizacionesFiltradas.reduce((acc, curr) => {
        acc[curr.nombre] = acc[curr.nombre] || [];
        acc[curr.nombre].push(curr);
        return acc;
    }, {});

    // Iterar sobre las monedas y agregar filas
    for (const nombre in cotizacionesAgrupadas) {
        const cotizacionesPorNombre = cotizacionesAgrupadas[nombre];
        cotizacionesPorNombre.sort((a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)); // Ordenar por fecha

        // Agregar fila de grupo con el nombre de la cotización
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<td colspan="5" style="text-align: left; font-weight: bold; background-color: #f1f1f1; line-height: 1.5;">${nombre}</td>`;
        tbody.appendChild(headerRow);

        // Agregar las cotizaciones individuales
        cotizacionesPorNombre.forEach(cotizacion => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td></td> <!-- Columna vacía para alineación -->
                <td>${cotizacion.fechaActualizacion}</td>
                <td>${cotizacion.compra}</td>
                <td>${cotizacion.venta}</td>
                <td>${calcularVariacion(cotizacionesPorNombre, cotizacion)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}


// Calcular variación (basado en el objeto)
function calcularVariacion(cotizaciones, cotizacionActual) {
    const cotizacionAnterior = cotizaciones.find(c => new Date(c.fechaActualizacion) < new Date(cotizacionActual.fechaActualizacion));
    if (cotizacionAnterior) {
        const variacion = ((cotizacionActual.venta - cotizacionAnterior.venta) / cotizacionAnterior.venta) * 100;
        return `${variacion.toFixed(2)}%`;
    }
    return '-'; // Si no hay cotización anterior
}

// Cambiar el filtro de moneda
document.getElementById('seleccionable').addEventListener('change', (event) => {
    const filtro = event.target.value;
    mostrarCotizaciones(filtro);
});

// Agregar evento DOMContentLoaded para cargar cotizaciones al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const cotizaciones = obtenerCotizaciones();

    // Verificar si hay cotizaciones almacenadas
    if (cotizaciones.length > 0) {
        mostrarCotizaciones('TODAS'); // Mostrar todas por defecto
    } else {
        console.log('No hay cotizaciones almacenadas');
    }
});
