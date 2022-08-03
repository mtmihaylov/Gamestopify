![](https://res.cloudinary.com/best-cloud/image/upload/v1659526249/logo_vvdkea.png)

:point_right:[Link To Heroku Host](https://gamestopify.herokuapp.com/):point_left:

### :handbag: Complete E-Commerce app built with Node.js, React, Redux, Express, MongoDB

## Features

<b>Products Features</b>

| Feature          |   Done   | Description                                        |
| ---------------- | :------: | :------------------------------------------------- |
| Add a Product    | &#10004; | Add a Product to the database                      |
| Edit a Product   | &#10004; | Edit a Products details                            |
| Delete a Product | &#10004; | Delete a Product from the database                 |
| List Products    | &#10004; | List all Products                                  |
| Update Stock     | &#10004; | Update the stock after an order has been processed |

<b>Search Features</b>

| Feature              |   Done   | Description                                    |
| -------------------- | :------: | :--------------------------------------------- |
| Search for a Product | &#10004; | Search for a product by a number of properties |

<b>Cart Features</b>

| Feature     |   Done   | Description                  |
| ----------- | :------: | :--------------------------- |
| See Cart    | &#10004; | See the items in the Cart    |
| Add Item    | &#10004; | Add a new item to the Cart   |
| Remove Item | &#10004; | Remove an item from the Cart |

<b>Purchase Features</b>

| Feature  |   Done   | Description         |
| -------- | :------: | :------------------ |
| Checkout | &#10004; | Ability to Checkout |

<b>Order Features</b>

| Feature          |   Done   | Description                                 |
| ---------------- | :------: | :------------------------------------------ |
| Create an Order  | &#10004; | Create an order after a successful purchase |
| Process an Order | &#10004; | View Order Details/Change Order status      |
| Delete an Order  | &#10004; | Delete an Order                             |
| List Orders      | &#10004; | List Orders                                 |

<b>Admin Features</b>
| Feature | Done | Description |
|----------|:-------------:|:-------------|
| Dashboard | &#10004; | View all products, orders and users and edit/update them |

## Installation

- **Install Dependencies (Backend)**

```
npm i
```

- **Install Dependencies (Frontend)**

```
cd frontend/
npm i
```

- **Add a config.env file to backend/config with the below template and populate it with your information**

```
PORT =
NODE_ENV =

FRONTEND_URL =

DB_LOCAL_URI =
DB_CLOUD_URI =

JWT_SECRET =
JWT_EXPIRE_TIME =

COOKIE_EXPIRE_TIME =

CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =

STRIPE_SECRET_KEY =
STRIPE_PUBLISHABLE_KEY =

SMTP_HOST = smtp.mailtrap.io
SMTP_PORT = 2525
SMTP_EMAIL =
SMTP_PASSWORD =
SMTP_EMAIL_FROM =
SMTP_NAME_FROM =
```

- **Seed Database**
  Put some dummy products in that database. Run it in the root folder.

```
npm run seeder
```

## Run app

- **Run Backend in production mode**

```
npm run prod
```

- **Run Frontend**

```
cd frontend/
npm start
```

- **Open localhost in your browser and Enjoy :)**
