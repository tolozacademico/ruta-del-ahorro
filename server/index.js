import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './passport.js';


const app = express();

app.use(session({
  secret:'unaClaveSegura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax' }
}));


app.use(passport.initialize());
app.use(passport.session());



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


const db = mysql.createPool(
 'mysql://root:hmliTwBiMVzMzUzrGBFFATdnENafwqrj@switchyard.proxy.rlwy.net:58752/railway'
);




app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM Usuarios WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      // Enviamos los datos del usuario al frontend (sin la contraseña)
      const usuario = rows[0]; // nombre, email, etc.
      res.send({ success: true, user: usuario });
    } else {
      res.send({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("Error en /auth:", err);
    res.status(500).send({ success: false, message: "Error del servidor" });
  }
});


app.post("/register", async (req, res) => {
  const { email, password, nombre } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Usuarios (email, password,nombre) VALUES (?, ?,?)",
      [email, password , nombre]
    );
    res.send({ success: true });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).send({ success: false });
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/',
    session: true,
  }),
  (req, res) => {
    const User = {
    
      nombre:req.user.name,
      email: req.user.email,
      photo: req.user.photo
    }
    req.session.passport.user = User;
    res.redirect('http://localhost:3000/');
  }
);


app.get('/auth/user', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(null);
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
});

app.listen(3001, () => {
  console.log("corriendo en el puerto 3001");
});
