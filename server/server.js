var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var path = require('path');
var config = require('../webpack.config')

var express = require('express')
var app = express()

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

var server = app.listen(3000, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('Listening on', server.address().address + ':' + server.address().port)
  }
})
