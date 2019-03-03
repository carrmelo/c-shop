import * as jwt from 'koa-jwt';

export default jwt({
  getToken(ctx: any, opts: any) {
    console.log('mmmmmmmmmmmmmmm', ctx.header.authorization.split(' ')[1]);
    return ctx.header.authorization.split(' ')[1];
  },
  secret: process.env.APP_SECRET,
  passthrough: true,
  key: 'jwt',
});
// export { jwt({ secret: process.env.APP_SECRET }).unless({ path: [/^\/sign/] })}
