# Project Context Documentation

This directory contains comprehensive documentation for AI partners working on the **ydtb** project. These documents establish our development standards, patterns, and collaboration guidelines.

## Context Files Overview

### 📋 [project-overview.md](./project-overview.md)
**Core project information and technology stack**
- Current project state and architecture
- Technology choices and rationale
- Development scripts and environment setup
- Project structure and key configurations

### 🏗️ [architecture-principles.md](./architecture-principles.md)
**Architectural patterns and design philosophy**
- Component architecture and design patterns
- State management strategies
- Database design principles
- API design conventions
- Security and performance architecture

### 🔄 [development-workflow.md](./development-workflow.md)
**Development processes and collaboration methods**
- Git workflow and branching strategy
- Code review process and standards
- Testing strategy and requirements
- Release and deployment processes
- Team collaboration guidelines

### 🎨 [visual-development-patterns.md](./visual-development-patterns.md)
**UI/UX patterns and design system usage**
- Design system architecture with shadcn/ui
- Component design patterns and conventions
- Responsive design principles
- Accessibility guidelines
- Animation and interaction patterns

### 🤝 [ai-collaboration-guidelines.md](./ai-collaboration-guidelines.md)
**How to work effectively with AI partners**
- Collaboration philosophy and communication patterns
- Decision-making framework
- Code review guidelines for AI-generated code
- Problem-solving approaches
- Quality assurance and continuous improvement

### ✅ [code-quality-standards.md](./code-quality-standards.md)
**Technical standards and quality requirements**
- TypeScript standards and patterns
- Code organization and naming conventions
- Testing requirements and templates
- Performance and security standards
- Documentation guidelines

## How to Use This Documentation

### For New AI Partners
1. **Start with Project Overview** - Understand the current state and technology stack
2. **Review Architecture Principles** - Learn our design patterns and architectural decisions
3. **Study Development Workflow** - Understand our processes and standards
4. **Master Visual Patterns** - Get familiar with our design system and UI patterns
5. **Follow AI Collaboration Guidelines** - Learn how to work effectively with our team

### For Development Tasks
- **Feature Development**: Read Architecture Principles + Visual Development Patterns
- **Bug Fixes**: Consult Code Quality Standards + Development Workflow
- **Code Reviews**: Use Code Quality Standards as review checklist
- **Performance Issues**: Review Architecture Principles performance section
- **Security Concerns**: Follow security patterns in Architecture Principles

### For Decision Making
- **Technical Decisions**: Use Architecture Principles as guide
- **Pattern Selection**: Reference Visual Development Patterns
- **Quality Standards**: Follow Code Quality Standards
- **Collaboration**: Use AI Collaboration Guidelines for effective teamwork

## Key Project Standards

### Technology Stack
- **Framework**: Next.js 16 with App Router + Partial Prerendering + React 19.2
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: Better Auth
- **Testing**: Vitest + Playwright
- **Code Quality**: Biome (linting + formatting)

### Core Principles
- **Component-First Development**: Build components in Storybook first
- **Mobile-First Design**: Responsive design approach
- **Accessibility-First**: WCAG 2.1 AA compliance
- **Type Safety**: 100% TypeScript coverage
- **Performance**: Optimized for production

### Development Workflow
- **Git Flow**: Feature branches with conventional commits
- **Code Review**: Required peer review with quality checklist
- **Testing**: 80%+ coverage for critical paths
- **Documentation**: Comprehensive documentation standards
- **AI Collaboration**: Structured partnership with clear guidelines

## Getting Started

1. **Read Project Overview** for current state understanding
2. **Review Architecture Principles** for design patterns
3. **Study relevant sections** based on your task
4. **Ask questions** when anything is unclear
5. **Follow established patterns** for consistency

## Updating Documentation

When project patterns evolve:
1. **Update relevant context files** with new information
2. **Remove outdated information** to maintain accuracy
3. **Add new patterns** as they emerge
4. **Maintain consistency** across all documentation
5. **Version important changes** for reference

This documentation serves as the foundation for consistent, high-quality development work across all team members, both human and AI.