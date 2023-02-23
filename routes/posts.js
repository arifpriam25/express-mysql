var express = require('express');
const { fromDataAsync } = require('xlsx-populate');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM books ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        judul: '',
        pengarang: '',
        penerbit: '',
        tahun_terbit: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {

    let judul = req.body.judul;
    let pengarang = req.body.pengarang;
    let penerbit = req.body.penerbit;
    let tahun_terbit = req.body.tahun_terbit;

    let errors = false;

    if (judul.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to add.ejs with flash message
        res.render('posts/create', {
            judul: judul,
            pengarang: pengarang,
            penerbit: penerbit,
            tahun_terbit: tahun_terbit,
        })
    }

    // if no error

    if (!judul || !pengarang || !penerbit || !tahun_terbit) {
        req.flash('error', 'pastikan data terisi!');
        res.redirect('/posts/');
    } else {
        let formData = {
            judul: judul,
            pengarang: pengarang,
            penerbit: penerbit,
            tahun_terbit: tahun_terbit,
        }

        // insert query
        connection.query('INSERT INTO books SET ?', formData, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('posts/create', {
                    judul: formData.judul,
                    pengarang: formData.pengarang,
                    penerbit: formData.penerbit,
                    tahun_terbit: formData.tahun_terbit,
                })
            } else {
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
            }
        })
    }
})

/**
 * EDIT POST
 */
router.get('/edit/(:id)', function (req, res, next) {

    let id = req.params.id;

    connection.query('SELECT * FROM books WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Buku Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/posts')
        } else {
            // render to edit.ejs
            res.render('posts/edit', {
                id: rows[0].id,
                judul: rows[0].judul,
                pengarang: rows[0].pengarang,
                penerbit: rows[0].penerbit,
                tahun_terbit: rows[0].tahun_terbit,
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function (req, res, next) {

    let id = req.params.id;
    let judul = req.body.judul;
    let pengarang = req.body.pengarang;
    let penerbit = req.body.penerbit;
    let tahun_terbit = req.body.tahun_terbit;
    let errors = false;

    if (!judul || !pengarang || !penerbit || !tahun_terbit) {
        req.flash('error', 'pastikan data terisi!');
        res.redirect('/posts/');
    } else {
        let formData = {
            judul: judul,
            pengarang: pengarang,
            penerbit: penerbit,
            tahun_terbit: tahun_terbit,
        }

        // update query
        connection.query('UPDATE books SET ? WHERE id = ' + id, formData, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('posts/edit', {
                    id: req.params.id,
                    judul: formData.judul,
                    pengarang: formData.pengarang,
                    penerbit: formData.penerbit,
                    tahun_terbit: formData.tahun_terbit,
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
            }
        })
    }
})

/**
 * DELETE POST
 */
router.get('/delete/(:id)', function (req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM books WHERE id = ' + id, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/posts');
        } else {
            req.flash('success', 'Data terhapus');
            res.redirect('/posts');
        }
    })
})
module.exports = router;
