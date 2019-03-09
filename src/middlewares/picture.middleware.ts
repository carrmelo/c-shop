import * as Koa from 'koa';
// import { UNAUTHORIZED } from 'http-status-codes';

export default (ctx: Koa.Context, next: () => Promise<any>) => {
  const { picture } = ctx.request.files;
  const acceptedFormats = ['png', 'jpg'];
  if (!picture) return next();
  const [typeImage, format] = picture.type.split('/');
  if (typeImage !== 'image' || !acceptedFormats.includes(format)) {
    ctx.throw('400', 'BADD');
  }

  // ctx.assert(ctx.state.user, UNAUTHORIZED);
  return next();
};
