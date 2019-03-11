# C-SHOP

Simple RESTful API (KOA && TypeScript && PosgreSQL) to admin customers and users.

## Table of contents

- [Getting started](#getting-started)
- [Postman collection](#postman-collection)
- [Routes](#routes)

## Getting started

After cloning the repo you'll have to :

### Install local dependencies and external resources

To install all dependencies clone the repository and run [Npm](https://www.npmjs.com/) `npm i` or [Yarn](https://yarnpkg.com/en/) `yarn install`

To install PostgreSQL via [Homebrew](https://brew.sh/) and follow [these instructions](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3).

```bash
brew install postgres
```

Run the CLI with the `psql` command, and

```bash
CREATE DATABASE cshop
```

You should also create an [AWS](https://aws.amazon.com) account and create a bucket on S3.

Now, on your local repository files, duplicate .env.example and ormconfig.json.example, remove the .example and fill it up with your information.

and you should be ready to go.

## Postman collection

You can test all the following routes with [this collection](https://documenter.getpostman.com/view/3976260/S11RLFri)

## Routes:

### Authentication:

#### SignUp

With this route you'll be able to create a superuser for your api, once created you should use the jwt token as a Bearer Token in your Authorization Headers to use the customers and users routes. You can only create one superuser, so remember to copy that token (it will expire in one week).

| POST              | http://yourroute/signup                                                                                                                                                                                                                                            |
| :---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Body              | `{ name: string, email: string, password: string }`<br />Name: minimum of 3 characters<br />Password: it must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character @\$!%\*?/.\& <br /> |
| Responses         |                                                                                                                                                                                                                                                                    |
| 200 - Created     | Data:<br />User `{id, name, email, isAdmin}`<br />Token                                                                                                                                                                                                            |
| 400 - Bad Request | One of your fields is wrong. Please check your user fields.                                                                                                                                                                                                        |

#### SignIn

The token at sign in will expire in one hour.

| POST            | http://yourroute/sign/in                               |
| :-------------- | ------------------------------------------------------ |
| Body            | `{ email: string, password: string }`                  |
| Responses       |                                                        |
| 200 - OK        | Data:<br/>User `{id, name, email, isAdmin}`<br />Token |
| 404 - Not Found | User email is not in the Database                      |
| 404 - Not Found | Password did not match with the one in the Database    |

### Customers:

These are protected routes, only users can access them.

####List All Customers

| GET                | http://yourroute/customers                                                         |
| :----------------- | ---------------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                         |
| Parameters         | Customer_id: uuid                                                                  |
| Responses          |                                                                                    |
| 200 - Ok           | Data: Customers [ ]<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can list customers.                                       |

#### List One Customers

| GET                | http://yourroute/customers/:customer_id                                        |
| :----------------- | ------------------------------------------------------------------------------ |
| Request Headers    | Authorization Bearer Token                                                     |
| Parameters         | Customer_id: uuid                                                              |
| Responses          |                                                                                |
| 200 - Ok           | Data: Customer<br />`{ id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can list customers.                                   |
| 404 - Not Found    | Customer is not in the Database                                                |

#### Create Customer

| POST               | http://yourroute/customers                                                                                              |
| :----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                                                              |
| Body               | `{ name: string, surname: string, pictureUrl?: file }`<br/>Name: Minimum 3 characters<br/>Surname: Minimum 3 characters |
| Responses          |                                                                                                                         |
| 201 - Created      | Data: Customer<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }`                                           |
| 400 - Bad Request  | One of your fields is wrong. Please check your customer fields.                                                         |
| 401 - Unauthorized | Only Authenticated users can create customers.                                                                          |

#### Delete Customer

| DELETE             | http://yourroute/customers/:customer_id        |
| :----------------- | ---------------------------------------------- |
| Request Headers    | Authorization Bearer Token                     |
| Parameters         | Customer_id: uuid                              |
| Responses          |                                                |
| 204 - No Content   |                                                |
| 401 - Unauthorized | Only Authenticated users can delete customers. |
| 404 - Not Found    | Customer is not in the Database                |

#### Edit Customer

| PATCH              | http://yourroute/customers/:customer_id                                                                                                                                                                                                                                   |
| :----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                                                                                                                                                                                                                |
| Parameters         | Customer_id: uuid                                                                                                                                                                                                                                                         |
| Body               | `{ name?: string, surname?: string, pictureUrl?: string }`<br />Name: minimum of 3 characters<br />Password: it must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character @\$!%\*?/.\& <br /> |
| Responses          |                                                                                                                                                                                                                                                                           |
| 202 - Accepted     | Data: Customer<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }`                                                                                                                                                                                             |
| 400 - Bad Request  | One of your fields is wrong. Please check your customer fields.                                                                                                                                                                                                           |
| 401 - Unauthorized | Only Authenticated users can create customers.                                                                                                                                                                                                                            |
| 404 - Not Found    | Customer is not in the Database                                                                                                                                                                                                                                           |

#### Remove Picture

| PATCH              | http://yourroute/customers/remove-pic/:customer_id          |
| :----------------- | ----------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                  |
| Parameters         | User_id: uuid                                               |
| Responses          |                                                             |
| 204 - No Content   |                                                             |
| 400 - Bad Request  | One of your fields is wrong. Please check your user fields. |
| 401 - Unauthorized | Only Authenticated users can create Users.                  |
| 404 - Not Found    | User is not in the Database. User don't have a picture      |

### Users:

These are protected routes, only admin users can access them.

####List All Users

| GET                | http://yourroute/users                     |
| :----------------- | ------------------------------------------ |
| Request Headers    | Authorization Bearer Token                 |
| Parameters         | User_id: uuid                              |
| Responses          |                                            |
| 200 - Ok           | Data: Users [ ]<br />`{ id, name, email }` |
| 401 - Unauthorized | Only Authenticated users can list Users.   |
| 403 - Forbidden    | Only Admin users can list Users.           |

#### List One Users

| GET                | http://yourroute/users/:user_id          |
| :----------------- | ---------------------------------------- |
| Request Headers    | Authorization Bearer Token               |
| Parameters         | User_id: uuid                            |
| Responses          |                                          |
| 200 - Ok           | Data: User<br />`{ id, name, email }`    |
| 401 - Unauthorized | Only Authenticated users can list Users. |
| 403 - Forbidden    | Only Admin users can list Users.         |
| 404 - Not Found    | User is not in the Database              |

#### Create User

| POST               | http://yourroute/users                                      |
| :----------------- | ----------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                  |
| Body               | `{ name: string, surname: string, pictureUrl: string }`     |
| Responses          |                                                             |
| 201 - Created      | Data: User<br />`{id, name, email }`                        |
| 400 - Bad Request  | One of your fields is wrong. Please check your user fields. |
| 401 - Unauthorized | Only Authenticated users can create Users.                  |
| 403 - Forbidden    | Only Admin users can list Users.                            |

#### Delete User

| DELETE             | http://yourroute/users/:user_id            |
| :----------------- | ------------------------------------------ |
| Request Headers    | Authorization Bearer Token                 |
| Parameters         | User_id: uuid                              |
| Responses          |                                            |
| 204 - No Content   |                                            |
| 401 - Unauthorized | Only Authenticated users can delete Users. |
| 403 - Forbidden    | Only Admin users can list Users.           |
| 404 - Not Found    | User is not in the Database                |

#### Edit User

| PATCH              | http://yourroute/users/:user_id                                           |
| :----------------- | ------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                |
| Parameters         | User_id: uuid                                                             |
| Body               | `{ name?: string, email?: string, password?: string }`                    |
| Responses          |                                                                           |
| 202 - Accepted     | Data: User<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 400 - Bad Request  | One of your fields is wrong. Please check your user fields.               |
| 401 - Unauthorized | Only Authenticated users can create Users.                                |
| 403 - Forbidden    | Only Admin users can list Users.                                          |
| 404 - Not Found    | User is not in the Database                                               |
