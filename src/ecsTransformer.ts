import type { Context } from "koa";

const Message = Symbol.for("message");

export const ecsTransformer = (
  info: {
    level: string;
    message: string;
    ctx?: Context;
    user?: any;
    txId?: string;
    err?: Error;
    tags?: string[];
  },
  options?: Record<string, any>
) => {
  const { level, message, ctx, user, txId, err, tags } = info;

  const parseUrl = () => {
    const requestUrl = ctx?.req?.url;
    const url: {
      full?: string;
      path?: string;
      query?: string;
      fragment?: string;
    } = { full: ctx?.URL?.href };
    const hasQuery = requestUrl?.indexOf("?") ?? -1;
    const hasAnchor = requestUrl?.indexOf("#") ?? -1;

    if (hasQuery > -1 && hasAnchor > -1) {
      url.path = requestUrl?.slice(0, hasQuery);
      url.query = requestUrl?.slice(hasQuery + 1, hasAnchor);
      url.fragment = requestUrl?.slice(hasAnchor + 1);
    } else if (hasQuery > -1) {
      url.path = requestUrl?.slice(0, hasQuery);
      url.query = requestUrl?.slice(hasQuery + 1);
    } else if (hasAnchor > -1) {
      url.path = requestUrl?.slice(0, hasAnchor);
      url.fragment = requestUrl?.slice(hasAnchor + 1);
    } else {
      url.path = requestUrl;
    }

    return url;
  };

  const parseClient = () => {
    const req = ctx?.request;
    let ip;
    const client: { ip?: string; address?: string; port?: number } = {};
    if (req?.ip) {
      ip = req.ip;
    } else if (req?.socket.remoteAddress) {
      ip = req.socket.remoteAddress;
    }
    if (ip) {
      client.ip = client.address = ip;
    }
    if (req?.socket) {
      client.port = req.socket.remotePort;
    }

    return client;
  };

  const req = ctx?.request;
  const res = ctx?.response;

  const ecsFields = {
    "@timestamp": new Date(),
    log: { level },
    message,
    ecs: {
      // NOTE: @see https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html
      version: "8.10.0", // 로깅 필드를 변경할 경우 ecs version 에 맞춰야 한다.
    },
    tags: tags ?? ["request"],
    service: {
      name: options?.name,
    },
    host: {
      name: process.env.HOSTNAME,
    },
    user,
    http: {
      version: ctx?.req?.httpVersion,
      request: {
        id: txId,
        method: req?.method,
        headers: req?.header && JSON.stringify(req.header),
        body: req?.body && { content: JSON.stringify(req.body) },
      },
      response: {
        status_code: res?.status,
        headers: res?.header,
      },
    },
    trace: {
      id: txId,
    },
    url: parseUrl(),
    user_agent: {
      original: req?.header["user-agent"],
    },
    client: parseClient(),
    error: err
      ? {
          code: ctx?.status,
          message: err.message,
          stack_trace: err.stack,
        }
      : undefined,
  };

  Object.assign(info, { [Message]: JSON.stringify(ecsFields) });

  return info;
};
