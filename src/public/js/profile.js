const premium = document.getElementById('premium');

premium.addEventListener('click', async (event) => {
    event.preventDefault();

    const userId = premium.getAttribute('userId');

    await fetch(`/current/${userId}/premium`, {
        method: 'PUT',
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al actualizar el rol de usuario');
            };
        })
        .then(response => {
            if (response.payload.role === 'premium') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Felicidades ${response.payload.first_name}. Ya puedes publicar tus productos!`,
                    showConfirmButton: false,
                    timer: 2500,
                })
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Lo sentimos ${response.payload.first_name}. Por el momento no podemos actualizar tu rol.`,
                    showConfirmButton: false,
                    timer: 2000,
                })
            }
        })
        .then(() => {
            setTimeout(() => {
                location.reload();
            }, 2500);
        })
        .catch(error => {
            console.log(error);
        })


})