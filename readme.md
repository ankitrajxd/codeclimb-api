# CodeClimb API

Welcome to the CodeClimb API! This API allows users to explore coding challenges and track their progress as they solve them. Below is a guide on how to use the API.

## Key Features

- **Challenge Library**: Access a curated collection of coding challenges spanning various difficulty levels and topics.

- **Personalized Progress**: Track your solved challenges

## Getting Started

To use the CodeClimb API, you need to have Node.js and MongoDB installed on your machine.

1. Clone this repository:

```
git clone https://github.com/ankitrajxd/codeclimb-api.git
```

2. Install dependencies:

```
cd codeclimb-api
npm install
```

3. Set up environment variables:

Create a .env file in the root directory and add the following:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GMAIL_ADDRESS=your_email_address
GOOGLE_APP_PASSWORD=passwrod_here
```

4. Start the server:

```
npm start
```

## Routes

### User Routes

Register a User

- Endpoint: POST /api/users/register
- Description: Register a new user.
- Request Body:
  - name: User's name (string, required)
  - email: User's email (string, required)
  - password: User's password (string, required, min length: 8)
    _optionally you can pass `role: "admin"` property if you want to create an 'admin' user._
- Response:
  - user: Registered user object (excluding password)

Update a User (solvedChallenges)

- Endpoint: POST /api/users/:id
- Description: Update solvedChallenges property.
- Request Body:
  - solvedChallenges: Array of Challenge id
    \_optionally you can pass `role: "admin"` property if you want to create an 'admin' user
- Response:
  - user: Updated user object (excluding password)

---

| Method | Endpoint            | Description                             | Request Body                                                                      | Response                       |
| ------ | ------------------- | --------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------ |
| POST   | /api/users/register | Register a new user                     | { name, email, password, role (optional: "admin") }                               | { user: registeredUserObject } |
| POST   | /api/users/:id      | Update a user's solved challenges       | { solvedChallenges: [challengeId1, challengeId2, ...], role (optional: "admin") } | { user: updatedUserObject }    |
| GET    | /api/users/me       | Get the currently logged-in user's info |                                                                                   |

---

### Authentication

Login

- Endpoint: POST /api/auth
- Description: Login with existing user credentials.
- Request Body:
  - email: User's email (string, required)
  - password: User's password (string, required)
- Response:
  - token: JWT token for authenticated user(set in cookies)

Forget Password

- Endpoint: POST /api/users/forget-password
- Description: reset the password
- Request Body:
  - email: User's email (string, required)
- Response:
  A reset link will be sent to the registered email.

---

| Method | Endpoint                         | Description                     | Request Body        | Response                                |
| ------ | -------------------------------- | ------------------------------- | ------------------- | --------------------------------------- |
| POST   | /api/auth                        | Login with existing credentials | { email, password } | JWT token set in cookies                |
| POST   | /api/users/forget-password       | Initiate password reset         | { email }           | Reset link sent to the registered email |
| POST   | /api/users/reset-password/:token | Reset password                  | { password }        | Password reset successfully message     |

---

### Challenge Routes

Get All Challenges

- Endpoint: GET /api/challenges
- Description: Get all available challenges.
- Authorization: Required
- Response:
  - Array of challenge objects

Get details about a particular challenge

- Endpoint: GET /api/challenges:id
- Description: Get challenge by id.
- Response:
  - challenge object

Add a Challenge

- Endpoint: POST /api/challenges
- Description: Add a new challenge.
- Authorization: Required (admin only)
- Request Body:
  - title: Challenge title (string, required)
  - link: Challenge link (string, required)
  - image: Challenge image URL (string, optional)
- Response:
  - challenge: Added challenge object

Update a Challenge

- Endpoint: PUT /api/challenges/:id
- Description: Update an existing challenge.
- Authorization: Required (admin only)
- Request Parameters:
  - id: Challenge ID (string, required)
- Request Body:
  - title: Updated challenge title (string)
  - link: Updated challenge link (string)
  - image: Updated challenge image URL (string)
- Response:
  - challenge: Updated challenge object

Delete a Challenge

- Endpoint: DELETE /api/challenges/:id
- Description: Delete an existing challenge.
- Authorization: Required (admin only)
- Response:
  - Success message

---

| Method | Endpoint            | Description                    | Authorization (if required) | Request Body                      | Response                   |
| ------ | ------------------- | ------------------------------ | --------------------------- | --------------------------------- | -------------------------- |
| GET    | /api/challenges     | Get all challenges             | None                        | None                              | Array of challenge objects |
| GET    | /api/challenges/:id | Get a specific challenge by ID | None                        | None                              | Challenge object           |
| POST   | /api/challenges     | Add a new challenge            | Admin Only                  | { title, link, image (optional) } | Added challenge object     |
| PUT    | /api/challenges/:id | Update an existing challenge   | Admin Only                  | { title, link, image }            | Updated challenge object   |
| DELETE | /api/challenges/:id | Delete an existing challenge   | Admin Only                  | None                              | Success message            |

---

### Searching

Search a Challenge

- Endpoint: DELETE /api/challenges/search
- Description: Search Challenges using query.
- Authorization: Required (admin only)
- Request Parameters:
  - id: Challenge ID (string, required)
- Response:
  - List of Challenge Objects

### Filtering

Filter Challenges by difficulty

- Endpoint: GET /api/challenges
- Description: Filter available by difficulty.
- Query Parameters:
  - difficulty: `Hard` || `Easy` || `Medium` (string)
- Response:
  - Array of challenge objects

---

| Method | Endpoint               | Description                     | Authorization | Query/Body                                              | Response                            |
| ------ | ---------------------- | ------------------------------- | ------------- | ------------------------------------------------------- | ----------------------------------- |
| GET    | /api/challenges/search | Search for challenges by query  | None      | query (in query parameters)                             | Array of matching challenge objects |
| GET    | /api/challenges        | Filter challenges by difficulty | None          | difficulty=Easy or Medium or Hard (in query parameters) | Array of filtered challenge objects |

---

## Authentication

- Authentication for protected routes is done via JSON Web Tokens (JWT).

- Tokens are set in cookies.

- Tokens can be obtained by registering or logging in.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.
