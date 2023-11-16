const logout = document.getElementById('logout');
const addToCartButtons = document.querySelectorAll('.addToCart');

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

addToCartButtons.forEach(function (button) {
    button.addEventListener('click', async function () {
        const productId = button.getAttribute('productId');
        const cartId = button.getAttribute('cartId');

        await fetch(`/api/carts/${cartId}/products/${productId}`, {
            headers: {
                "Content-Type": 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({
                quantity: 1,
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al agregar el producto al carrito.');
                };
            })
            .then(response => {
                if (response.message === 'notstock') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Producto no se encuentra en stock.',
                        showConfirmButton: false,
                        timer: 2500,
                    });
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${response.payload}`,
                        showConfirmButton: false,
                        timer: 2700,
                    });
                }
            })
            .catch(function (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `${error}`,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });

    });
});