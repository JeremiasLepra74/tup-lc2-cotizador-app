/*en este archivo se debe colocar el código JS, scripts de la App que son transversales a todas las pantallas o bien que afectan a más de una pantalla.*/

fetch("https://dolarapi.com/v1/dolares/oficial")
    .then(response => response.json())
    .then(data => MostrarPrecio(data));

const MostrarPrecio = (data) => {
    console.log(data)
    let preciocompra = String(data.compra)
    document.getElementById("compra").innerHTML = preciocompra
    console.log(typeof document.getElementById("compra").innerHTML)
    let precioventa = data.venta
    document.getElementById("venta").innerHTML = precioventa
}

fetch("https://dolarapi.com/v1/dolares/contadoconliqui")
    .then(response => response.json())
    .then(data => ccl(data));

const ccl = (data) => {
    console.log(data)
    let compraccl = data.compra
    document.getElementById("compraccl").innerHTML = compraccl
    let ventaccl = data.venta
    document.getElementById("ventaccl").innerHTML = ventaccl
}

fetch("https://dolarapi.com/v1/dolares/blue")
    .then(response => response.json())
    .then(data => blue(data));

const blue = (data) => {
    console.log(data)
    let comprablue = data.compra
    document.getElementById("comprablue").innerHTML = comprablue
    let ventablue = data.venta
    document.getElementById("ventablue").innerHTML = ventablue
}
