# FenrirAI Portfolio - Development Commands

.PHONY: install dev build preview clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build for production"
	@echo "  make preview  - Preview production build"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make lint     - Run TypeScript type check"

# Install dependencies
install:
	~/.bun/bin/bun install

# Start development server
dev:
	~/.bun/bin/bun run dev

# Build for production
build:
	~/.bun/bin/bun run build

# Preview production build locally
preview: build
	~/.bun/bin/bun run preview

# Run TypeScript type check
lint:
	~/.bun/bin/bun run tsc --noEmit

# Remove build artifacts
clean:
	rm -rf dist node_modules/.vite
