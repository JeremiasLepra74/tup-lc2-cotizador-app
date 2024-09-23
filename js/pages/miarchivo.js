document.addEventListener('DOMContentLoaded', () => {
    // Obtén las cotizaciones guardadas de 'cotizaciones' en localStorage
    const storedCotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];
    const tableBody = document.getElementById('table-body');

    // Función para agrupar cotizaciones por fecha
    const groupByDate = (cotizaciones) => {
        return cotizaciones.reduce((grouped, cotizacion) => {
            const fecha = cotizacion.fechaActualizacion.split(' ')[0]; // Tomamos solo la fecha sin la hora
            if (!grouped[fecha]) {
                grouped[fecha] = [];
            }
            grouped[fecha].push(cotizacion);
            return grouped;
        }, {});
    };

    // Función para eliminar una cotización
    window.removeCotizacion = (fecha, nombre) => {
        const index = storedCotizaciones.findIndex(c => 
            c.fechaActualizacion.split(' ')[0] === fecha && c.nombre === nombre
        );

        if (index > -1) {
            storedCotizaciones.splice(index, 1);
            localStorage.setItem('cotizaciones', JSON.stringify(storedCotizaciones)); // Actualiza el localStorage
            renderTable(); // Vuelve a renderizar la tabla
        }
    };

    // Función para renderizar la tabla con cotizaciones agrupadas por fecha
    const renderTable = () => {
        // Limpia el contenido anterior
        tableBody.innerHTML = '';

        if (storedCotizaciones.length === 0) {
            // Si no hay cotizaciones, mostramos un mensaje de que no hay datos guardados
            document.querySelector('main').innerHTML = '<p>No hay cotizaciones guardadas hasta el momento.</p>';
            return;
        }

        const groupedCotizaciones = groupByDate(storedCotizaciones);

        // Iteramos sobre las fechas y sus respectivas cotizaciones
        for (const [fecha, cotizaciones] of Object.entries(groupedCotizaciones)) {
            cotizaciones.forEach((cotizacion) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align: center;">${fecha}</td>
                    <td style="text-align: center;">${cotizacion.nombre}</td>
                    <td style="text-align: center;">${cotizacion.compra}</td>
                    <td style="text-align: center;">${cotizacion.venta}</td>
                    <td style="text-align: center;"><button onclick="removeCotizacion('${fecha}', '${cotizacion.nombre}')">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        }
    };

    // Función para imprimir solo el contenido de la tabla
    const printTable = () => {
        const printContent = document.querySelector('main').innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    // Añadimos el botón de imprimir
    const printButton = document.createElement('button');
    printButton.innerText = 'Imprimir informe';
    printButton.style.marginTop = '20px';
    printButton.onclick = printTable;
    document.querySelector('main').appendChild(printButton);

    // Renderiza la tabla al cargar la página
    renderTable();
});

