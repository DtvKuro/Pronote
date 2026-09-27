## INTRODUCTION TO GIT

### Version Control

Making a savepoint or a version.
So that if something happens, and your code is bugged.
You can load the previous version.

You can return to any version as long you know what version you want.

```bash
git init
git add file
git commit -m "message"

git status
git log
```

You can initialize a git repo by doing `git init` in the root folder, where you want everything to be track

and now in Work directory, you can `git add .` the file to add the files into the Staging area which will then Commit the file into Git repository.

now that our file is inside the local repository.
and that version is given a name through commit message.

So even if we mess up the file, we can still use the last version under version control using the command:

`git checkout <file>` to revert back to the last position in the repository

`git diff <file>` this is used to check the difference on both versions, so you can compare.

---

## GIT REMOTE REPOSITORY

Create and push to a remote repository using Github.

```bash
gh repo create
git remote add origin <LINK>
git push -u origin main
```

`gh repo create` - to create a repo.
`git remote add origin <LINK>` - We are gonna make a connection from our local repository to our git repository,
_(remote name)_
`git push -u origin main` - push the files from our local repository into the git repository
_(remote) (branch)_

#### Basically

```
Working Directory
  to "git add"
Staging Area
  to "git commit"
Local Repository (Git)
  to "git push"
Remote Repository (Github)
```

In local repository we can make a timeline which is the main branch of what you are doing and compare it to remote repository
and sync the local and remote by pushing the main branch from local to remote.

---

## GIT IGNORE

You create gitignore so that files you dont wanna share wont be share.
Like passwords, Api, etc.

```bash
touch .gitignore
```

```bash
git rm --cached -r .
```

Inside .gitignore:

```
.gitignore
secrets.txt
.useless.txt

#You can comment

#you can also use * which means all, example *.txt which means all text file will be ignored.
```

---

## CLONING

How to download and create a copy of a repository

Basically how to download from github repo to local repo. which is called cloning.

```bash
git clone <link>
```

`git clone <link>` - Allows to clone the version and commit history and store to own working directory.

This is used to continue where the other person left off, or if you want to rework it, or change or correct something.

---

## GIT BRANCH

### Feature Development With Branches

```
MAIN BRANCH---_---_-------_-------We can also work on main branch while working on the branch
                \               /
                 _---_---_ This is a branch to experiment some new feature.
```

```bash
git branch name-of-branch
git checkout name-of-branch
git checkout -b name-of-branch
```

`git branch name-of-branch` - creates a new branch
`git checkout name-of-branch` - switch to that branch (or `git switch name-of-branch`)
OR
`git checkout -b name-of-branch` - if you want to create and switch to that branch in one liner.

You can check your branches with: `git branch`
and whatever has * at the start means thats the branch you are currently on.

You can do this if you want to test something out before committing and pushing to main.

On the branch, you only commit locally. No need to push the branch.

### Merging

To merge: switch to the branch you want to RECEIVE the changes first, then merge the other one in.

```bash
git checkout main
git merge name-of-branch
```

If both main and the branch have new commits, Git creates a **merge commit** and opens Vim for a message.
In Vim: press Esc, then type one of these, then press Enter:
`:wq` - save the message and quit
`:q!` - quit without saving (Git still uses the default message, so either works)
To avoid Vim entirely: `git config --global core.editor "notepad"`

If only the branch has new commits (main didn't change), Git does a **"fast-forward"** -- just a straight line, no fork shape.
The fork-and-rejoin shape only happens when both sides have new commits since the branch point.

Then check to see if theres any conflict with the main branch, if there is then edit it.

After merging, push main:

```bash
git push origin main
```

---

## SETTING UP A NEW REPO FROM SCRATCH

```bash
git init
git add .
git commit -m "message"
gh repo create repo-name --public --source=. --push
```

`git init` - creates a local-only repo (no connection to GitHub yet)
`git add .`
`git commit -m "message"`
`gh repo create repo-name --public --source=. --push` - creates GitHub repo, adds remote, pushes, and sets up tracking all in one

Or manually:

```bash
git remote add origin <LINK>
git push --set-upstream origin main
```

`git remote add origin <LINK>`
`git push --set-upstream origin main` - only needed the FIRST push of a new branch (links local branch to remote)
After that, plain `git push` works fine.

When you `git clone` a repo, upstream tracking is set up automatically -- thats why you never needed --set-upstream before.

---

## FORKING AND PULL REQUESTS

How to suggest code changes and contribute to an open source project.

Best way to contribute and work with team.

**Forking** - you can copy the repo of the person you are working with and make changes on your own code instead of having access on the original repo.

its different from `git clone` which only clones the files to your desktop not the repo.

So now that people have forked the repo, they can now git clone to get edit access to your own version of repo.
You can now make changes on your files. then push it to forked-repo.

If you want your changes to be encorporated you have to make a **pull request**.
