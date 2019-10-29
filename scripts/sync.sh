#!/bin/bash

#exec 3>&1 4>&2
#trap 'exec 2>&4 1>&3' 0 1 2 3
#exec 1>/home/appsupp/test_sync_log.txt 2>&1

function logINFO {

        LOG_TIME=$(date +%Y-%m-%d" "%H:%M:%S.%N | cut -c1-19)
        echo "${LOG_TIME}   [INFO]   $1" | tee -a "${LOGGING}"

}


function logERROR {

        LOG_TIME=$(date +%Y-%m-%d" "%H:%M:%S.%N | cut -c1-19)
        echo "${LOG_TIME}   [ERROR]   $1" | tee -a "${LOGGING}"

}


TEST_LOG='/var/www/html/newPKI/log/test_sync_log.txt'

LOGGING='/var/www/html/newPKI/log/synclog.txt'
SYNC_PATH=''                            # global variable. Has to be empty at the beginning
#############################
# RSYNC script for duplicating changes on PunchKick php application to other nodes
# author: Tomas Hornak
#
# USAGE:
# ./sync.sh                     Text User Interface is started
# ./sync.sh path [option]       Will sync given path. If no option is given both --test and after confirmation
#                               also --write options are executed. If mutliple options are given only first
#                               option is accepted
# OPTIONS:
# --write                       Sync files without prompting to nodes 02-06
# --test                        Test syncronization
#############################

# Read custom variables from config file
VARS='/var/www/html/newPKI/scripts/local.config'
source $VARS

# -----------------------
# Function: Restarts services on server if path contains keyword
# @param1       connection string
# -----------------------
function restartServices {
  CONN=$1
  SERVICE=''
  case $SYNC_PATH in
    *'api'*     ) SERVICE='api'; ;;
    *'html'*    ) SERVICE='web'; ;;
    *'web'*     ) SERVICE='web'; ;;
    *'admin'*   ) SERVICE='admin'; ;;
    *'php'*     ) SERVICE='php'; ;;
  esac
  if [[ -z $SERVICE ]]; then
    logERROR "No services restarted"
  elif [[ $SERVICE == "php" ]]; then
    ssh -t -i $SSH_KEY $CONN "sudo systemctl restart php-fpm" && logINFO "Service php-fpm successfully restarted" || logERROR "Service php-fpm couldn't be restarted"
    echo "Service php-fpm successfully restarted"
  else
    ssh -t -i $SSH_KEY $CONN "sudo systemctl restart php-fpm && sudo systemctl restart httpd_$SERVICE" && logINFO "Services php-fpm & httpd_$SERVICE successfully restarted" || logERROR "Services & httpd_$SERVICE couldn't be restarted"
  fi
}

# -----------------------
# Function: Test run of sync on one node $TEST_NODE
# -----------------------
function test_sync {
  logINFO "=== Start of test sync to $TEST_NODE$SERVER started at `date -u`=="
  rsync -azh --del --stats --exclude='app/cache/' --exclude='/cache/' --exclude='logs/' --out-format="%o %n%L" --dry-run $SYNC_PATH --rsync-path="sudo rsync" -e "ssh -i $SSH_KEY" "$USER@$TEST_NODE$SERVER":$SYNC_PATH && logINFO "test done" || logERROR "There was an issues with the test sync"
 
  logINFO "=== End of test sync to $TEST_NODE$SERVER ended at `date -u` ==="
}

# -----------------------
# Function: Real run of rsync on all nodes 02-06
# -----------------------
function real_sync {
  logINFO "Sync of path: $SYNC_PATH starting at `date -u` ==" 
  for NUM in {5..6}; do
    CONN="$USER@mob0$NUM$SERVER"
    logINFO "Syncing mob0$NUM$SERVER"
    rsync -az --del --stats --exclude='app/cache/' --exclude='/cache/' --exclude='logs/' --log-file=$LOGGING $SYNC_PATH --rsync-path="sudo rsync" -e "ssh -i $SSH_KEY" $CONN:$SYNC_PATH | grep --color=none transferred >> $LOGGING
    logINFO "Sync finished"
    restartServices $CONN
    logINFO "Deleting WEB&ADMIN cache"
    ssh -i $SSH_KEY $CONN "sudo rm -rf /var/www/html/app/cache/*"
    ssh -i $SSH_KEY $CONN "sudo rm -rf /var/www/admin/cache/*"
    echo ""
  done
}

# -----------------------
# Function: First test run and after confirming by user also real run is executed
# -----------------------
function test_and_real_sync {
  test_sync
  read -p "Execute syncronization to nodes 02-06? (yes/no): " RES
  if [[ $RES == "yes" ]]; then
    real_sync
  fi
}

# -----------------------
# Function: Checks given path (ARG1). If it's valid SYNC_PATH variable is set up.
#           If it's not valid path to file or dir scirpt exits with code 1
# @param1       path to check
# -----------------------
function check_path {
  # checks if first argument is file or directory. If yes var SYNC_PATH is set up
  ARG1=$1
  if [[ -d $ARG1 || -f $ARG1 ]]; then # ARG1 is file or dir
    if [[ -d $ARG1 && $ARG1 != */ ]]; then
      ARG1="$ARG1/"  # adds trailing '/' at the end of path when missing
    fi
    SYNC_PATH=$ARG1
  else
    (>&2 echo "'$ARG1' is not valid path to file or directory. Ending...")
    exit 1
  fi
}

# -----------------------
# Function: Text User Interface
# -----------------------
function tui {
  echo "What do you want to sync?"
  echo "1) /var/www/html/"
  echo "2) /var/www/api/"
  echo "3) /var/www/admin/"
  read -p "Choose number: " RES
  case $RES in
    1) SYNC_PATH="/var/www/html/"; ;;
    2) SYNC_PATH="/var/www/api/"; ;;
    3) SYNC_PATH="/var/www/admin/"; ;;
    *) echo "Incorrect choice! Ending..."; exit 1; ;;
  esac;
  check_path $SYNC_PATH
  test_and_real_sync
  exit 0
}


# -------------------------------------------
# --- MAIN PART -----------------------------
# -------------------------------------------
# if first argument is empty text user interface is started then bash script is ended
if [[ -z "$1" ]]; then
  tui
else
  check_path $1
  if [[ -z $SYNC_PATH ]]; then
    echo "Nothing to do. Ending..."
    exit 0
  elif [[ -z "$2" ]]; then
    test_and_real_sync
  elif [[ $2 == "write" ]]; then
    real_sync
  elif [[ $2 == "test" ]]; then
    test_sync
  else
    (>&2 echo "Second argument is not valid path to file or directory. Ending... ")
    exit 1
  fi
fi

