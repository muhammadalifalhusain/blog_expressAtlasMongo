const path = require('path');
const express = require('express');
const blogRoutes = require('./routes/blog');
const db = require('./data/database');

const app = express();

// Mengaktifkan EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files (e.g. CSS files)

app.use(blogRoutes);

// Error handling middleware
app.use(function(error, req, res, next) {
    console.log(error);
    res.status(500).render('500'); // Pastikan Anda punya view '500.ejs' untuk error
});

// Koneksi ke MongoDB dan mulai server
db.connectToDb().then(function() {
    app.listen(4000, () => {
        console.log('Server berjalan di http://localhost:4000');
    });
}).catch(err => {
    console.error('Gagal terhubung ke database:', err.message);
});