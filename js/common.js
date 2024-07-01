/*en este archivo se debe colocar el código JS, scripts de la App que son transversales a todas las pantallas o bien que afectan a más de una pantalla.*/

fetch("https://dolarapi.com/v1/dolares")
  .then(response => response.json())
  .then(data => console.log(data));
