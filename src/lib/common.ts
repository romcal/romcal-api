import express from 'express';
const router = express.Router();

export const Controller = (namespace = '') => {
  return function(constructor: Function) {
    constructor.prototype.__namespace__ = namespace;
  };
};

export const get = (router, route, fn) => {
  router.get(route, (req, res) => {
    try {
      return res.status(200).send(fn.call(this, req, res));
    } catch (e) {
      res.status(e.status).send({
        message: e.getResponse(),
        statusCode: e.getStatus(),
      });
    }
  });
};

export const Get = (route = '') => {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let np;

    if (!target.__routes__) target.__routes__ = [];
    target.__routes__.push(propertyKey);

    descriptor.value = function(...args) {
      if (this?.__namespace__) np = this.__namespace__;
      if (route.slice(0, 1) !== '/') route = `/${route}`;
      if (np) route = `/${np}${route}`;

      console.log(` - ${np || '{root}'}.${originalMethod.name}: ${route}`);

      router.get(route, (req, res) => {
        return res.status(200).send(originalMethod.apply(this, req.param, req.query, args));
      });

      return router;
    };

    return descriptor;
  };
};
