#!/bin/bash

# Repository Dispatch Helper Script
# Dieses Script macht es einfach, Repository Dispatch Events zu senden

set -e

# Konfiguration
GITHUB_API="https://api.github.com"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktionen
print_usage() {
    echo "🚀 Repository Dispatch Helper"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -r, --repo REPO       Target repository (owner/repo)"
    echo "  -e, --event EVENT     Event type"
    echo "  -t, --token TOKEN     GitHub token (or set GITHUB_TOKEN env var)"
    echo "  -p, --payload FILE    JSON payload file (optional)"
    echo "  -h, --help           Show this help"
    echo ""
    echo "Available event types:"
    echo "  • deploy-staging      - Deploy to staging environment"
    echo "  • deploy-production   - Deploy to production environment"
    echo "  • run-tests          - Execute test suite"
    echo "  • sync-dependencies  - Sync dependencies from this repo"
    echo "  • custom-build       - Custom build process"
    echo ""
    echo "Examples:"
    echo "  $0 -r owner/target-repo -e deploy-staging"
    echo "  $0 -r owner/target-repo -e run-tests -p test-config.json"
    echo "  $0 --repo owner/target-repo --event deploy-production --token ghp_xxxx"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

validate_requirements() {
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Please install jq first."
        exit 1
    fi

    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed. Please install curl first."
        exit 1
    fi

    # Check if git is installed
    if ! command -v git &> /dev/null; then
        log_error "git is required but not installed. Please install git first."
        exit 1
    fi
}

get_current_repo_info() {
    cd "$PROJECT_ROOT"
    
    CURRENT_REPO=$(git config --get remote.origin.url | sed 's/.*github\.com[:/]\([^/]*\/[^/]*\)\.git.*/\1/')
    CURRENT_REF=$(git rev-parse --abbrev-ref HEAD)
    CURRENT_SHA=$(git rev-parse HEAD)
    
    if [ -z "$CURRENT_REPO" ]; then
        log_error "Could not determine current repository"
        exit 1
    fi
    
    log_info "Current repository: $CURRENT_REPO"
    log_info "Current branch: $CURRENT_REF"
    log_info "Current SHA: ${CURRENT_SHA:0:8}"
}

build_payload() {
    local event_type="$1"
    local payload_file="$2"
    
    # Base payload mit Repository-Informationen
    local base_payload=$(cat <<EOF
{
  "ref": "refs/heads/$CURRENT_REF",
  "sha": "$CURRENT_SHA",
  "source_repository": "$CURRENT_REPO",
  "triggered_by": "$(git config user.name || echo 'unknown')",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "dispatch_method": "script"
}
EOF
)

    # Event-spezifische Daten hinzufügen
    case "$event_type" in
        "deploy-staging")
            base_payload=$(echo "$base_payload" | jq '. + {
                "environment": "staging",
                "version": "latest",
                "deployment": {
                    "type": "automated",
                    "source": "repository_dispatch"
                }
            }')
            ;;
        "deploy-production")
            base_payload=$(echo "$base_payload" | jq '. + {
                "environment": "production",
                "version": "latest",
                "deployment": {
                    "type": "automated",
                    "source": "repository_dispatch",
                    "requires_approval": true
                }
            }')
            ;;
        "run-tests")
            base_payload=$(echo "$base_payload" | jq '. + {
                "test_config": {
                    "coverage": true,
                    "test_suite": "all",
                    "test_env": "ci"
                }
            }')
            ;;
        "sync-dependencies")
            base_payload=$(echo "$base_payload" | jq '. + {
                "dependency_sync": {
                    "source_repo": "'$CURRENT_REPO'",
                    "update_type": "patch",
                    "create_pr": true
                }
            }')
            ;;
        "custom-build")
            base_payload=$(echo "$base_payload" | jq '. + {
                "build_config": {
                    "build_type": "standard",
                    "output_format": "docker"
                }
            }')
            ;;
    esac

    # Custom payload file mergen falls vorhanden
    if [ -n "$payload_file" ] && [ -f "$payload_file" ]; then
        log_info "Merging custom payload from $payload_file"
        local custom_payload=$(cat "$payload_file")
        base_payload=$(echo "$base_payload" | jq --argjson custom "$custom_payload" '. + $custom')
    fi

    echo "$base_payload"
}

send_dispatch() {
    local repo="$1"
    local event_type="$2"
    local token="$3"
    local payload="$4"

    log_info "Sending repository dispatch event..."
    log_info "Target: $repo"
    log_info "Event: $event_type"

    # GitHub API Request
    local response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Authorization: token $token" \
        -H "Content-Type: application/json" \
        "$GITHUB_API/repos/$repo/dispatches" \
        -d "{
            \"event_type\": \"$event_type\",
            \"client_payload\": $payload
        }")

    local http_code=$(echo "$response" | tail -n1)
    local response_body=$(echo "$response" | head -n -1)

    if [ "$http_code" = "204" ]; then
        log_success "Repository dispatch sent successfully!"
        log_info "Check the Actions tab in $repo to see the triggered workflow"
        return 0
    else
        log_error "Failed to send repository dispatch (HTTP $http_code)"
        if [ -n "$response_body" ]; then
            echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"
        fi
        return 1
    fi
}

# Hauptlogik
main() {
    local repo=""
    local event_type=""
    local token="${GITHUB_TOKEN:-}"
    local payload_file=""

    # Parameter parsen
    while [[ $# -gt 0 ]]; do
        case $1 in
            -r|--repo)
                repo="$2"
                shift 2
                ;;
            -e|--event)
                event_type="$2"
                shift 2
                ;;
            -t|--token)
                token="$2"
                shift 2
                ;;
            -p|--payload)
                payload_file="$2"
                shift 2
                ;;
            -h|--help)
                print_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done

    # Validierungen
    validate_requirements

    if [ -z "$repo" ]; then
        log_error "Repository is required"
        print_usage
        exit 1
    fi

    if [ -z "$event_type" ]; then
        log_error "Event type is required"
        print_usage
        exit 1
    fi

    if [ -z "$token" ]; then
        log_error "GitHub token is required (use -t or set GITHUB_TOKEN env var)"
        exit 1
    fi

    # Repository-Informationen sammeln
    get_current_repo_info

    # Payload erstellen
    log_info "Building payload for event: $event_type"
    local payload=$(build_payload "$event_type" "$payload_file")
    
    echo -e "\n${YELLOW}📦 Payload:${NC}"
    echo "$payload" | jq '.'
    echo ""

    # Bestätigung
    read -p "Send this repository dispatch event? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Aborted by user"
        exit 0
    fi

    # Dispatch senden
    send_dispatch "$repo" "$event_type" "$token" "$payload"
}

# Script ausführen
main "$@"
