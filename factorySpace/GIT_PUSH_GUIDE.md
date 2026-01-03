# Complete Guide: Pushing to GitHub

## 🔐 Security Checklist (ALWAYS DO THIS FIRST!)

### Before Every Push:

1. **✅ Check for sensitive files:**
   ```bash
   git status
   # Make sure .env is NOT in the list
   ```

2. **✅ Verify .env is ignored:**
   ```bash
   git check-ignore .env
   # Should output: .env
   ```

3. **✅ Never commit these:**
   - `.env` (your actual API keys)
   - `node_modules/`
   - `dist/` or build folders
   - Any files with actual secrets/credentials

## 📋 Step-by-Step: First Time Setup

### Step 1: Initialize Git Repository
```bash
cd factorySpace
git init
```

### Step 2: Verify .gitignore is Working
```bash
# Check if .env is ignored
git check-ignore .env
# Should show: .env

# Check what files will be added
git status
# .env should NOT appear in the list
```

### Step 3: Create .env.example (Safe to Commit)
```bash
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env.example
```

### Step 4: Stage Files
```bash
git add .
```

### Step 5: Review What You're Committing
```bash
git status
# Review the list - make sure no .env file is there!
```

### Step 6: Make Your First Commit
```bash
git commit -m "Initial commit: Robot Control Interface"
```

### Step 7: Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name it (e.g., "robot-control-interface")
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 8: Connect and Push
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔄 For Future Pushes

### Standard Workflow:
```bash
# 1. Check what changed
git status

# 2. Verify no sensitive files
git check-ignore .env  # Should output: .env

# 3. Stage changes
git add .

# 4. Review what you're committing
git status

# 5. Commit
git commit -m "Your commit message"

# 6. Push
git push
```

## 🚨 What to Remember ALWAYS

### ✅ DO:
- ✅ Always check `git status` before committing
- ✅ Verify `.env` is ignored before every push
- ✅ Use meaningful commit messages
- ✅ Pull before pushing if working with others: `git pull`
- ✅ Keep `.env.example` updated (safe to commit)

### ❌ DON'T:
- ❌ Never commit `.env` files
- ❌ Never commit `node_modules/`
- ❌ Never commit build outputs (`dist/`, `build/`)
- ❌ Never hardcode API keys in source code
- ❌ Never force push to main/master without good reason

## 🔍 Quick Security Check Commands

```bash
# Check if .env is tracked (should return nothing)
git ls-files | grep "\.env$"

# Check if any secrets are in git history (should return nothing)
git log --all --full-history --source -- "*env*" "*key*" "*secret*"

# See what will be committed
git diff --cached

# See what's ignored
git status --ignored
```

## 📝 Good Commit Message Examples

```bash
git commit -m "Add image upload functionality to Scene component"
git commit -m "Fix layout to fit within 100vh viewport"
git commit -m "Update Gemini API integration to use v1beta"
git commit -m "Add form validation and error handling"
```

## 🆘 If You Accidentally Committed Secrets

1. **Remove from staging (if not committed yet):**
   ```bash
   git reset HEAD .env
   ```

2. **If already committed but NOT pushed:**
   ```bash
   git rm --cached .env
   git commit --amend
   ```

3. **If already pushed:**
   - ⚠️ **ROTATE YOUR API KEY IMMEDIATELY**
   - Remove from history (advanced - ask for help)
   - Update `.gitignore` and commit

## 📚 Additional Resources

- GitHub Docs: https://docs.github.com/en/get-started
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics
- GitHub Security Best Practices: https://docs.github.com/en/code-security

