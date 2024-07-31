document.getElementById('register-button').addEventListener('click', async function(event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del botón

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Crear el cuerpo de la solicitud
    const body = {
        name: username, // Usamos 'username' como el 'name' del usuario
        surname: '',    // Suponiendo que no se requiere apellido en el formulario
        email: email,   // Correo electrónico ingresado por el usuario
        password: password // Contraseña ingresada por el usuario
    };

    try {
        const response = await fetch('http://localhost:3000/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            // Redireccionar si el registro fue exitoso
            location.href = '/TerrarioInfo/TerrarioInfo.html';
        } else {
            // Manejo de errores si la solicitud no fue exitosa
            const errorMessage = await response.text();
            alert(`Error al registrarse: ${errorMessage}`);
        }
    } catch (error) {
        // Manejo de errores en la solicitud
        alert('Error al conectarse con el servidor. Por favor, inténtelo de nuevo más tarde.');
    }
});
