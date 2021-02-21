import { MiddlewareFn } from 'type-graphql';
import { MyContext } from './MyContext';
import jwt from 'jsonwebtoken';

const APP_SECRET = process.env.SESSION_SECRET || 'slslsllsls';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers['authorization'];
  try {
    const token = authorization?.replace('Bearer ', '');
    const user = jwt.verify(token!, APP_SECRET) as any;
    context.res.locals.userId = user.id;
    return next();
  } catch (e) {
    throw new Error(e.message);
  }
};
