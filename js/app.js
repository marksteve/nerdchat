Mousetrap=function(a){var c=a.stopCallback,b=!0;a.stopCallback=function(a,d,e){return b?c(a,d,e):!0};a.pause=function(){b=!1};a.unpause=function(){b=!0};return a}(Mousetrap);

var username = prompt("What's your name?");
var app = d3.select('.app');
var messages = d3.select('.messages');
var ip = d3.select('.input');
var ii = ip.select('.message input');
var ie = ip.select('.message .editor');
var mu = d3.select('.messages ul');
var tb = d3.select('.toggle button');
var peer = new Peer({key: '713xpomlnkjiqkt9'});
var editor = ace.edit(ie.node());
var ctx = {
  mode: 'chat',
  messages: array()
};

function pushMsg(d) {
  ctx.messages.push(d);
}

function system(m) {
  pushMsg({username: 'NerdChat', type: 'chat', message: m});
}

function manage(conn) {

  Mousetrap.bind('enter', function(e) {
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

  conn.on('open', function() {
    system("Connected with " + conn.peer);
    ii.node().focus();
    toggleMode('chat');
    ip.classed('hide', false);
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

  if (li.datum().type == 'chat') {
    message.text(function(d) {
      return d.message;
    });
  } else {
    message.html(function(d) {
      return '<pre><code data-language="python">' + d.message + '</code></pre>';
    });
    Rainbow.color(message.node());
  }

  messages.property('scrollTop', messages.property('scrollHeight'));

}

function toggleMode(mode) {
  if (mode) {
    ctx.mode = mode;
  } else {
    ctx.mode = ctx.mode == 'chat' ? 'code' : 'chat';
  }
  tb.text(ctx.mode);
  if (ctx.mode == 'chat') {
    Mousetrap.unpause();
  } else {
    Mousetrap.pause();
  }
  ii.classed('hide', ctx.mode != 'chat');
  ie.classed('hide', ctx.mode != 'code');
  app.classed('chat', ctx.mode == 'chat');
  app.classed('code', ctx.mode == 'code');
}

editor.setTheme('ace/theme/solarized_light');
editor.getSession().setMode('ace/mode/python');
ctx.messages.on('add', render);
tb.on('click', toggleMode);

peer.on('open', function(id) {
  if (location.hash.length > 0) {
    id = location.hash.substr(1);
    system("Joining " + id + "...");
    manage(peer.connect(id));
  } else {
    system("Make people go to " + location.origin + location.pathname + "#" + id + " to chat with you!");
    peer.on('connection', manage);
  }
});
