document.addEventListener('DOMContentLoaded', () => {
    // Recuperar los favoritos desde localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    const tableBody = document.getElementById('table-body');

    // Función para formatear la fecha en formato DD/MM/YYYY
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const groupByDate = (favorites) => {
        return favorites.reduce((grouped, favorite) => {
            // Extraer solo la fecha sin la hora
            let fecha = favorite.fecha.split('T')[0]; // Esto eliminará la parte de la hora
            if (!grouped[fecha]) {
                grouped[fecha] = [];
            }
            grouped[fecha].push(favorite);
            return grouped;
        }, {});
    };

    const renderTable = () => {
        tableBody.innerHTML = '';

        if (storedFavorites.length === 0) {
            document.querySelector('main').innerHTML = '<p>No hay favoritos guardados hasta el momento.</p>';
            return;
        }

        // Agrupar los favoritos por fecha (solo por día)
        const groupedFavorites = groupByDate(storedFavorites);

        // Ordenar las fechas en orden descendente (más reciente primero)
        const sortedDates = Object.keys(groupedFavorites).sort((a, b) => {
            return new Date(b) - new Date(a);
        });

        sortedDates.forEach((fecha) => {
            // Convertir la fecha al formato DD/MM/YYYY
            const formattedDate = formatDate(fecha);

            // Crear una fila para la fecha
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: left; font-weight: bold; background-color: #f1f1f1; line-height: 1.5;">${formattedDate}</td>`;
            tableBody.appendChild(row);

            // Agregar las cotizaciones agrupadas por fecha
            groupedFavorites[fecha].forEach((favorite) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td></td>
                    <td>${favorite.cotizacion}</td>
                    <td>${favorite.compra}</td>
                    <td>${favorite.venta}</td>
                    <td><button onclick="removeFavorite('${favorite.fecha}', '${favorite.cotizacion}')">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
    };

    window.removeFavorite = (fecha, cotizacion) => {
        const index = storedFavorites.findIndex(fav => 
            fav.fecha === fecha && fav.cotizacion === cotizacion
        );
        if (index > -1) {
            storedFavorites.splice(index, 1);
            localStorage.setItem('favoritos', JSON.stringify(storedFavorites)); 
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
