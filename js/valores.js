document.addEventListener('DOMContentLoaded', () => {
    fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta');
    fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl');
    fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue');
    fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto');
    fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta');
    fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramep', 'ventamep');
});

const fetchData = (url, compraId, ventaId) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => updatePrices(data, compraId, ventaId))
        .catch(error => console.error('There was a problem with the fetch operation:', error));
};

const updatePrices = (data, compraId, ventaId) => {
    console.log(data); // Verifica la estructura de los datos
    let preciocompra = data.compra;
    let precioventa = data.venta;

    document.getElementById(compraId).innerHTML = preciocompra;
    document.getElementById(ventaId).innerHTML = precioventa;
};