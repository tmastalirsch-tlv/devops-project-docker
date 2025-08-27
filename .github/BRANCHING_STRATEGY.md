# 🌳 Git Branching Strategy - Jurassic World API

## Branch Overview

Unser Projekt verwendet ein **Git Flow-ähnliches** Branching-Modell, optimiert für die Jurassic World API-Entwicklung.

## 🌿 Branch Types

### 🚀 **Main Branch**
- **Zweck**: Produktionsreife Releases
- **Schutz**: Vollständig geschützt
- **Merges**: Nur von `release/*` oder `hotfix/*` branches
- **CI/CD**: Vollständige Tests + automatisches Release
- **Docker**: Automatisches Building mit `latest` Tag

```bash
# Beispiel Merge
git checkout main
git merge release/v1.2.0
git push origin main
```

### 🧪 **Develop Branch**
- **Zweck**: Integration neuer Features
- **Schutz**: Geschützt, Pull Requests erforderlich
- **Merges**: Von `feature/*` branches
- **CI/CD**: Erweiterte Tests + Performance Tests
- **Docker**: Development Tags (`develop-latest`)

```bash
# Feature in develop integrieren
git checkout develop
git merge feature/visitor-tracking
git push origin develop
```

### ⚡ **Feature Branches** (`feature/*`)
- **Zweck**: Entwicklung neuer Funktionen
- **Naming**: `feature/beschreibung` oder `feature/TICKET-123`
- **Base**: `develop`
- **Merge**: In `develop` via Pull Request

```bash
# Neues Feature starten
git checkout develop
git pull origin develop
git checkout -b feature/dinosaur-feeding-system
# ... development work ...
git push origin feature/dinosaur-feeding-system
```

### 🚀 **Release Branches** (`release/*`)
- **Zweck**: Release-Vorbereitung und Testing
- **Naming**: `release/v1.2.0`
- **Base**: `develop`
- **Merge**: In `main` und `develop`

```bash
# Release vorbereiten
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
# ... final testing and bug fixes ...
git push origin release/v1.2.0
```

### 🚨 **Hotfix Branches** (`hotfix/*`)
- **Zweck**: Kritische Produktions-Bugfixes
- **Naming**: `hotfix/critical-security-patch`
- **Base**: `main`
- **Merge**: In `main` und `develop`
- **CI/CD**: Express-Pipeline für schnelle Deployments

```bash
# Kritischen Hotfix starten
git checkout main
git pull origin main
git checkout -b hotfix/containment-breach-fix
# ... critical fix ...
git push origin hotfix/containment-breach-fix
```

## 🤖 GitHub Actions Workflows

### 📋 **CI Pipeline** (`.github/workflows/ci.yml`)
**Trigger**: Push/PR zu `main`, `develop`, `release/*`, `hotfix/*`
- ✅ Linting und Code-Qualität
- 🧪 Unit- und Integration-Tests
- 🏗️ Build-Validierung
- 🐳 Docker Image Building
- 🔒 Security Scanning

### 🚀 **Release Pipeline** (`.github/workflows/release.yml`)
**Trigger**: Push zu `main` oder manuell
- 🧪 Vollständige Test-Suite
- 🏷️ Automatisches Versioning mit [release-it](https://github.com/release-it/release-it)
- 📋 Changelog-Generierung
- 🐳 Production Docker Images
- 🎉 GitHub Release Erstellung

### 🧪 **Develop Pipeline** (`.github/workflows/develop.yml`)
**Trigger**: Push/PR zu `develop`
- 🔄 Multi-Node.js-Version Tests
- ⚡ Performance Tests
- 🔗 Integration Tests mit Datenbank
- 🐳 Development Docker Images

### 🚨 **Hotfix Pipeline** (`.github/workflows/hotfix.yml`)
**Trigger**: Push zu `hotfix/*`
- ⚡ Express Tests (nur kritische)
- 🚨 Emergency Release Process
- 🐳 Hotfix Docker Images
- 🚨 Sofortige Benachrichtigungen

## 🛡️ Branch Protection Rules

### **Main Branch**
```yaml
required_status_checks:
  - "🧪 Test & Lint"
  - "🔒 Security Scan"
  - "🐳 Docker Build & Test"
dismiss_stale_reviews: true
require_code_owner_reviews: true
required_approving_review_count: 2
```

### **Develop Branch**
```yaml
required_status_checks:
  - "🧪 Development Tests"
  - "🔗 Integration Tests"
  - "⚡ Performance Tests"
dismiss_stale_reviews: true
required_approving_review_count: 1
```

## 🚀 Release Process

### 1. **Feature Development**
```bash
# Feature entwickeln
git checkout -b feature/new-dinosaur-species develop
# ... coding ...
git push origin feature/new-dinosaur-species
# Pull Request zu develop erstellen
```

### 2. **Release Preparation**
```bash
# Release branch erstellen
git checkout -b release/v1.3.0 develop
# Testing und letzte Anpassungen
git push origin release/v1.3.0
```

### 3. **Production Release**
```bash
# Nach erfolgreichem Testing
git checkout main
git merge release/v1.3.0
git push origin main  # Triggert automatisches Release
```

### 4. **Hotfix Process**
```bash
# Kritischen Fix anwenden
git checkout -b hotfix/security-patch main
# ... fix ...
git push origin hotfix/security-patch  # Express Pipeline
```

## 📋 Commit Conventions

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: 🦖 add new velociraptor behavior system
fix: 🔒 resolve containment breach vulnerability
docs: 📝 update API documentation
test: 🧪 add comprehensive dinosaur feeding tests
chore: 🔧 update dependencies and build tools
```

### Emoji Guide
- 🦖 **feat**: Neue Features
- 🔒 **fix**: Bugfixes
- 📝 **docs**: Dokumentation
- 🧪 **test**: Tests
- 🔧 **chore**: Maintenance
- ⚡ **perf**: Performance
- 🚨 **hotfix**: Kritische Fixes

## 🔧 Release-it Configuration

Automatisches Versioning und Release mit [release-it](https://github.com/release-it/release-it):

```bash
# Patch Release (z.B. 1.0.0 → 1.0.1)
npm run release:patch

# Minor Release (z.B. 1.0.0 → 1.1.0)
npm run release:minor

# Major Release (z.B. 1.0.0 → 2.0.0)
npm run release:major

# Pre-release (z.B. 1.0.0 → 1.0.1-0)
npm run release:pre

# Dry Run (Simulation)
npm run release:dry
```

## 🚨 Emergency Procedures

### **Containment Breach** (Critical Bug in Production)
1. Sofort `hotfix/*` branch von `main` erstellen
2. Minimaler Fix implementieren
3. Express-Pipeline nutzen (nur kritische Tests)
4. Sofortiges Deployment

### **Security Incident**
1. Sicherheitslücke bewerten
2. `hotfix/security-*` branch erstellen
3. Security-Pipeline automatisch aktiviert
4. Koordinierte Disclosure nach Fix

## 📊 Monitoring & Metriken

- **Build Success Rate**: > 95%
- **Test Coverage**: > 80%
- **Security Scan**: Keine High/Critical Issues
- **Release Frequency**: Wöchentlich (Minor), Monatlich (Major)
- **Hotfix Response Time**: < 2 Stunden

---

**🦕 Remember**: Safety first! All changes must pass dinosaur containment protocols before deployment to production.
