/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const fastifyOpts = {
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        levelFirst: true,
        translateTime: 'SYS:dd-mm-yyyy h:MM:ss TT Z',
        ignore: 'pid,hostname',
        colorize: true,
      },
      level: 'debug',
    },
    serializers: {
      res(_reply) {
        // The default
        return {
          statusCode: _reply.statusCode,
          statusMessage: _reply.raw.statusMessage,
        };
      },
      req(_request) {
        return {
          host: _request.headers.host,
          url: _request.url,
          path: _request.routerPath,
          method: _request.method,
          params: _request.params,
          query: _request.query,
        };
      },
    },
  },
};
