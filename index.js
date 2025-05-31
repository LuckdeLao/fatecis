const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/views/admin.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.send('Nenhum arquivo enviado.');
  res.send('Arquivo enviado com sucesso: <a href="/admin">Voltar</a>');
});

app.get('/arquivos', (req, res) => {
  const dirPath = path.join(__dirname, 'public/uploads');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.send('Erro ao listar arquivos');
    let lista = '<h1>Arquivos Enviados</h1><ul>';
    files.forEach(file => {
      lista += `<li><a href="/uploads/${file}" target="_blank">${file}</a></li>`;
    });
    lista += '</ul><a href="/">Voltar</a>';
    res.send(lista);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});