var username = prompt("What's your name?");
var id = document.cookie.length > 0 ? document.cookie : null;
var app = d3.select('.app');
var messages = d3.select('.messages');
var ip = d3.select('.input');
var ii = ip.select('.message input');
var ie = ip.select('.message .editor');
var mu = d3.select('.messages ul');
var tb = d3.select('.toggle button');
var peer = new Peer(id, {key: '713xpomlnkjiqkt9'});
var editor = ace.edit(ie.node());
var ctx = {
  mode: 'chat',
  messages: array()
};

function pushMsg(d) {
  ctx.messages.push(d);
}

function sys(m) {
  pushMsg({username: 'NerdChat', type: 'sys', message: m});
}

function manage(conn) {

  if (location.hash.length == 0) {
    location.hash = conn.peer;
  }

  if (document.cookie.length == 0) {
    document.cookie = peer.id;
  }

  Mousetrap.bind('enter', function(e) {
    if (ctx.mode != 'chat') return;
    var message = ii.node().value;
    if (message.length > 0) {
      var d = {
        username: username,
        type: 'chat',
        message: message
      };
      pushMsg(d);
      conn.send(d);
    }
    ii.node().value = '';
  });
  Mousetrap.bind('ctrl+m', function(e) { toggleMode() });

  editor.commands.addCommand({
    name: 'send',
    bindKey: {win: 'Shift-Enter', mac: 'Shift-Enter'},
    exec: function() {
      var d = {
        username: username,
        type: 'code',
        message: editor.getValue()
      };
      pushMsg(d);
      conn.send(d);
    }
  });
  editor.commands.addCommand({
    name: 'toggleMode',
    bindKey: {win: 'Ctrl-m', mac: 'Ctrl-m'},
    exec: function() {
      toggleMode();
    }
  });

  conn.on('open', function() {
    sys("Connected with " + conn.peer);
    ip.classed('hide', false);
    toggleMode('chat');
  });

  conn.on('data', pushMsg);
}

function render() {

  var li = mu.selectAll('li')
    .data(ctx.messages)
    .enter().append('li');

  li.append('div')
    .classed('username', true)
    .text(function(d) {
      return d.username;
    })

  var message = li.append('div').classed('message', true);

  switch (li.datum().type) {
    case 'sys':
      message.html(function(d) {
        return d.message;
      });
      break;
    case 'code':
      message.html(function(d) {
        return '<pre><code data-language="python">' + d.message + '</code></pre>';
      });
      Rainbow.color(message.node());
      break;
    default:
    case 'chat':
      message.text(function(d) {
        return d.message;
      });
      break;
  }

  messages.property('scrollTop', messages.property('scrollHeight'));

}

function toggleMode(mode) {
  if (mode) {
    ctx.mode = mode;
  } else {
    ctx.mode = ctx.mode == 'chat' ? 'code' : 'chat';
  }
  tb.text(ctx.mode + ' [ctrl+m]');
  ii.classed('hide', ctx.mode != 'chat');
  ie.classed('hide', ctx.mode != 'code');
  app.classed('chat', ctx.mode == 'chat');
  app.classed('code', ctx.mode == 'code');
  if (ctx.mode == 'chat') ii.node().focus();
  else editor.focus();
}

editor.setTheme('ace/theme/solarized_light');
editor.getSession().setMode('ace/mode/python');
ctx.messages.on('add', render);
tb.on('click', toggleMode);

peer.on('open', function(id) {
  if (location.hash.length > 0) {
    id = location.hash.substr(1);
    sys("Joining " + id + "...");
    manage(peer.connect(id));
  } else {
    sys("Make people go to <strong>" + location.origin + location.pathname + "#" + id + "</strong> to chat with you!");
    peer.on('connection', manage);
  }
});
