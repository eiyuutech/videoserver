# videoserver
Node Js API for Video Solution.

## Description
This is an Restful API for Node.js and Mysql. This is in the MVC format,
except because it is an API there are no views, just models and controllers.

##### Routing         : Express
##### ORM Database    : Sequelize
##### Authentication  : Passport, JWT

## Installation

#### Donwload Code | Clone the Repo

```
git clone https://github.com/eiyuutech/videoserver.git
```

#### Install Node Modules
```
npm i
```

#### API PATH
```
http://localhost:3000/v1/xxx
```

#### MIGRATIONS

##### create database
```
sequelize db:create
```

##### create migration file
```
sequelize migration:create --name=CreateNewTable
```

##### excute migration
```
-- local
npm run migrate:local

-- staging
npm run migrate:stg

-- production
npm run migrate:production
```
##### generate schema
```
sequelize-auto -o "models" -d eas_video_solution -h localhost -u root -p 3306  -e mysql -t xxx
```

#### Create .env File
You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory.
Fill in the variables to fit your application

