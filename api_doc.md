# E-Commerce - CMS

Membuat Content Management System Server untuk e-commerce

&nbsp;

### RESTful endpoints list

- `POST /register`
- `POST /login`

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
