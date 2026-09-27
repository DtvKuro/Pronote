# Bash Shortcuts (.bashrc)

Copy the raw bashrc block below into `~/.bashrc` on any new device to replicate this setup.

## Aliases
| Shortcut  | Expands To                            |
|-----------|---------------------------------------|
| `ns-lis`  | `ns LISTENING`                        |
| `ns-es`   | `ns ESTABLISHED`                      |
| `c`       | `clear`                               |
| `cl`      | `clear`                               |
| `cla`     | `claude`                              |
| `cl-skp`  | `claude --dangerously-skip-permissions` |

## Functions
| Shortcut       | What It Does                                                        |
|----------------|---------------------------------------------------------------------|
| `ns`           | Shows all connections (`netstat -ano`)                               |
| `ns <filter>`  | Filters connections by keyword, e.g. `ns LISTENING`, `ns ESTABLISHED` |
| `ns <port>`    | Port check — says "Port X is UP and LISTENING/ESTABLISHED" or "Port X is NOT up" |
| `kp <port>`    | Finds the PID listening on that port and kills it (`taskkill /F`)    |

## Raw .bashrc (copy-paste ready)

```bash
# Git Bash configuration

# Custom aliases
ns() {
  if [ -z "$1" ]; then
    netstat -ano
  elif [[ "$1" =~ ^[0-9]+$ ]]; then
    # If argument is a number, treat it as a port check
    local listening=$(netstat -ano | grep ":$1 " | grep LISTENING)
    local established=$(netstat -ano | grep ":$1 " | grep ESTABLISHED)
    if [ -n "$listening" ] || [ -n "$established" ]; then
      if [ -n "$listening" ]; then
        echo "Port $1 is UP and LISTENING"
        echo "$listening"
      fi
      if [ -n "$established" ]; then
        echo "Port $1 is UP and ESTABLISHED"
        echo "$established"
      fi
    else
      echo "Port $1 is NOT up"
    fi
  else
    netstat -ano | grep -i "$1"
  fi
}
alias ns-lis='ns LISTENING'
alias ns-es='ns ESTABLISHED'
alias cl-skp='claude --dangerously-skip-permissions'
alias cl='clear'
alias cla='claude'

kp() {
  if [ -z "$1" ]; then
    echo "Usage: kp <port>"
    return 1
  fi
  local pid=$(netstat -ano | grep ":$1 " | grep LISTENING | awk '{print $5}' | head -1)
  if [ -z "$pid" ]; then
    echo "No process found listening on port $1"
    return 1
  fi
  echo "Killing PID $pid on port $1"
  taskkill //PID "$pid" //F
}
alias c="clear"
```
