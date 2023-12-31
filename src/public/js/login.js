const loginForm = document.getElementById('loginForm');
const forgotPassword = document.getElementById('forgotPassword');

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


forgotPassword.addEventListener('click', async (e) => {

    const swal = await Swal.fire({
        title: 'E-Mail',
        input: 'text',
        text: 'Ingrese su correo para restablecer su contraseña',
    });
    const userEmail = swal.value;

    try {
        const response = await fetch('/auth/recover-password', {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({ email: userEmail }),
        });

        const recoverPassword = await response.json();

        if (recoverPassword.message === 'ok') {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Revisa tu correo electrónico para restablecer tu contraseña!`,
                showConfirmButton: false,
                timer: 3000
            });
        } else if (recoverPassword.message === 'notIsMail') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'E-Mail Inválido',
                text: 'El correo ingresado no es válido.',
                showConfirmButton: false,
                timer: 3000
            });
        } else if (recoverPassword.message === 'notFound') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'E-Mail no encontrado',
                text: 'El correo no se encuentra registrado.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    } catch (error) {
        throw new Error('Error al enviar el correo');
    }

})
