# Contributing to Voice101.ai

Thank you for considering contributing to Voice101.ai! This document outlines the process for contributing to this project and provides some guidelines to ensure a smooth collaboration experience.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check the existing issues to see if someone has already reported the problem.
- If you're unable to find an open issue addressing the problem, open a new one.

When creating a bug report, please include as much detail as possible:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, screen size, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues:
- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a new branch from `main` for your feature/fix
3. Make your changes following our code style guidelines
4. Ensure your code passes linting and tests
5. Submit a pull request

## Development Workflow

### Setting Up Your Environment

```bash
# Clone your fork of the repository
git clone https://github.com/YOUR-USERNAME/voice101-ai.git

# Navigate to the project directory
cd voice101-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Code Style Guidelines

#### TypeScript

- Use TypeScript for all new code
- Include type definitions for all functions, parameters, and return values
- Use interfaces for complex objects

#### React

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Use proper React hooks dependencies

#### CSS/Styling

- Follow Tailwind CSS conventions
- Use utility classes whenever possible
- Create custom classes only when necessary

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Project Structure

```
voice101-ai/
├── public/             # Static assets
│   └── assets/
│       └── images/     # Images used throughout the application
├── src/                # Source code
│   ├── components/     # React components
│   ├── data/           # Static data files
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and shared code
│   └── pages/          # Page components
└── ...                 # Configuration files
```

## Review Process

All submissions require review before being merged:
1. At least one maintainer must approve your changes
2. All automated checks must pass
3. Any requested changes must be addressed

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).

Thank you for your contributions!
