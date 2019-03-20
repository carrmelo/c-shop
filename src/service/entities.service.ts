import { Repository, getRepository, getConnection } from 'typeorm';
import UserEntity from '../models/user.entity';
import CustomerEntity from '../models/customer.entity';

export const findOneUser = async (id: string) => {
  const user: UserEntity = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.created', 'createdBy')
    .leftJoinAndSelect('user.modified', 'modifiedBy')
    .where('user.id = :id', { id })
    .getOne();

  return user;
};

export const findAllUsers = async () => {
  const users: UserEntity[] = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.created', 'createdBy')
    .leftJoinAndSelect('user.modified', 'modifiedBy')
    .getMany();

  return users;
};

export const createOneUser = (userBody: UserEntity) => {
  const userRepo: Repository<UserEntity> = getRepository(UserEntity);
  const user: UserEntity = userRepo.create(userBody);
  return user;
};

export const insertOneUser = async (newUser: UserEntity) => {
  await getRepository(UserEntity)
    .createQueryBuilder()
    .insert()
    .into(UserEntity)
    .values(newUser)
    .execute();
};

export const deleteOneUser = async (id: string) => {
  await getRepository(UserEntity)
    .createQueryBuilder()
    .delete()
    .from(UserEntity)
    .where('id = :id', { id })
    .execute();
};

export const updateOneUser = async (updatedFields: any, id: string) => {
  await getRepository(UserEntity)
    .createQueryBuilder()
    .update(UserEntity)
    .set(updatedFields)
    .where('id = :id', { id })
    .execute();
};

//   const { name, email, password, isAdmin } = userBody;

//   if (await anyFieldIsWrong(user)) {
//     ctx.throw(BAD_REQUEST, 'Please check your user fields');
//   }

//   user.password = await hash(password, 10);
//   // Avoid case sensitivity on email
//   user.email = email.toLowerCase();

//   await getConnection()
//     .createQueryBuilder()
//     .insert()
//     .into(userEntity)
//     .values(user)
//     .execute();
//   // user = await userRepo.save(user);

//   // Token expiration set to 7 days
//   const token = sign(
//     {
//       id: user.id,
//       exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
//     },
//     process.env.APP_SECRET,
//   );

//   // Avoid send sensitive information to the client
//   delete user.password;
//   ctx.status = CREATED;
//   ctx.body = { token, data: user };
// };

// const [superUser] = await userRepo.find({ where: { superUser: true } });

//   if (signUp && superUser) {
//     throw ctx.throw(FORBIDDEN, 'A super user has already been created');
//   }

// const user: userEntity = userRepo.create({
//   name,
//   email,
//   password,
//   isAdmin: signUp ? true : isAdmin,
//   superUser: signUp ? true : false,
// });
