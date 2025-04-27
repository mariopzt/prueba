const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Endpoint mínimo para comprobar funcionamiento
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Endpoint raíz para comprobar funcionamiento
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// Importar rutas
const itemsRouter = require('./routes/items');
const pedidosRouter = require('./routes/pedidos');

// Usar rutas
app.use('/api/items', itemsRouter);
app.use('/api/pedidos', pedidosRouter);

// === Endpoints CRUD para usuarios como objetos normales ===
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Registro seguro de usuario (guardar usuario y contraseña hasheada)
app.post('/api/register', async (req, res) => {
  try {
    // Permite recibir 'tipo' o 'Tipo' pero siempre guarda en 'Tipo' (mayúscula)
    const { username, password, tipo } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'El usuario ya existe' });
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = new User({ username, password: passwordHash, tipo: tipo || '' });
    await user.save();
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password  } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    // Verificar el campo Tipo del usuario
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    res.json({ username: user.username, tipo: user.Tipo });
  } catch (error) {
    console.error('Error en /api/login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
