# Simple Git Workflow Guide

## Basic Branch Structure

- `main` - production code
- `feature/*` - where we develop new features

## Daily Workflow

### Creating a New Feature Branch

```bash
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Create and switch to a new feature branch
git checkout -b feature/your-feature-name
```

### Working on Your Feature

1. Make small, focused commits:

```bash
git add .
git commit -m "description of what you did"
```

2. Stay up to date with main (do this daily):

```bash
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
```

### Creating a Pull Request

1. Push your changes:

```bash
# First time pushing the branch
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

2. Go to GitHub/GitLab and create a Pull Request
   - Select `main` as the base branch
   - Write a clear description of your changes
   - Request review from teammates

### After PR Review

1. If changes are requested:

   - Make the changes locally
   - Commit and push again
   - The PR will update automatically

2. Once approved:
   - Merge via the PR interface
   - Delete your feature branch

## Tips

- Pull from main daily to avoid big merge conflicts
- Use descriptive branch names (e.g., `feature/add-login-form`)
- Test your changes before creating a PR
- Keep PRs focused on a single feature/fix
