const socket = io();

const addProd = document.getElementById('addProduct');

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
        .then(function (data) {
            socket.emit('addProd', obj);
        })
        .then(function (data) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `El producto ${data.title} ha sido agregado.`,
                showConfirmButton: false,
                timer: 2000,
            });
        })
        .catch((error) => {
            throw new Error(`Error al agregar el producto al carrito: ${error}`);
        });
    addProd.reset();
})