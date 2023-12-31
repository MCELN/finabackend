const recoverPassword = document.getElementById('recoverPassword');

recoverPassword.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = recoverPassword.getAttribute('userId');

    const obj = {};

    const formData = new FormData(recoverPassword);

    formData.forEach((value, key) => obj[key] = value);

    try {
        const res = await fetch(`/auth/change-password/${userId}`, {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(obj),
        });

        const response = await res.json();

        if (response.message === 'ok') {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Tu contraseña ha sido cambiada con exito!!`,
                showConfirmButton: false,
                timer: 3000
            })
                .then(() => {
                    window.location.href = '/auth/login';
                });
        } else if (response.message === 'errorConfirmation') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error al modificar la contraseña',
                text: 'Verifica los datos e intenta nuevamente',
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