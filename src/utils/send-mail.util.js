const transport = require('./nodemailer.util');
const { mailer } = require('../config');

const sendVerifyMail = async (user, verifyLink) => {

    const emailBody = `
    <div>
        <h1>Gracias por elegirnos ${user.first_name}!!</h1>
        <p>Para poder comprar nuestros productos es necesario verificar tu correo electrónico.</p>
        <p>Sólo debes seguir el enlace en el botón VERIFICAR CORREO</p>
        <a href="${verifyLink}" style="text-decoration: none;">
            <button type="button" style="background-color: #3498db; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">VERIFICAR CORREO</button>
        </a>
    </div>
    `;

    await transport.sendMail({
        from: mailer.userMail,
        to: user.email,
        subject: `Bienvenido a nuestra web, ${user.first_name}!!!`,
        html: emailBody,
    });
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

const sendPremiumUp = async (user) => {
    const emailBody = `
        <div>
            <h1>Felicidades ${user.first_name}!!</h1>
            <p>Ya puedes publicar tus productos.</p>
            <p>Gracias por elegirnos!!</p>
        </div>
    `;

    await transport.sendMail({
        from: mailer.userMail,
        to: user.email,
        subject: 'Ahora eres premium',
        html: emailBody
    });
}

const sendDeleteProductPremium = async (user, product) => {
    const emailBody = `
        <div>
            <h1>Hola ${user.first_name}!!</h1>
            <p>Su producto ${product.title} ha sido eliminado.</p>
            <p>Ante cualquier duda, comuniquese con el administrador.</p>
        </div>
    `;

    await transport.sendMail({
        from: mailer.userMail,
        to: user.email,
        subject: 'Producto eliminado',
        html: emailBody
    });
}

const sendRecoverPassword = async (user, recoverLink) => {
    const emailBody = `
        <div>
            <h1>Hola ${user.first_name}!!</h1>
            <p>Para crear una nueva contraseña, haga click en el siguiente enlace.</p>
            <p>El link expirará en 10 minutos.</p>
            <p>Si usted no ha pedido una nueva contraseña, ignore este correo.</p>
            <a href="${recoverLink}" style="text-decoration: none;">
            <button type="button" style="background-color: #3498db; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Crear nueva contraseña</button>
        </a>
        </div>
    `;

    await transport.sendMail({
        from: mailer.userMail,
        to: user.email,
        subject: 'Recuperar contraseña',
        html: emailBody
    });
}

module.exports = {
    sendVerifyMail,
    sendTicket,
    sendPremiumUp,
    sendDeleteProductPremium,
    sendRecoverPassword,
};