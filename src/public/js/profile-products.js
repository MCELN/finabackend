const logout = document.getElementById('logout');

logout.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/auth/logout', {
            method: 'DELETE',
        });

        if (response.ok) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Te esperamos pronto!',
                showConfirmButton: false,
                timer: 2000,
            })
                .then(() => {
                    window.location.href = '/auth/login';
                });
        };

    } catch (error) {
        console.log('Error al cerrar session', error);
    };
});