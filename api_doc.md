# E-Commerce - CMS

Membuat Content Management System Server untuk e-commerce

&nbsp;

### RESTful endpoints list

- `POST /register`
- `POST /login`

- `GET /products`
- `POST /products`
- `GET /products/:id`
- `PUT /products/:id`
- `DELETE /products/:id`

&nbsp;

## RESTful endpoint

### POST /register

> Register New User

_Request Header_

```
No needed
```

_Request Body_

```
{
    "email": "<email User>",
    "password": "<password User>"
}
```

_Response (201 - Created)_

```
{
    "id": "<user.id registed>",
    "email": "<user.email registed>"
    "role": "<user.role registed>",
}
```

_Response (400 - Bad Request)_

```
{
    "message": "<err name> already exists!"
}
```

_Response (500 - Internal server error)_

```
{
     "message": "Internal server error"
}
```

---

### POST /login

> Login User

_Request Header_

```
No needed
```

_Request Body_

```
{
    "email": "<email User>",
    "password": "<password User>"
}
```

_Response (200 - Ok)_

```
{
    "id": "<id login>",
    "email": "<email login>"
    "role": "<role login>",
    "access_token": "<access_token login>"
}
```

_Response (400 - Bad Request)_

```
{
    message: "Invalid Email or Password"
}
```

_Response (500 - Internal server error)_

```
{
     "message": "Internal server error"
}
```

---

### GET /products

> Get all Products

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
Not needed
```

_Response (200 - Ok)_

```
[
  {
    "id": 1,
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
    "createdAt": "2021-04-13T05:50:04.489Z",
    "updatedAt": "2021-04-13T05:50:04.489Z"
  },
  {
    "id": 2,
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
    "createdAt": "2021-04-13T05:50:04.489Z",
    "updatedAt": "2021-04-13T05:50:04.489Z"
  }
]
```

_Response (500 - Internal server error)_

```
{
  "message": "Internal server error"
}
```

---

### POST /products

> Post new product / Input a new product

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
}
```

_Response (201 - Created)_

```

{
    "id": 1,
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
    "createdAt": "2021-04-13T05:50:04.489Z",
    "updatedAt": "2021-04-13T05:50:04.489Z"
},

```

_Response (400 - Bad Request)_

```
{
    "message": "<err.name> is required!"
}

```

_Response (500 - Internal server error)_

```
{
  "message": "Internal server error"
}
```

---

### GET /products/:id/

> Get selected product by ProductId

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
No needed
```

_Request Params_

```
id = <id product>
```

_Response (200 - Ok)_

```
{
    "id": 1,
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
    "createdAt": "2021-04-13T05:50:04.489Z",
    "updatedAt": "2021-04-13T05:50:04.489Z"
},
```

_Response (404 - Not Found)_

```
{
  "message": "Product Not Found"
}
```

_Response (500 - Internal server error)_

```
{
  "message": "Internal server error"
}
```

---

### PUT /products/:id/

> Update selected Product

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
}
```

_Request Params_

```
id = <id product>
```

_Response (200 - Ok)_

```
{
    "id": 1,
    "name": "<product name>",
    "image_url": "<product image url>",
    "price": "<product price>",
    "stock": "<product stock>",
    "createdAt": "2021-04-13T05:50:04.489Z",
    "updatedAt": "2021-04-13T05:50:04.489Z"
}
```

_Response (401 - Unauthorize)_

```
{
  "message": "Unauthorized Access"
}
```

_Response (404 - Not Found)_

```
{
  "message": "Product Not Found"
}
```

_Response (500 - Internal server error)_

```
{
  "message": "Internal server error"
}
```

---

### DELETE /products/:id/

> Delete selected Task

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
No needed
```

_Request Params_

```
id = <id product>
```

_Response (200 - Ok)_

```
{
    "message": "Product success to delete"
}
```

_Response (401 - Unauthorize)_

```
{
  "message": "Unauthorized Access"
}
```

_Response (404 - Not Found)_

```
{
  "message": "Product Not Found"
}
```

_Response (500 - Internal server error)_

```
{
  "message": "Internal server error"
}
```

---
