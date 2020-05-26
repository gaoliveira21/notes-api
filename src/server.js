import server from './app';

server.listen(process.env.APP_PORT || 3333);
