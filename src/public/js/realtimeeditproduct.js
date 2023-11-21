const socket = io();

const editProduct = document.getElementById('editProduct');
const deleteProd = document.getElementById('deleteProd');

deleteProd.addEventListener('submit', async (e) => {
    e.preventDefault();

    const pid = deleteProd.getAttribute('data-pid');

    await fetch(`/api/products/${pid}`, {
        method: 'DELETE',
    })
        .then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `El producto ha sido eliminado.`,
                showConfirmButton: false,
                timer: 2000,
            })
        })
        .then(() => {
            window.location.href = '/realtimeproducts';
        })
        .catch((error) => {
            throw new Error(`Error al editar el producto: ${error}`);
        });
})


editProduct.addEventListener('submit', async (e) => {
    e.preventDefault()

    const pid = editProduct.getAttribute('data-pid');

    const product = new FormData(editProduct);

    const obj = {};

    product.forEach((value, key) => value && (obj[key] = value));

    await fetch(`/api/products/${pid}`, {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(obj),
    })
        .then(response => {
            if (response.ok) {
                const resp = response.json();
                return resp;
            } else {
                throw new Error('Error al editar el producto.');
            };
        })
        .then(function () {
            socket.emit('addProd', obj);
            socket.on('newProduct', async data => {
                try {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `El producto ha sido editado.`,
                        showConfirmButton: false,
                        timer: 2000,
                    })
                } catch (error) {
                    throw new Error(`Error al editar el producto: ${error}`);
                }
            })
        })
        .catch((error) => {
            throw new Error(`Error al editar el producto: ${error}`);
        });
    setTimeout(() => {
        editProduct.reset();
        location.reload();
    }, 2000);
});