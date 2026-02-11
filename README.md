# Azure Microservices Cloud Hub

A production-ready architecture demonstrating .NET 8 microservices, React, Azure Cosmos DB, and Azure Service Bus.

## 🚀 Quick Start (Local)

### 1. Infrastructure Requirements
- **Azure Cosmos DB**: NoSQL API account.
- **Azure Service Bus**: Standard tier (required for Topics).
- **Service Bus Topic**: Ensure a topic named `order-events` exists.

### 2. Configure Secrets
Set the following environment variables on your machine (or in your IDE launch settings):
```bash
export Cosmos__ConnectionString="your-cosmos-string"
export ServiceBus__ConnectionString="your-sb-string"
export Jwt__Secret="your-32-character-secret-key-minimum"
```

### 3. Run the Backend Services
Open three separate terminal sessions and run:
- **Auth Service** (Port 5001):
  `dotnet run --project backend/AuthService.csproj`
- **Product Service** (Port 5002):
  `dotnet run --project backend/ProductService.csproj`
- **Order Service** (Port 5003):
  `dotnet run --project backend/OrderService.csproj`

### 4. Run the Frontend (React + TypeScript)
Standard browsers cannot execute `.tsx` files directly. You **cannot** use `npx serve .` because it serves files statically without transpilation, leading to "MIME type" errors.

To run the frontend correctly, use **Vite**:
```bash
# Install Vite globally or use npx
npm install -g create-vite
# Run with a tool that handles TSX on-the-fly (like Vite or esbuild)
npx vite
```
*Vite will automatically detect the `index.html` and transpile the `.tsx` files into valid JavaScript for the browser.*

## 🏗️ Architecture Design
- **Database-per-Service**: Auth, Product, and Order services have isolated Cosmos DB containers.
- **Event-Driven**: Order Service publishes to Service Bus via the `order-events` topic.
- **Clean Separation**: Frontend uses an Axios interceptor to automatically inject JWT tokens obtained from the Auth Service.
- **Resilient UI**: The frontend includes a `mockApi` fallback. if the backends are not reachable, the UI remains functional for demo purposes while displaying a "Simulation Mode" warning.

## 🔧 Troubleshooting MIME Types
If you see `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of ""`:
- This confirms your server is trying to send a `.tsx` file as-is. 
- **Solution**: Use `vite` or `parcel` instead of `serve`. These tools transpile the code and set the correct `application/javascript` MIME type.
