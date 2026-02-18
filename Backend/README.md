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

**Request:**
```json
{
  "fullname": { "firstname": "string (min 3)", "lastname": "string (min 3)" },
  "email": "string (unique, valid format)",
  "password": "string (min 6)",
  "vehicle": {
    "color": "string (min 3)",
    "plate": "string (min 3)",
    "capacity": "number (min 1)",
    "vehicleType": "car | motorcycle | auto"
  }
}
```

**Responses:**
- `201`: `{ "token": "JWT", "captain": {...} }` - Captain created
- `400`: Validation error, duplicate email, or invalid vehicle type
- `500`: Server error

**Security:** JWT expires after 24 hours. Passwords hashed with bcrypt (10 salt rounds). Captain status starts as `inactive`.

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

**Protected Request (Get Profile):**
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
