const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();

        const obj = {};

        const formData = new FormData(loginForm);

        formData.forEach((value, key) => obj[key] = value);

        const response = await fetch('/auth/login', {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(obj),
        });

        const userSession = await response.json();

        if (userSession.status === 'success') {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Te damos la bienvenida ${userSession.payload.first_name}!!`,
                showConfirmButton: false,
                timer: 2000
            })
                .then(() => {
                    window.location.href = '/api/products';
                });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error de autenticación',
                text: 'Usuario o contraseña incorrectos',
                showConfirmButton: false,
                timer: 3000
            })
                .then(() => {
                    location.reload();
                });
        }


    } catch (error) {
        console.log('Error en la solicitud: ' + error);
    }
})