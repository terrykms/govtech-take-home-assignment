# GovTech Take-Home Assignment

This repository contains an [Express.js](https://expressjs.com/) application that provides a REST API for managing user salary data. 

Problem statement can be found [here](https://github.com/bryanlohxz/swe-take-home-assignment). 

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/terrykms/govtech-take-home-assignment.git
   cd govtech-take-home-assignment
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application
To start the Express.js server, run:
```sh
npm start
```
By default, the server runs on `http://localhost:3000/`.

### Testing the API
You can test the API using:
- [Postman](https://www.postman.com/)
- `curl` commands

### API Endpoints
#### `GET /api/users`

Returns users with valid salaries, supporting filtering, sorting, and pagination.

**Example request 1**
```sh
curl -X GET "http://localhost:3000/api/users"
```
**Expected response 1**
```json
{
    "results": [
        { "name": "Eve", "salary": 3200 },
        { "name": "Emma", "salary": 3500.4 },
        { "name": "Lucas", "salary": 2700.15 },
        { "name": "Olivia", "salary": 1500.6 }
    ],
}
```
**Example request 2**
```sh
curl -X GET "http://localhost:3000/api/users?min=4000&max=10000&sort=salary&limit=3&offset=3"
```
**Expected response 2**
```json
{
    "results": [
        { "name": "James", "salary": 7200.3 },
        { "name": "John", "salary": 8000.5 },
        { "name": "Minseo", "salary": 9000.1 }
    ],
}
```

#### `POST /api/upload`

Uploads a CSV data to update/add user data. Improperly structured files are rejected.
- Content Type: `application/x-www-form-urlencoded`
- Form field name: `file`

**Example CSV data**
```
Name,Salary
Terry,2500.05
Jane,3000.00
```
**Example request**
```sh
curl -X POST http://localhost:3000/api/upload -H "Content-Type: application/x-www-form-urlencoded"  --data-urlencode "file=Name%2CSalary%0ATerry%2C2500.05%0AJane%2C3000.00"
```
**Expected response**
```json
{ 
    "success": 1, 
    "message": "Successfully uploaded csv data into database."
}
```
## Architecture
- database: [SQLite](https://www.sqlite.org/)
- tests: [jest](https://jestjs.io/) + [supertest](https://www.npmjs.com/package/supertest)

I have chosen SQLite as the database due to its lightweight implementation for small projects (not required to have a separate server). 

I utilised the [`sqlite3`](https://www.npmjs.com/package/sqlite3) package for SQLite binding for node.js applications. 

Furthermore, I used `promisify` in [`util`](https://www.npmjs.com/package/util) package to convert some of the methods (which originally uses callbacks) into promise-based functions, for better readability through the use of `async/await` and refraining from using callbacks. 



### Project Structure

The structure is designed to separate different functionalities within the app, ensuring that each folder focuses on a specific aspect of the logic, with files organised according to their purpose.
```
/my-express-app
│── /config
│   ├── db.js
│── /controllers
│   ├── upload.controllers.js
│   ├── users.controllers.js
│── /database
│   ├── init.js
│   ├── database.sqlite
│── /routes
│   ├── upload.routes.js
│   ├── users.routes.js
│── /tests
│   ├── uploads.test.js
│   ├── users.test.js
│── app.js
│── server.js
│── node_modules/
│── .gitignore
│── package.json
```

- **/config** - configuration files (i.e. database connection)
- **/controllers** - functions for handling requests
- **/database** - functions for injecting seed data 
- **/routes** - definitions for API endpoints
- **/tests** - test cases

## Interpretations

### Usage of `BEGIN TRANSACTION`, `COMMIT/ROLLOVER`

The problem requires invalid CSV data to be rejected as a whole, even when there are valid rows.

Using `BEGIN TRANSACTION` to start the upload and using `ROLLOVER` would ensure that once the code encounters an invalid entry, none of the data will be stored in the database. 

The code will only `COMMIT` once each row has been checked for validity.

### `application/x-www-form-urlencoded`

The required Content Type for POST /api/upload is `application/x-www-form-urlencoded`, meaning we are unable to upload a .csv file directly for processing. 

Instead, we have to convert the .csv data into a string and convert to URI-encoded format to be transmitted. 

While this may be suitable for small datasets, it becomes unfavourable when we have potentially millions of entries to be processed. 

Therefore, an improvement I can make would be to use `multipart/form-data` to accept file uploads to the server.

## Assumptions

- For simplicity, primary key in the database is set as type `INT` with `AUTO INCREMENT`. 
- All backend API endpoints will start with `/api` to differentiate itself from frontend.
- Since this is only a back-end project, I have assumed that the client-side would have converted the .csv data into URI-encoded format. 
- While `initializeDb()` under `/database/init.js` is unfavourable for real use case, I have implemented it so that there will always be seed data whenever the server starts. 

## Further Improvements
- If the application gets bigger, it will be good practice to use middlewares to centralise error handling. Middlewares will also come in handy if we also incorporate authentication where we only allow authenticated users to access our backend API.