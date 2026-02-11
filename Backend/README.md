# Backend API Documentation

## User Registration Endpoint

### Endpoint
```
POST /api/users/register
```

### Description
Registers a new user in the system. Accepts user registration details, validates the input, hashes the password, and returns an authentication token upon successful registration.

### Request

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

#### Field Requirements

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) |
| `email` | String | Yes | Valid email format, minimum 5 characters, must be unique |
| `password` | String | Yes | Minimum 6 characters |

### Response

#### Success Response (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketID": null
  }
}
```

#### Error Responses

##### 400 Bad Request
Validation error - one or more fields failed validation.
```json
{
  "errors": [
    {
      "msg": "FirstName must be atleast of 3 characters",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

**Common validation errors:**
- `"FirstName must be atleast of 3 characters"` - firstname is less than 3 characters
- `"Invalid email address"` - email format is invalid
- `"Password must be atleast of 6 characters"` - password is less than 6 characters

##### 500 Internal Server Error
Server error during user creation.
```json
{
  "message": "Internal Server Error"
}
```

**Possible causes:**
- Database connection error
- Duplicate email (email already exists in database)
- Unexpected server error

### Status Codes

| Code | Description |
|------|-------------|
| `201` | User successfully registered; authentication token generated |
| `400` | Validation error; required fields missing or invalid |
| `500` | Internal server error; user creation failed |

### Authentication
- Upon successful registration, a JWT token is generated with a 1-hour expiration
- Token is returned in the response and should be stored client-side for authenticated requests

### Example Usage

#### cURL
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### JavaScript/Fetch
```javascript
fetch('/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullname: {
      firstname: 'John',
      lastname: 'Doe'
    },
    email: 'john@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Security Notes
- Passwords are hashed using bcrypt with 10 salt rounds before storage
- The password field is not returned in the response
- JWT tokens expire after 1 hour
- Email must be unique across the system
