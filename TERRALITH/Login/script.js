document.getElementById('login-button').addEventListener('click', async function(event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del botón

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Crear el cuerpo de la solicitud
    const body = {
        email: email,   // Correo electrónico ingresado por el usuario
        password: password // Contraseña ingresada por el usuario
    };

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            // Redireccionar si el inicio de sesión fue exitoso
            location.href = '/TerrarioInfo/TerrarioInfo.html';
        } else {
            // Manejo de errores si la solicitud no fue exitosa
            const errorMessage = await response.text();
            alert(`Error al iniciar sesión: ${errorMessage}`);
        }
    } catch (error) {
        // Manejo de errores en la solicitud
        alert('Error al conectarse con el servidor. Por favor, inténtelo de nuevo más tarde.');
    }
});
