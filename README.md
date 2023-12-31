# Ecommerce API

## Descripción

Este proyecto forma parte del curso de Backend en Coderhouse y proporciona una API REST para brindar una experiencia de compra en línea en un Ecommerce.

## Inicio Rápido

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar la Aplicación:**
   ```bash
   npm run start:dev-mongo
   ```

## Funcionalidades Principales

### Home

- Punto de inicio donde se listan los productos disponibles.

### Iniciar Sesión

- Permite a los usuarios iniciar sesión.
- Si no tienes un usuario, puedes registrarte.

### Registro

- Después del registro, se envía un correo con un enlace de verificación.

### Verificación de Usuario

- El usuario debe verificar su correo antes de agregar productos al carrito.

### Carrito de Compras

- El carrito tiene una duración de 15 minutos.
- Se reinicia la cuenta mientras el carrito está activo.
- Solo se pueden agregar productos con stock disponible.
- Si un producto se agota antes de la compra, permanecerá en el carrito sin facturación.
- Una vez termianda la compra, se manda un mail listando los productos, subtotales y total de la compra.

### Olvido de Contraseña

- Permite cambiar la contraseña mediante un correo con un enlace que expira en 5 minutos.

### Premium

- Los usuarios pueden volverse premium desde su perfil.
- Los usuarios premium pueden publicar sus productos.
