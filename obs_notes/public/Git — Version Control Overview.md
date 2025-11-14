
Git is a **change-tracking system** — a form of **Version Control (Source Control)**.
It tracks modifications, stores history, and manages collaboration. Git is optimized for **line-by-line tracking**, not binary files.

---

# Core Advantages

- **Tracking Changes** — view detailed logs of what changed and why  
- **Revert & Recovery** — restore previous versions easily  
- **Team Collaboration** — multiple developers can work in parallel  
- **Backup** — remote repositories keep extra copies of your work  

---

# Commit

A **commit** is a snapshot of your entire project at a specific moment.

Each commit includes:

- **Identifier** — unique SHA-1 ID  
- **Message** — description of the change  
- **Metadata** — author, timestamp, parent commit(s)

---

# Three Working Stages

- **Working Directory** — your actual project files  
- **Staging Area (Index)** — where changes are prepared  
- **Repository** — the official stored history (committed state)

---

# HEAD Pointer

**HEAD** points to *the latest commit of the currently checked-out branch*.

---

# Version Control Implementation

## Repository

- Stores all files and their entire history  
- Tracks file states  
- Contains complete project metadata  

## Distributed System

Every developer has a **full copy** of the repository.

- No central server required  
- Works offline  
- Full commit history is shared

---

# Essential Git Commands

---

## Repository Management

```bash
git init                      # Initialize a new repository
git status                    # Show current branch, staged changes, and unstaged changes
```

---

## Basic Workflow

```bash
git add .                     # Stage all modified files
git add <file>                # Stage specific file
git commit -m "message"       # Commit staged changes
git diff                      # Show unstaged changes
git diff --staged             # Show staged changes
```

---

## History & Logging

```bash
git log                       # Full commit history
git log --graph               # Visual branch diagram
git log --oneline             # One-line-per-commit view
git log --all                 # Logs from all branches
git reflog                    # Shows every HEAD movement (great for recovery)
```

---

## Undoing Changes

```bash
git revert <commit>           # Safe: creates a commit that undoes another
git reset <commit>            # Dangerous: rewrites history
```

### Reset Modes

- **--soft** → Move HEAD only, keep changes staged  
- **--mixed** (default) → Move HEAD, unstage changes  
- **--hard** → Move HEAD and discard all changes permanently  

---

## File Recovery

```bash
git restore <file>            # Discard working directory changes
git restore --staged <file>   # Unstage a file
```

---

## Branch Operations

```bash
git branch                    # List local branches
git branch -a                 # List local + remote branches
git checkout -b <name>        # Create and switch to new branch
git switch <branch>           # Modern branch switching
git checkout <branch>         # Traditional branch switching
git branch -d <branch>        # Delete merged branch
git merge <branch>            # Merge branch into current
```

---

## Stashing Changes

```bash
git stash                     # Save uncommitted changes
git stash list                # View saved stashes
git stash push -m "message"   # Save stash with description
git stash pop                 # Apply & remove latest stash
git stash apply               # Apply stash without removing
```

---

## Remote Operations

```bash
git push -u origin main       # Push commits to remote (+ set upstream)
git pull                      # Fetch + merge remote updates
git fetch                     # Fetch without merging
```

---

# Branch Naming Conventions

Use consistent prefixes:

- `feature/<description>`  
- `bugfix/<issue>`  
- `hotfix/<critical-fix>`

Reference: https://conventional-branch.github.io/

---

# Solving Merge Conflicts

A merge conflict occurs when **two commits modify the same part of a file**.

Steps:

1. Open conflict file  
2. Manually resolve  
3. Stage the file  
4. Commit the merge resolution  

---

# Git Rebase vs Merge

### **Merge**

- Combines histories  
- Creates a *merge commit*  
- Keeps branching timeline intact  
- Best for shared/public branches (safe)

### **Rebase**

- Rewrites history by moving commits  
- Produces a cleaner, linear history  
- Best for local work before pushing  
