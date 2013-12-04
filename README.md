NerdChat
========

P2P chat with syntax highlighting built with PeerJS, D3, Rainbow and Ace.

While watching a coworker interview someone in Google hangouts, we thought that it would be nice if
we can get syntax highlighting with chat to send quick code snippets. Then I thought, chat ain't that
hard specially with WebRTC. Syntax highlighting is easier with the vast number of libraries available.
Code editing? Ace. A few hours later, nerdchat was born.

It's dead simple to use:

1. Go to NerdChat.
2. Enter your name.
3. Share the link with your chatmate.
4. You're now nerdchatting!

The button beside the input box toggles chat and code mode. When in code mode, press shift + enter to send.

Right now only python is supported for syntax highlighting but it's trivial to add others.
I think this is perfect for quick code explanations and tech interviews.

Note: Uses PeerJS so it will only work if your browser supports it (latest Chrome and Firefox should do)
