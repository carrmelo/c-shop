# C-SHOP

Simple REST API (KOA && TypeScript && PosgreSQL) to admin customers and users.

To install all dependencies clone the repository and run `npm i` or `yarn install`

To install PostgreSQL via HomeBrew you can follow [these instrucions](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3). Run the CLI with the `psql` command, and `CREATE DATABASE cshop`, and you should be ready to go.

## Routes:

### Authentication:

#### SignUp

| POST               | http://this.is.your.route/sign/up                                     |
| :----------------- | --------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                            |
| Body               | `{ name: string, email: string, password: string, isAdmin: boolean }` |
| Responses          |                                                                       |
| 200 - Created      | Data: User `{id, name, email, isAdmin}`                               |
| 401 - Unauthorized | Only Authenticated users can create users.                            |
| 403 - Forbidden    | Only admin users can create new users.                                |

#### SignIn

| POST            | http://this.is.your.route/sign/in                   |
| :-------------- | --------------------------------------------------- |
| Body            | `{ email: string, password: string }`               |
| Responses       |                                                     |
| 200 - OK        | Data: User `{id, name, email, isAdmin}`             |
| 404 - Not Found | User email is not in the Database                   |
| 404 - Not Found | Password did not match with the one in the Database |

### Customers:

####List All Customers

| GET                | http://this.is.your.route/customers                                                |
| :----------------- | ---------------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                         |
| Parameters         | Customer_id: uuid                                                                  |
| Responses          |                                                                                    |
| 200 - Ok           | Data: Customers [ ]<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can list customers.                                       |

#### List One Customers

| GET                | http://this.is.your.route/customers/:customer_id                               |
| :----------------- | ------------------------------------------------------------------------------ |
| Request Headers    | Authorization Bearer Token                                                     |
| Parameters         | Customer_id: uuid                                                              |
| Responses          |                                                                                |
| 200 - Ok           | Data: Customer<br />`{ id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can list customers.                                   |
| 404 - Not Found    | Customer is not in the Database                                                |

#### Create Customer

| POST               | http://this.is.your.route/customers                                           |
| :----------------- | ----------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                    |
| Body               | `{ name: string, surname: string, pictureUrl: string }`                       |
| Responses          |                                                                               |
| 201 - Created      | Data: Customer<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can create customers.                                |

#### Delete Customer

| DELETE             | http://this.is.your.route/customers/:customer_id |
| :----------------- | ------------------------------------------------ |
| Request Headers    | Authorization Bearer Token                       |
| Parameters         | Customer_id: uuid                                |
| Responses          |                                                  |
| 204 - No Content   |                                                  |
| 401 - Unauthorized | Only Authenticated users can delete customers.   |
| 404 - Not Found    | Customer is not in the Database                  |

#### Edit Customer

| PATCH              | http://this.is.your.route/customers/:customer_id                              |
| :----------------- | ----------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                    |
| Parameters         | Customer_id: uuid                                                             |
| Body               | `{ name?: string, surname?: string, pictureUrl?: string }`                    |
| Responses          |                                                                               |
| 202 - Accepted     | Data: Customer<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can create customers.                                |
| 404 - Not Found    | Customer is not in the Database                                               |

### Users:

####List All Users

| GET                | http://this.is.your.route/Users            |
| :----------------- | ------------------------------------------ |
| Request Headers    | Authorization Bearer Token                 |
| Parameters         | User_id: uuid                              |
| Responses          |                                            |
| 200 - Ok           | Data: Users [ ]<br />`{ id, name, email }` |
| 401 - Unauthorized | Only Authenticated users can list Users.   |
| 403 - Forbidden    | Only Admin users can list Users.           |

#### List One Users

| GET                | http://this.is.your.route/Users/:User_id |
| :----------------- | ---------------------------------------- |
| Request Headers    | Authorization Bearer Token               |
| Parameters         | User_id: uuid                            |
| Responses          |                                          |
| 200 - Ok           | Data: User<br />`{ id, name, email }`    |
| 401 - Unauthorized | Only Authenticated users can list Users. |
| 403 - Forbidden    | Only Admin users can list Users.         |
| 404 - Not Found    | User is not in the Database              |

#### Create User

| POST               | http://this.is.your.route/Users                         |
| :----------------- | ------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                              |
| Body               | `{ name: string, surname: string, pictureUrl: string }` |
| Responses          |                                                         |
| 201 - Created      | Data: User<br />`{id, name, email }`                    |
| 403 - Forbidden    | Only Admin users can list Users.                        |
| 401 - Unauthorized | Only Authenticated users can create Users.              |

#### Delete User

| DELETE             | http://this.is.your.route/Users/:User_id   |
| :----------------- | ------------------------------------------ |
| Request Headers    | Authorization Bearer Token                 |
| Parameters         | User_id: uuid                              |
| Responses          |                                            |
| 204 - No Content   |                                            |
| 401 - Unauthorized | Only Authenticated users can delete Users. |
| 403 - Forbidden    | Only Admin users can list Users.           |
| 404 - Not Found    | User is not in the Database                |

#### Edit User

| PATCH              | http://this.is.your.route/Users/:User_id                                  |
| :----------------- | ------------------------------------------------------------------------- |
| Request Headers    | Authorization Bearer Token                                                |
| Parameters         | User_id: uuid                                                             |
| Body               | `{ name?: string, email?: string, password?: string }`                    |
| Responses          |                                                                           |
| 202 - Accepted     | Data: User<br />`{id, name, surname, pictureUrl, createdBy, modifiedBy }` |
| 401 - Unauthorized | Only Authenticated users can create Users.                                |
| 403 - Forbidden    | Only Admin users can list Users.                                          |
| 404 - Not Found    | User is not in the Database                                               |
