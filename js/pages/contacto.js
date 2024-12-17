function enviarEmail() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('mensaje').value
  
    if (!nombre || !email || !message) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    console.log('Enviando email con:', { nombre, email, message });
  
    // Configuración de EmailJS (reemplaza con tus IDs)
    emailjs.send("service_44i7yb9", "template_ycprvnq", {
      from_name: nombre,
      to_email: email,
      message: message,
    })
      .then(() => {
        alert('Email enviado con éxito.');
        cerrarFormulario();
      })
      .catch(() => {
        console.error('Error al enviar el email:', error);
        alert('Hubo un error al enviar el email. Inténtalo de nuevo más tarde.');
      });
}

function limpiarCampos() {
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mensaje').value = '';
}