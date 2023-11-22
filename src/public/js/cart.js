const deleteProd = document.querySelectorAll('.deleteProd');

deleteProd.forEach(function (button) {
    button.addEventListener('click', async function () {
        const productId = button.getAttribute('productId');
        const cid = button.getAttribute('cid');

        console.log(productId)

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
