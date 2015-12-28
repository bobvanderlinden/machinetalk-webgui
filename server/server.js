var debug = require('debug')('machinetalk-webgui:index')
var machinetalk = require('machinetalk')
var util = require('util')
var EventEmitter = require('events').EventEmitter

var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var path = require('path');
var config = require('../webpack.config')

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

var serverPort = process.env.PORT || 3000;
var server = http.listen(serverPort, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info(
      'Listening on',
      server.address().address + ':' + server.address().port,
      '(http://localhost:' + server.address().port + '/)'
    )
  }
})


var requiredServices = ['status', 'command', 'error', 'preview'];

function Machine(uuid) {
  this.uuid = uuid;
  this.services = {};
  this.isOnline = false;
  this.isConnected = false;
  this.clients = {};

  this.subscriptions = [];
}
util.inherits(Machine, EventEmitter);
Machine.prototype._handleServiceUp = function(serviceName, dsn) {
  debug('Service ' + serviceName + ' up');
  this.services[serviceName] = dsn;
  this._updateIsOnline();
};
Machine.prototype._handleServiceDown = function(serviceName) {
  debug('Service ' + serviceName + ' down');
  this.services[serviceName] = undefined;
  this._updateIsOnline();
};
Machine.prototype._updateIsOnline = function() {
  var me = this;
  var isOnline = requiredServices.every(function(name) {
    return me.services[name];
  });
  if (isOnline !== me.isOnline) {
    me.isOnline = isOnline;
    if (isOnline) {
      this._handleOnline();
    } else {
      this.handleOffline();
    }
    this.emit('isonlinechanged', isOnline);
  }
};

Machine.prototype._handleOnline = function() {
  debug('Machine ' + this.uuid + ' online');

  this.emit('online');
  io.emit('action', {
    type: 'machine:online',
    uuid: this.uuid,
    host: this.host
  });

  if (this.hasSubscriptions()) {
    this.connect();
  }
};
Machine.prototype._handleOffline = function() {
  debug('Machine ' + this.uuid + ' offline');

  this.emit('offline');
  io.emit('action', {
    type: 'machine:offline',
    uuid: this.uuid,
    host: this.host
  });

  this.disconnect();
};

Machine.prototype.subscribe = function(socket) {
  debug('Subcribe to machine', this.uuid);
  clearTimeout(this.idleTimeout);
  this.subscriptions.push(socket);
  this.connect();
  socket.emit('action', {
    type: 'machine:status',
    uuid: this.uuid,
    status: this.clients.status.status
  });
};
Machine.prototype.unsubscribe = function(socket) {
  debug('Unsubscribe from machine', this.uuid);
  this.subscriptions.splice(this.subscriptions.indexOf(socket), 1);
  if (!this.hasSubscriptions()) {
    this.idleTimeout = setTimeout(this._handleIdle.bind(this), 5000);
  }
};
Machine.prototype.hasSubscriptions = function() {
  return this.subscriptions.length > 0;
};
Machine.prototype._handleIdle = function() {
  debug('Machine ' + this.uuid + 'was not used by any socket. Disconnecting.');
  this.disconnect();
};

Machine.prototype.connect = function() {
  if (this.isConnected) {
    debug('No need to connect, already connected');
    return;
  }
  debug('Machine ' + this.uuid + ' connect');
  this._initializeCommand(this.services.command);
  this._initializeStatus(this.services.status);
  this._initializeError(this.services.error);
  this._initializePreview(this.services.preview);
  this.isConnected = true;
};
Machine.prototype.disconnect = function() {
  if (!this.isConnected) { return; }
  debug('Machine ' + this.uuid + ' disconnect');
  this.clients.command.close();
  this.clients.status.close();
  this.clients.error.close();
  this.clients.preview.close();
  this.clients.command = undefined;
  this.clients.status = undefined;
  this.clients.error = undefined;
  this.clients.preview = undefined;
  this.isConnected = false;
};
Machine.prototype._initializeStatus = function(dsn) {
  var statusclient = this.clients.status = new machinetalk.StatusClient(this.services.status);
  statusclient.on('statuschanged', this._handleStatus.bind(this));
  statusclient.subscribe('task');
  statusclient.subscribe('motion');
  statusclient.subscribe('io');
  statusclient.subscribe('interp');
  statusclient.subscribe('config');
  statusclient.connect();
};
Machine.prototype._handleStatus = function(status) {
  var me = this;
  me.subscriptions.forEach(function(subscription) {
    subscription.emit('action', {
      type: 'machine:status',
      uuid: me.uuid,
      status: status
    });
  });
};

Machine.prototype._initializeCommand = function(dsn) {
  var commandclient = this.clients.command = new machinetalk.TaskCommandClient(this.services.command);
  commandclient.connect();
};

Machine.prototype._handleCommand = function(commandName, args) {
  var commandclient = this.clients.command;
  commandclient[commandName].apply(commandclient, args);
};

Machine.prototype._initializeError = function(dsn) {
  var errorclient = this.clients.error = new machinetalk.ErrorClient(this.services.error);
  errorclient.on('message:error', this._handleError.bind(this));
  errorclient.on('message:display', this._handleDisplay.bind(this));
  errorclient.on('message:text', this._handleText.bind(this));
  errorclient.connect();
};
Machine.prototype._handleError = function(message) {
  var me = this;
  me.subscriptions.forEach(function(subscription) {
    subscription.emit('action', {
      type: 'machine:error',
      uuid: me.uuid,
      message: message
    });
  });
};
Machine.prototype._handleDisplay = function(message) {
  var me = this;
  me.subscriptions.forEach(function(subscription) {
    subscription.emit('action', {
      type: 'machine:display',
      uuid: me.uuid,
      message: message
    });
  });
};
Machine.prototype._handleText = function(type, message) {
  var me = this;
  me.subscriptions.forEach(function(subscription) {
    subscription.emit('action', {
      type: 'machine:text',
      uuid: me.uuid,
      type: type,
      message: message
    });
  });
};

Machine.prototype._initializePreview = function(dsn) {
  var previewclient = this.clients.preview = new machinetalk.PreviewClient(this.services.preview);
  previewclient.on('preview', this._handlePreview.bind(this));
  previewclient.connect();
};
Machine.prototype._handlePreview = function(preview) {
  var me = this;
  me.subscriptions.forEach(function(subscription) {
    subscription.emit('action', {
      type: 'machine:preview',
      uuid: me.uuid,
      preview: preview
    });
  });
};

var machines = {};

function getMachine(uuid) {
  var machine = machines[uuid];
  if (!machine) {
    machine = machines[uuid] = new Machine(uuid);
  }
  return machine;
}

function getMachines() {
  return Object.keys(machines).map(function(key) {
    return machines[key];
  });
}





var browser = new machinetalk.MachineTalkBrowser();
browser.on('serviceUp', onMachineServiceUp);
browser.on('serviceDown', onMachineServiceDown);
browser.on('error', onBrowserError);
browser.start();

function onMachineServiceUp(service) {
  var machine = getMachine(service.machine.uuid);
  machine.host = service.machine.host;
  machine._handleServiceUp(service.name, service.dsn);
}

function onMachineServiceDown(service) {
  getMachine(service.machine.uuid)._handleServiceDown(service.name);
}

function onBrowserError(err) {
  console.error('Browser error', err);
}





io.on('connection', function(socket) {
  debug('Socket connected');

  var subscribedMachines = [];

  debug('Emitting ' + getMachines().length + ' machines to socket');
  getMachines().forEach(function(machine) {
    socket.emit('action', {
      type: machine.isOnline ? 'machine:online' : 'machine:offline',
      uuid: machine.uuid,
      host: machine.host
    });
  });

  socket.on('action', function(action) {
    var uuid = action.uuid;
    var machine = getMachine(uuid);
    switch(action.type) {
      case 'server/machine:subscribe':
        machine.subscribe(socket);
        subscribedMachines.push(machine);
        break;
      case 'server/machine:command':
        var commandArguments = action.arguments;
        machine._handleCommand.apply(machine, commandArguments);
        break;
      case 'server/machine:unsubscribe':
        machine.unsubscribe(socket);
        subscribedMachines.splice(subscribedMachines.indexOf(machine), 1);
        break;
      default:
        console.error('Invalid action received: ', action);
        socket.disconnect();
        break;
    }
  });

  socket.on('error', function(err) {
    console.error('Received error from socket', err, err.stack);
    socket.disconnect();
  });

  socket.on('disconnect', function() {
    debug('Socket disconnected');
    subscribedMachines.forEach(function(machine) {
      machine.unsubscribe(socket);
    });
  });
});
