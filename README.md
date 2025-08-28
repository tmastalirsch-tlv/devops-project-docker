# 🦕 Jurassic World API

![Jurassic World](https://img.shields.io/badge/Jurassic-World-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-v9+-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v4+-blue.svg)

A comprehensive REST API for managing Jurassic World park operations, built with NestJS and TypeScript. This API provides complete functionality for dinosaur management, visitor services, staff coordination, enclosure monitoring, and incident response.

## 🌟 Features

- **🦖 Dinosaur Management** - Track and manage all dinosaur assets
- **🏞️ Park Operations** - Monitor enclosures and facilities
- **👥 Visitor Services** - Handle guest registration, check-ins, and tours
- **👨‍💼 Staff Management** - Coordinate rangers, veterinarians, and support staff
- **🚨 Incident Response** - Emergency management and reporting system
- **📊 Analytics & Reporting** - Comprehensive statistics and insights

## 📋 Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Docker Setup](#docker-setup)
- [Testing](#testing)
- [Repository Dispatch](#repository-dispatch)
- [Contributing](#contributing)

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

## ▶️ Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 🔌 API Endpoints

### Core System

- `GET /` - Welcome message and API overview
- `GET /health` - System health check

### 🦖 Dinosaurs (`/dinosaurs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dinosaurs` | List all dinosaurs (with filtering) |
| `POST` | `/dinosaurs` | Create new dinosaur |
| `GET` | `/dinosaurs/:id` | Get specific dinosaur |
| `PATCH` | `/dinosaurs/:id` | Update dinosaur |
| `DELETE` | `/dinosaurs/:id` | Remove dinosaur |
| `POST` | `/dinosaurs/:id/feed` | Feed a dinosaur |
| `GET` | `/dinosaurs/statistics/species` | Species distribution |
| `GET` | `/dinosaurs/dangerous` | High-risk dinosaurs |

**Query Parameters:**
- `diet`: Filter by diet (herbivore, carnivore, omnivore)
- `dangerLevel`: Filter by danger level (1-5)
- `enclosureId`: Filter by enclosure
- `isActive`: Filter by active status

### 🏞️ Park Enclosures (`/parks/enclosures`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/parks/enclosures` | List all enclosures |
| `POST` | `/parks/enclosures` | Create new enclosure |
| `GET` | `/parks/enclosures/:id` | Get specific enclosure |
| `PATCH` | `/parks/enclosures/:id` | Update enclosure |
| `DELETE` | `/parks/enclosures/:id` | Remove enclosure |
| `POST` | `/parks/enclosures/:id/inspect` | Perform inspection |
| `GET` | `/parks/enclosures/reports/capacity` | Capacity utilization |
| `GET` | `/parks/enclosures/reports/security` | Security report |

### 👥 Visitors (`/visitors`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/visitors` | List all visitors |
| `POST` | `/visitors` | Register new visitor |
| `GET` | `/visitors/:id` | Get visitor details |
| `PATCH` | `/visitors/:id` | Update visitor |
| `DELETE` | `/visitors/:id` | Remove visitor |
| `POST` | `/visitors/:id/checkin` | Check in visitor |
| `POST` | `/visitors/:id/checkout` | Check out visitor |
| `POST` | `/visitors/:id/waivers` | Sign waivers |
| `PATCH` | `/visitors/:id/location` | Update location |
| `POST` | `/visitors/emergency/evacuate` | Emergency evacuation |
| `GET` | `/visitors/statistics` | Visitor statistics |

### 👨‍💼 Staff (`/staff`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/staff` | List all staff |
| `POST` | `/staff` | Add new staff member |
| `GET` | `/staff/:id` | Get staff details |
| `PATCH` | `/staff/:id` | Update staff |
| `DELETE` | `/staff/:id` | Remove staff |
| `POST` | `/staff/:id/checkin` | Staff check-in |
| `POST` | `/staff/:id/checkout` | Staff check-out |
| `PATCH` | `/staff/:id/assign` | Assign task |
| `POST` | `/staff/:id/training` | Add training record |
| `POST` | `/staff/emergency/response` | Activate emergency team |
| `GET` | `/staff/statistics` | Staff statistics |
| `GET` | `/staff/certifications/expiring` | Expiring certifications |

### 🚨 Incidents (`/incidents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/incidents` | List all incidents |
| `POST` | `/incidents` | Report new incident |
| `GET` | `/incidents/:id` | Get incident details |
| `PATCH` | `/incidents/:id` | Update incident |
| `DELETE` | `/incidents/:id` | Remove incident |
| `PATCH` | `/incidents/:id/status` | Update status |
| `POST` | `/incidents/:id/response-team` | Assign response team |
| `POST` | `/incidents/:id/timeline` | Add timeline entry |
| `GET` | `/incidents/statistics` | Incident analytics |
| `GET` | `/incidents/critical` | Critical incidents |

## 📊 Data Models

### Dinosaur
```typescript
{
  id: string;
  name: string;
  species: string;
  diet: 'herbivore' | 'carnivore' | 'omnivore';
  period: 'triassic' | 'jurassic' | 'cretaceous';
  height: number; // meters
  weight: number; // kg
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  enclosureId?: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  mood: 'calm' | 'agitated' | 'aggressive' | 'sleeping' | 'playful';
}
```

### Enclosure
```typescript
{
  id: string;
  name: string;
  type: 'herbivore' | 'carnivore' | 'aquatic' | 'aviary' | 'mixed';
  maxCapacity: number;
  currentOccupancy: number;
  securityLevel: 1 | 2 | 3 | 4 | 5;
  area: number; // square meters
  fenceType: 'electric' | 'concrete' | 'steel' | 'water' | 'glass';
  maintenanceStatus: 'excellent' | 'good' | 'needs_attention' | 'critical';
}
```

### Visitor
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketType: 'standard' | 'vip' | 'researcher' | 'staff_family';
  visitStatus: 'scheduled' | 'checked_in' | 'on_tour' | 'checked_out';
  accessLevel: 'basic' | 'restricted' | 'behind_scenes' | 'research';
  currentLocation?: string;
}
```

## 🐳 Docker Setup

```bash
# Build the Docker image
docker build -t jurassic-world-api .

# Run the container
docker run -p 3000:3000 jurassic-world-api
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
NODE_ENV=development
API_VERSION=1.0.0
```

## 📈 Performance Features

- **Efficient Filtering**: All endpoints support query-based filtering
- **In-Memory Storage**: Fast data access for development/demo purposes
- **RESTful Design**: Standard HTTP methods and status codes
- **Type Safety**: Full TypeScript implementation
- **Validation**: Built-in request validation with DTOs

## 🛡️ Security Features

- **Access Control**: Role-based permissions for different user types
- **Emergency Protocols**: Automated emergency response systems
- **Incident Tracking**: Comprehensive incident logging and response
- **Staff Management**: Clearance levels and certification tracking

## 🚀 Sample Requests

### Create a Dinosaur
```bash
curl -X POST http://localhost:3000/dinosaurs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charlie",
    "species": "Velociraptor",
    "diet": "carnivore",
    "period": "cretaceous",
    "height": 1.8,
    "weight": 20,
    "dangerLevel": 5,
    "isActive": true
  }'
```

### Get All Dinosaurs
```bash
curl http://localhost:3000/dinosaurs
```

### Emergency Evacuation
```bash
curl -X POST http://localhost:3000/visitors/emergency/evacuate
```

## 📚 Documentation

For detailed API documentation, visit the root endpoint (`/`) after starting the server.

## 🔄 Repository Dispatch

Dieses Projekt unterstützt **Repository Dispatch** für erweiterte CI/CD-Workflows und Cross-Repository-Orchestration.

### 🎯 Was ist Repository Dispatch?

Repository Dispatch ermöglicht es, GitHub Actions Workflows über externe Events zu triggern. Es ist wie ein "Remote-Trigger" für deine Workflows.

### 🚀 Verfügbare Events

- **`deploy-staging`** - Deployment zur Staging-Umgebung
- **`deploy-production`** - Deployment zur Production-Umgebung  
- **`run-tests`** - Ausführung von Test-Suites
- **`sync-dependencies`** - Dependency-Synchronisation
- **`custom-build`** - Benutzerdefinierte Build-Prozesse

### 🛠️ Verwendung

#### Mit dem Helper Script:
```bash
# Einfaches Staging Deployment
./scripts/dispatch-helper.sh -r owner/target-repo -e deploy-staging

# Mit custom Payload
./scripts/dispatch-helper.sh -r owner/target-repo -e run-tests -p examples/payloads/run-tests.json
```

#### Über GitHub Actions UI:
1. Gehe zu Actions → "Repository Dispatch Sender"  
2. Wähle Event Type und Parameter
3. Führe den Workflow aus

#### Über GitHub API:
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type": "deploy-staging", "client_payload": {...}}'
```

### 📚 Weiterführende Dokumentation

- 📖 **[Vollständige Dokumentation](docs/REPOSITORY_DISPATCH.md)** - Detaillierte Anleitung und Konfiguration
- 📋 **[Beispiele](examples/README.md)** - Praktische Anwendungsfälle und Payload-Beispiele
- 🔧 **[Helper Script](scripts/dispatch-helper.sh)** - Kommandozeilen-Tool für einfache Verwendung

### 🔑 Setup

1. **Für gleiches Repository**: Verwende `GITHUB_TOKEN` (automatisch verfügbar)
2. **Für andere Repositories**: Erstelle Personal Access Token mit `repo` scope als `DISPATCH_TOKEN` Secret

**Perfekt für:**
- ✅ Multi-Repository Deployments
- ✅ Cross-Service Integration  
- ✅ Event-driven CI/CD
- ✅ Emergency Deployments
- ✅ Dependency Orchestration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**⚠️ Disclaimer**: This is a fictional API for entertainment and educational purposes. Any resemblance to actual dinosaur management systems is purely coincidental. Please do not attempt to manage real dinosaurs with this API. 🦕
