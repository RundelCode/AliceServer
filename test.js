const { openApp } = require('./modules/appModule');

const fakeWS = {
  send: (msg) => console.log('[WS]', msg)
};

openApp('spotify', fakeWS);