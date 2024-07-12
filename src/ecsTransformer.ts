import type { Context } from "koa";

const Message = Symbol.for("message");

/**
 * @see https://www.elastic.co/guide/en/ecs/8.10/ecs-device.html
 */
type DeviceField = {
  id?: string;
  manufacturer?: string;
  model?: {
    identifier?: string;
    name?: string;
  };
  [key: string]: any; // NOTE: ecs 확장을 위한 임의의 필드
}

export const ecsTransformer = (
  info: {
    level: string;
    message: string;
    ctx?: Context;
    user?: any;
    txId?: string;
    err?: Error & { [key: string]: any };
    tags?: string[];
    device?: DeviceField;
  },
  options?: Record<string, any>
) => {
  const { level, message, ctx, user, txId, err, tags, device } = info;

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
    const xForwardedFor = req?.header["x-forwarded-for"] as string | undefined;
    const xRealIp = req?.header["x-real-ip"] as string | undefined;

    // NOTE: https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/X-Forwarded-For 헤더는 수정이 가능하지만 명세상으로는 가장 왼쪽이 최초 client IP를 바라본다.
    const ip =
      xForwardedFor?.split(",")[0]?.trim() ||
      xRealIp ||
      req?.socket.remoteAddress;

    return {
      ip,
      address: ip,
      port: req?.socket.remotePort,
    };
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
          ...err,
          code: err.code ?? ctx?.status,
          message: err.message,
          stack_trace: err.stack,
        }
      : undefined,
    device,
  };

  Object.assign(info, { [Message]: JSON.stringify(ecsFields) });

  return info;
};
