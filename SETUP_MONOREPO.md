# Setting Up the Tasks Monorepo

## Step-by-Step Instructions

### 1. Remove Git from factorySpace (if it exists)
```bash
cd /Users/cmvinayak/Documents/Tasks/factorySpace
rm -rf .git
```

### 2. Initialize Git at Tasks Root Level
```bash
cd /Users/cmvinayak/Documents/Tasks
git init
```

### 3. Verify .env files are ignored
```bash
git check-ignore factorySpace/.env
# Should output: factorySpace/.env
```

### 4. Stage All Projects
```bash
git add .
```

### 5. Review What Will Be Committed
```bash
git status
# Make sure no .env files are listed
```

### 6. Make Initial Commit
```bash
git commit -m "Initial commit: Tasks monorepo with factorySpace project"
```

### 7. Create New GitHub Repository
1. Go to https://github.com/new
2. Repository name: `Tasks`
3. Description: "A monorepo containing multiple projects and technical exercises"
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 8. Connect and Push
```bash
git remote add origin https://github.com/VINAYAKCM/Tasks.git
git branch -M main
git push -u origin main
```

## Result

Your repository structure will be:
```
Tasks/
├── .gitignore
├── README.md
├── factorySpace/
│   ├── src/
│   ├── package.json
│   └── ...
└── (future projects...)
```

## Adding New Projects

When you add a new project:
1. Create folder: `mkdir newProject`
2. Add your project files
3. Update main `README.md` to list it
4. Commit: `git add newProject && git commit -m "Add newProject"`

