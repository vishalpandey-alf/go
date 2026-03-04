# Backend API Documentation

## User Endpoints

### 1. User Registration
**POST** `/api/users/register`

**Request:**
```json
{
  "fullname": { "firstname": "string (min 3)", "lastname": "string" },
  "email": "string (unique, valid format)",
  "password": "string (min 6)"
}
```

**Responses:**
- `201`: `{ "token": "JWT", "user": {...} }` - User created
- `400`: Validation error or duplicate email
- `500`: Server error

**Security:** JWT expires after 1 hour. Passwords hashed with bcrypt (10 salt rounds).

---

### 2. Login User
**POST** `/api/users/login`

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
- `200`: `{ "token": "JWT", "user": {...} }` - Login successful
- `401`: Invalid credentials
- `400`: Validation error
- `500`: Server error

**Cookie:** Token stored in `token` cookie

---

### 3. Get User Profile
**GET** `/api/users/profile` *(Protected)*

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- `200`: `{ "user": {...} }`
- `401`: Missing/invalid token
- `500`: Server error

---

### 4. Logout User
**GET** `/api/users/logout` *(Protected)*

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- `200`: `{ "message": "Logged out successfully" }` - Token blacklisted
- `401`: Missing/invalid token
- `500`: Server error

**Action:** Token added to blacklist, cookie cleared

---

## Captain Endpoints

### 5. Register Captain
**POST** `/api/captains/register`

**Request Body:**
```json
{
  "fullname": {
    "firstname": "Jane",           // Required: String, minimum 3 characters
    "lastname": "Smith"            // Required: String, minimum 3 characters
  },
  "email": "jane@example.com",     // Required: Valid email format, must be unique per captain type
  "password": "password123",       // Required: String, minimum 6 characters, will be hashed with bcrypt
  "vehicle": {
    "color": "Black",              // Required: String, minimum 3 characters
    "plate": "ABC123",             // Required: String, minimum 3 characters
    "capacity": 4,                 // Required: Integer, minimum 1 passenger capacity
    "vehicleType": "car"           // Required: Enum - must be one of: "car", "motorcycle", "auto"
  }
}
```

**Success Response - 201 Created:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token valid for 24 hours
  "captain": {
    "_id": "507f1f77bcf86cd799439011",                    // Unique MongoDB ObjectId
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "status": "inactive",                                 // Default status for newly registered captains
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {                                       // Location initially null until captain is active
        "lat": null,
        "lng": null
      }
    },
    "socketId": null                                      // Socket.io ID (null until connected)
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed:
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

- `400 Bad Request` - Duplicate email:
```json
{
  "message": "Captain with this email already exists"
}
```

- `500 Server Error`:
```json
{
  "message": "Internal server error"
}
```

**Security Details:**
- Password is hashed using bcrypt with 10 salt rounds before storage
- Password is never returned in responses
- JWT token expires after 24 hours
- Email must be unique; duplicate registration attempts are rejected

---

### 6. Login Captain
**POST** `/api/captains/login`

**Request Body:**
```json
{
  "email": "jane@example.com",     // Required: Valid email format matching registered account
  "password": "password123"         // Required: Must match the registered password
}
```

**Success Response - 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token valid for 24 hours
  "captain": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {
        "lat": null,
        "lng": null
      }
    },
    "socketId": null
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials:
```json
{
  "message": "Invalid email or password"
}
```

- `400 Bad Request` - Validation failed:
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Cookie:** Token is stored in `token` cookie for client-side session management

---

### 7. Get Captain Profile
**GET** `/api/captains/profile` *(Protected)*

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response - 200 OK:**
```json
{
  "captain": {
    "_id": "507f1f77bcf86cd799439011",                    // Unique captain identifier
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "status": "inactive",                                 // Status: "active" or "inactive"
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {                                       // Current location (null if inactive)
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "socketId": "socket_123456789"                        // Current Socket.io connection ID
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing token:
```json
{
  "message": "Access Denied. No token provided."
}
```

- `401 Unauthorized` - Invalid/expired token:
```json
{
  "message": "Invalid or expired token."
}
```

- `401 Unauthorized` - Captain not found:
```json
{
  "message": "User not found."
}
```

**Requirements:**
- Valid JWT token must be provided in Authorization header
- Token must not be blacklisted (from logout)
- Token must not be expired (24-hour window)

---

### 8. Logout Captain
**GET** `/api/captains/logout` *(Protected)*

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response - 200 OK:**
```json
{
  "message": "Logged out successfully"  // Token added to blacklist, session terminated
}
```

**Error Responses:**
- `401 Unauthorized` - Missing token:
```json
{
  "message": "Access Denied. No token provided."
}
```

- `401 Unauthorized` - Invalid/expired token:
```json
{
  "message": "Invalid or expired token."
}
```

**Actions Performed:**
- Token is added to blacklist (cannot be reused)
- `token` cookie is cleared from client
- All subsequent requests with this token will be denied

**Requirements:**
- Valid JWT token must be provided in Authorization header
- Token must be in "authorized" state (not already blacklisted)

---

## Field Validation Rules

| Field | Type | Min/Max | Special Rules |
|-------|------|---------|---------------|
| firstname | String | 3 chars | Required for users & captains |
| lastname | String | 3 chars | Optional for users; Required for captains |
| email | String | - | Valid format, unique per type |
| password | String | 6 chars | Hashed before storage |
| vehicle.color | String | 3 chars | Captain only |
| vehicle.plate | String | 3 chars | Captain only |
| vehicle.capacity | Number | ≥ 1 | Captain only |
| vehicleType | Enum | - | car, motorcycle, auto |

---

## Example Requests

**Register User:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"pass123"}'
```

**Login User:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

**Register Captain:**
```bash
curl -X POST http://localhost:3000/api/captains/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Smith"},"email":"jane@example.com","password":"pass123","vehicle":{"color":"Black","plate":"ABC123","capacity":4,"vehicleType":"car"}}'
```

**Login Captain:**
```bash
curl -X POST http://localhost:3000/api/captains/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"pass123"}'
```

**Get Captain Profile (Protected):**
```bash
curl -X GET http://localhost:3000/api/captains/profile \
  -H "Authorization: Bearer <your-captain-token>"
```

**Logout Captain (Protected):**
```bash
curl -X GET http://localhost:3000/api/captains/logout \
  -H "Authorization: Bearer <your-captain-token>"
```

**Protected Request (Get User Profile):**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your-token>"
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| `200` | Success (existing resource) |
| `201` | Created (new resource) |
| `400` | Bad Request (validation/client error) |
| `401` | Unauthorized (missing/invalid token) |
| `500` | Internal Server Error |

---

## Security & Best Practices

- **Authentication:** All protected routes require valid JWT token in `Authorization: Bearer <token>` header
- **Password Security:** Hashed using bcrypt with 10 salt rounds; never returned in responses
- **Token Management:** 
  - Users: 1 hour expiration
  - Captains: 24 hours expiration
  - Logout: Token added to blacklist
- **Email:** Must be unique per user/captain type
- **HTTPS:** Use HTTPS in production for all API calls
- **Client Storage:** Store tokens securely; clear on logout
