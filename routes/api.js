var express = require('express');
const { fromDataAsync } = require('xlsx-populate');
var router = express.Router();
var multer = require('multer');

//import database
var connection = require('../library/database');


router.post('/',multer().none(), function (req, res, next) {
    let action = req.body.action;

    let id = req.body.id;
    let judul = req.body.judul;
    let pengarang = req.body.pengarang;
    let penerbit = req.body.penerbit;
    let tahun_terbit = req.body.tahun_terbit;

    if (!action) {
        res.send('error 1');
    } else {
        if (action == 'insert') {
            
            if (!judul || !pengarang || !penerbit || !tahun_terbit) {
                res.send('parameter tidak sesuai');
            } else {
                let formData = {
                    judul: judul,
                    pengarang: pengarang,
                    penerbit: penerbit,
                    tahun_terbit: tahun_terbit,
                }
                connection.query('INSERT INTO books SET ?', formData, function (err, result) { //input data     
                    if (err) {
                        res.send('data tidak sesuai dengan database');
                    } else {
                        res.send('Data Berhasil Disimpan!');
                    }
                })
            }
        } else if (action == 'delete') {
            // res.send(id);
            connection.query('SELECT * FROM books WHERE id = ' + id, function(err,rows,fields){
                if(err)throw err
                if (rows.length <= 0) {
                    res.send('Data Buku Dengan ID ' + id + " Tidak Ditemukan")
                } else {
                    connection.query('DELETE FROM books WHERE id = ' + id, function (err, result) {
                        if (err) {
                            res.flash(err)
                        } else {
                            res.send('buku dengan id : `'+rows[0].id+'`, judul :`'+rows[0].judul+'` telah dihapus')
                        }
                    })
                }
            });
            
        } else {
            res.send('action tidak ditemukan')
        }
    }
})

router.post('/test',multer().none(), function (req, res,next) {
    let action = req.body.action;
    let id = req.body.id;
    if (!action || !id) {
        res.send('parameter tidak sesuai');
    }

    res.send('key_judul = ' + id + ' key_pengarang = ' + action);
    // res.status(200);
    res.send(req.body);
})

module.exports = router;
