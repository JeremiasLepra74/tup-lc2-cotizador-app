document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];

    // Filtra y agrupa las cotizaciones por fecha
    const quotesByDate = storedFavorites.reduce((acc, item) => {
        if (item && item.moneda && item.fechaActualizacion) {
            // Agrupar por fecha
            if (!acc[item.fechaActualizacion]) {
                acc[item.fechaActualizacion] = [];
            }
            acc[item.fechaActualizacion].push(item);
        }
        return acc;
    }, {});

    // Llena la tabla
    for (const [fecha, cotizaciones] of Object.entries(quotesByDate)) {
        // Agrega la fila para la fecha
        const dateRow = document.createElement('tr');
        dateRow.innerHTML = `<td colspan="5" style="background-color: rgb(235, 235, 235); padding: 5px;">${fecha || 'Fecha no disponible'}</td>`;
        tableBody.appendChild(dateRow);

        // Agrega las filas para cada cotización bajo esa fecha
        cotizaciones.forEach(cotizacion => {
            const { moneda, compra, venta } = cotizacion;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td></td>
                <td>${moneda || 'Moneda no disponible'}</td>
                <td>$${compra || 'N/A'}</td>
                <td>$${venta || 'N/A'}</td>
                <td><img src="./img/goma.png" alt="Eliminar" style="width: 15px;" class="delete-btn" data-fecha="${fecha}" data-moneda="${moneda || ''}"></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Event listener para borrar cotizaciones
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const fecha = event.target.getAttribute('data-fecha');
            const moneda = event.target.getAttribute('data-moneda');

            // Filtra las cotizaciones para eliminar la seleccionada
            const updatedFavorites = storedFavorites.filter(quote => !(quote.fechaActualizacion === fecha && quote.moneda === moneda));
            localStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
            window.location.reload();
        }
    });
});
