const transport = require('./nodemailer.util');
const { mailer } = require('../config');

const sendVerifyMail = async (user, verifyLink) => {
    await transport.sendMail({
        from: mailer.userMail,
        to: user.email,
        subject: `Bienvenido a nuestra web, ${user.first_name}!!!`,
        html: `
        <div>
            <h1>Gracias por elegirnos ${user.first_name}!!</h1>
            <p>Para poder comprar nuestros productos es necesario verificar tu correo electrónico.</p>
            <p>Sólo debes seguir el enlace en el botón VERIFICAR CORREO</p>
            <a href="${verifyLink}" style="text-decoration: none;">
                <button type="button" style="background-color: #3498db; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">VERIFICAR CORREO</button>
            </a>
        </div>
    `
    })
};

const sendTicket = async (user, productsTicket) => {
    const productsListHTML = productsTicket.products.map(product => `<li>${product.title} - ${product.price}</li>`).join('');

    const emailBody = `
        <div>
            <h1>Hola, ${user.first_name}!!</h1>
            <p>Le enviamos el ticket de su compra.</p>
            <ul>
                ${productsListHTML}
            </ul>
            <p>Total: ${productsTicket.total}</p>
            <p>Gracias por elegirnos!!</p>
        </div>
    `

    await transport.sendMail({
        from: mailer.userMail,
        to: user.email,
        subject: 'Ticket de compra',
        html: emailBody
    });
};

module.exports = {
    sendVerifyMail,
    sendTicket,
};