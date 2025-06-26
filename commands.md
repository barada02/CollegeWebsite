# Client Setup
## React installation with Vite
```bash
npm create vite@latest client -- --template react-ts
```

## Navigate to the client directory
```bash
cd client
nmp install
```

# Install additional dependencies we'll need
npm install axios

# Server Setup
mkdir ../server
cd ../server

## Initialize a new Node.js project
npm init -y

## Install necessary dependencies
npm install express mongoose cors dotenv

## Install development dependencies
npm install -D typescript ts-node nodemon @types/express @types/node @types/cors

## Initialize TypeScript configuration
npx tsc --init