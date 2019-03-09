import * as Koa from 'koa';
import { BAD_REQUEST } from 'http-status-codes';

export default (ctx: Koa.Context, next: () => Promise<any>) => {
  const { picture } = ctx.request.files;
  const acceptedFormats = ['png', 'jpg'];

  if (!picture) return next();
  const [typeImage, format] = picture.type.split('/');
  if (typeImage !== 'image' || !acceptedFormats.includes(format)) {
    ctx.throw(BAD_REQUEST, 'Wrong picture format, please upload a jpg or png');
  }
  if (picture.size > 500000) {
    ctx.throw(
      BAD_REQUEST,
      'Picture is too big, please upload a maximum of 500 KB',
    );
  }
  return next();
};
