const logout = document.getElementById('logout');
const addProd = document.getElementById('addProduct');

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

const socket = io();


addProd.addEventListener('submit', async (e) => {
    e.preventDefault();

    const products = new FormData(addProd);

    const obj = {};

    products.forEach((value, key) => (obj[key] = value));

    await fetch('/api/products', {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(obj),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al agregar el producto al carrito.');
            };
        })
        .then(function () {
            socket.emit('addProd', obj);

            socket.on('newProduct', async data => {
                try {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `El producto ${data} ha sido agregado.`,
                        showConfirmButton: false,
                        timer: 2000,
                    })
                } catch (error) {
                    throw new Error(`Error al agregar el producto al carrito: ${error}`);
                }
            })
        })
        .catch((error) => {
            throw new Error(`Error al agregar el producto al carrito: ${error}`);
        });
    setTimeout(() => {
        addProd.reset();
        location.reload();
    }, 2000);
});