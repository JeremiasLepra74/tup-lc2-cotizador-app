document.addEventListener('DOMContentLoaded', () => {
    fetchData("https://dolarapi.com/v1/dolares/oficial", 'compra', 'venta');
    fetchData("https://dolarapi.com/v1/dolares/contadoconliqui", 'compraccl', 'ventaccl');
    fetchData("https://dolarapi.com/v1/dolares/blue", 'comprablue', 'ventablue');
    fetchData("https://dolarapi.com/v1/dolares/cripto", 'compracripto', 'ventacripto');
    fetchData("https://dolarapi.com/v1/dolares/tarjeta", 'compratarjeta', 'ventatarjeta');
    fetchData("https://dolarapi.com/v1/dolares/mayorista", 'compramep', 'ventamep');

    const sections = {
        "Dólar Oficial": document.querySelector('.item-oficial'),
        "Dólar Blue": document.querySelector('.item-blues'),
        "Dólar Bolsa (MEP)": document.querySelector('.item-mep'),
        "Dólar Contado con Liqui (CCL)": document.querySelector('.item-ccl'),
        "Dólar Tarjeta": document.querySelector('.item-tarjeta'),
        "Dólar Mayorista": document.querySelector('.item-mep'),
        "Dólar Cripto": document.querySelector('.item-cripto')
    };

    const updateVisibility = () => {
        const selected = document.getElementById('seleccionable').value;
        for (const key in sections) {
            if (sections.hasOwnProperty(key)) {
                sections[key].style.display = (selected === 'TODAS' || selected === key) ? 'grid' : 'none';
            }
        }
    };

    document.getElementById('seleccionable').addEventListener('change', updateVisibility);

    updateVisibility(); // Llamamos para asegurarnos de que la selección inicial se refleje correctamente
});

const fetchData = (url, compraId, ventaId) => {
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => updatePrices(data, compraId, ventaId))
        .catch(error => console.error('Hay un probelma con la api, codigo:', error));
};

export const updatePrices = (data, compraId, ventaId) => {
    console.log(data); // Verifica la estructura de los datos
    let preciocompra = data.compra;
    let precioventa = data.venta;

    document.getElementById(compraId).innerHTML = preciocompra;
    document.getElementById(ventaId).innerHTML = precioventa;
};
