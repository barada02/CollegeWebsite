# Client Setup
## Navigate to the client directory
mkdir client
cd client

## Initialize a new Next.js app with TypeScript
npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"

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