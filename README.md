# EpiBlog : API Server

This is the nodejs server of the EpiBlog project.  
It allows the client of the same project to interact with a mysql database, in order to :
- create, modify, delete a user account
- log a user in / out
- create, modify, delete posts and comments

### Built with

- [express](http://expressjs.com/) : a nodejs web framework
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) : an implementation of JSON Web Tokens
- [joi](https://github.com/hapijs/joi) : a javascript objects validator
- [mysql](https://github.com/mysqljs/mysql) : a nodejs driver for mysql
- [eslint](https://eslint.org/) : a javascript linter
- [mocha](https://github.com/mochajs/mocha) && [chai](http://www.chaijs.com/) : nodejs libraries for testing

### Tests

Run the command `npm run test` to launch the tests.  



### Usage

Every route returns a json response, with the following format :
```ecmascript 6
const response = {
    message: '[An adequate message depending on the requested route and the response code]',
    data: {}|[] // optional
}
```
Some routes can be accessed without being authenticated, every other routes need to provide a token in the headers.
This token can be retrieved via the `POST /authenticate` route (see below).  
For every route requiring a token in the headers, the error response codes and associated reasons are the same as
described in the `GET /me` route (see below).  
If an error occurred internally, the response code is `500` with a fallback message, but the server should continue
running.



#### `GET /`

- Code `200` (success)



#### `GET /me`  
Aim : to get the authenticated user's account information  
Header : `x-authenticated-token`
- Code `403` (unauthorized) :
    - the value of `x-authenticated-token` is invalid
    - user is not found in database
    - user has not logged in
    - user's account has been deleted
- Code `400` (bad request) :
    - `x-authenticated-token` is not provided in headers
- Code `200` (success)  
    response.data contains user's account information : `{id: [user's id], firstname: [user's firstname], ...}`



#### `POST /authenticate` 
Aim : to authenticate a user and get a json web token    
Post data : `username` and `password`
- Code `400` :
    - `username` is not provided
    - `password` is not provided
    - `username` not found in database
    - user's account has been deleted
    - `password` does not match the one in database
- Code `200`  
    response.data contains a json web token : `{token: [user's jwt]}`



#### `GET /logout`  
Aim : to log out the authenticated user  
Header : `x-authenticated-token`
- Code `200`



#### `POST /user`  
Aim : to create a new user
Post data : `username`, `firstname`, `lastname`, `email`, `password`, `passwordConfirmation` and `avatar`
- Code `400` :
    - `username` is not provided, does not only contain letters and numbers, or is not at least 4 and at most 30
    characters long
    - `firstname` is not provided
    - `lastname` is not provided
    - `email` is not provided, or is not email formatted
    - `password` is not provided, or is not containing at least 1 digit, 1 uppercase character, 1 lowercase
    character, 1 special character (space forbidden), and is not between 8 and 15 characters
    - `passwordConfirmation` is not provided, or is not the same as `password`
    - `username` already exists in database
    - `email` already exists in database
- Code `200`  
    response.data contains the id of the newly created user : `{id: [user's id]}`



#### `GET /user/[:id]`  
Aim : to get a user's account information  
Route parameter : `id` (the user id)  
Header : `x-authenticated-token`
- Code `403` :
    - the `id` is not the same compared to the token user's id and the token user is not administrator
- Code `400` :
    - the `id` was not found in the database
- Code `200` (success)  
    response.data contains user's account information : `{id: [user's id], firstname: [user's firstname], ...}`



#### `PATCH /user/[:id]`  
Aim : to update a user's account  
Route parameter : `id` (the user id)  
Header : `x-authenticated-token`
Post data : `field` and `value`
- Code `403` :
    - the `id` is not the same compared to the token user's id and the token user is not administrator
- Code `400` :
    - the `id` was not found in the database
    - `field` is not provided, or is a forbidden one (like `id`, `email`, `is_administrator`, `created_at` or
     `password`)
    - `value` is not provided



#### `DELETE /user/[:id]`  
Aim : to delete a user's account  
Route parameter : `id` (the user id)  
Header : `x-authenticated-token`
- Code `403` :
    - the `id` is not the same compared to the token user's id and the token user is not administrator
- Code `400` :
    - the `id` was not found in the database



#### `POST /post`  
Aim : to create a new post  
Header : `x-authenticated-token`
Post data : `title`, `description` and `content`
- Code `400` :
    - `title` is not provided, or is not at least 8 and at most 32 characters long
    - `descrition` (while optionnal) is not at least 8 and at most 128 characters long
    - `content` is not provided
- Code `200`  
    response.data contains the id of the newly created post : `{id: [post's id]}`



#### `GET /posts`
Aim : to get all existing posts  
- Code `200`  
    response.data contains an array of all post's data : `[{id: [post 1 id], ...}, {id: [post 2 id], ...}]`



#### `GET /post/[:id]`  
Aim : to get a post  
Route parameter : `id` (the post id)  
- Code `400` :
    - the `id` was not found in the database
- Code `200`
    response.data contains the post's information : `{id: [post's id], title: [postt's title], ...}`



#### `PATCH /post/[:id]`  
Aim : to update a post  
Route parameter : `id` (the user id)  
Header : `x-authenticated-token`
Post data : `field` and `value`
- Code `400` :
    - the `creator_id` is not the same compared to the token user's id and the token user is not administrator
    - the `id` was not found in the database
    - `field` is not provided, or is a forbidden one (like `id`, `creator_id` or `created_at`)
    - `value` is not provided



#### `DELETE /post/[:id]`  
Aim : to delete a post  
Route parameter : `id` (the post id)  
Header : `x-authenticated-token`
- Code `400` :
    - the `creator_id` is not the same compared to the token user's id and the token user is not administrator
    - the `id` was not found in the database





### Authors

Olivier Drouin ([olivier.drouin@epitech.eu](mailto:olivier.drouin@epitech.eu))

### License
MIT
