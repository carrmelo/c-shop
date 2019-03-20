import { Repository, getRepository } from 'typeorm';
import userEntity from '../models/user.entity';

export const createUser = async (user, signUp: boolean = false) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const [superUser] = await userRepo.find({ where: { superUser: true } });

  if (signUp && superUser) {
    throw ctx.throw(FORBIDDEN, 'A super user has already been created');
  }

  const { name, email, password } = ctx.request.body;

  const user: userEntity = userRepo.create({
    name,
    email,
    password,
    isAdmin: true,
    superUser: true,
  });

  if (await anyFieldIsWrong(user)) {
    ctx.throw(BAD_REQUEST, 'Please check your user fields');
  }

  user.password = await hash(password, 10);
  // Avoid case sensitivity on email
  user.email = email.toLowerCase();

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(userEntity)
    .values(user)
    .execute();
  // user = await userRepo.save(user);

  // Token expiration set to 7 days
  const token = sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    process.env.APP_SECRET,
  );

  // Avoid send sensitive information to the client
  delete user.password;
  ctx.status = CREATED;
  ctx.body = { token, data: user };
};
