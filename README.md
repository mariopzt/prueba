# Proyecto MongoDB Atlas

Este es un proyecto básico que utiliza Node.js, Express, MongoDB y Mongoose para crear una API que permite guardar y recuperar información de MongoDB Atlas.

## Configuración

1. Instalar las dependencias:
```bash
npm install
```

2. Configurar MongoDB Atlas:
   - Crear una cuenta en MongoDB Atlas
   - Crear un nuevo cluster
   - Obtener la cadena de conexión
   - Reemplazar en el archivo .env la variable MONGODB_URI con tu cadena de conexión

3. Iniciar el servidor:
```bash
npm start
```

## Endpoints

- GET `/api/items` - Obtener todos los items
- POST `/api/items` - Crear un nuevo item

Ejemplo de body para POST:
```json
{
  "nombre": "Ejemplo",
  "descripcion": "Esta es una descripción"
}
```
