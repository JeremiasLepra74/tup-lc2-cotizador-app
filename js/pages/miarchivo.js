document.addEventListener('DOMContentLoaded', () => {
    const storedCotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];
    const tableBody = document.getElementById('table-body');

    const groupByDate = (cotizaciones) => {
        return cotizaciones.reduce((grouped, cotizacion) => {
            let fecha = cotizacion.fechaActualizacion.split(' ')[0]; 
            fecha = fecha.replace(',', ''); 
            if (!grouped[fecha]) {
                grouped[fecha] = [];
            }
            grouped[fecha].push(cotizacion);
            return grouped;
        }, {});
    };

    const renderTable = () => {
        tableBody.innerHTML = '';
        if (storedCotizaciones.length === 0) {
            document.querySelector('main').innerHTML = '<p>No hay cotizaciones guardadas hasta el momento.</p>';
            return;
        }

        const groupedCotizaciones = groupByDate(storedCotizaciones);
        const sortedDates = Object.keys(groupedCotizaciones).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach((fecha) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: left; font-weight: bold; background-color: #f1f1f1; line-height: 1.5;">${fecha}</td>`;
            tableBody.appendChild(row);

            groupedCotizaciones[fecha].forEach((cotizacion) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td></td>
                    <td>${cotizacion.nombre}</td>
                    <td>${cotizacion.compra}</td>
                    <td>${cotizacion.venta}</td>
                    <td><button onclick="removeCotizacion('${cotizacion.fechaActualizacion}', '${cotizacion.nombre}')">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
    };

    window.removeCotizacion = (fechaActualizacion, nombre) => {
        const index = storedCotizaciones.findIndex(c => 
            c.fechaActualizacion === fechaActualizacion && c.nombre === nombre
        );
        if (index > -1) {
            storedCotizaciones.splice(index, 1);
            localStorage.setItem('cotizaciones', JSON.stringify(storedCotizaciones)); 
            renderTable();
        }
    };

    const printTable = () => {
        const tableHTML = document.querySelector('#table-container').innerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Imprimir informe</title></head><body>');
        printWindow.document.write(tableHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    document.getElementById('printButton').addEventListener('click', printTable);

    renderTable();
});
