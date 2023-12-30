const deleteProd = document.querySelectorAll('.deleteProd');
const payProducts = document.querySelector('.payProducts');

deleteProd.forEach(function (button) {
    button.addEventListener('click', async function () {
        const productId = button.getAttribute('productId');
        const cid = button.getAttribute('cid');

        await fetch(`/api/carts/${cid}/products/${productId}`, {
            method: 'DELETE',
        })
            .then(async response => {
                const resp = await response.json();
                return resp;
            })
            .then((data) => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `${data.payload}`,
                    showConfirmButton: false,
                    timer: 2000,
                })
            })
            .catch((error) => {
                throw new Error(`Error al editar el producto: ${error}`);
            });
        setTimeout(() => {
            location.reload();
        }, 2000);
    });
});

payProducts.addEventListener('click', async (e) => {
    e.preventDefault();

    const cartId = payProducts.getAttribute('cartId');


    await fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
    })
        .then(async response => {
            const resp = await response.json();
            return resp;
        })
        .then((data) => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Su compra de $${data.payload.amount} se realizó con éxito!`,
                showConfirmButton: false,
                timer: 2000,
            })
        })
        .catch((error) => {
            throw new Error(`Error al realizar el pago: ${error}`);
        });
    setTimeout(() => {
        location.reload();
    }, 2000);
})
