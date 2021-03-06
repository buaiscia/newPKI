#!/bin/bash

LOGGING="/home/appsupp/logging.txt"

LOGFILE="/home/appsupp/logging.txt"

function logINFO {

	LOG_TIME=$(date +%Y-%m-%d" "%H:%M:%S.%N | cut -c1-19)
	echo "${LOG_TIME}   [INFO]   $1" | tee -a "${LOGFILE}"

}


function logERROR {

	LOG_TIME=$(date +%Y-%m-%d" "%H:%M:%S.%N | cut -c1-19)
        echo "${LOG_TIME}   [ERROR]   $1" | tee -a "${LOGFILE}"

}


function logWARNING {

        LOG_TIME=$(date +%Y-%m-%d" "%H:%M:%S.%N | cut -c1-19)
        echo "${LOG_TIME}   [WARNING]   $1" | tee -a "${LOGFILE}"


}

# -------------
# BACKUP MSG FILES
#--------------

function backup_msg_file_html {
	deploTime=$(date +"%y%m%d%H%M")
	sudo cp $FEW_PATH"/app/translations/messages.en.po" $BACKUP_PATH"msghtml/messages.en.po_$deploTime" && logINFO "-- FEW EN msg files backed up" || logERROR "There was a problem in making backup of FEW EN msg files"
	sudo cp $FEW_PATH"/app/translations/messages.es.po" $BACKUP_PATH"msghtml/messages.es.po_$deploTime" && logINFO "-- FEW ES msg files backed up" || logERROR "There was a problem in making backup of FEW ES msg files"
	
}

function backup_msg_file_api {

        deploTime=$(date +"%y%m%d%H%M")
	sudo cp $API_PATH"/translations/messages.en.po" $BACKUP_PATH"msgapi/messages.en.po_$deploTime" && logINFO "-- API EN msg files backed up" || logERROR "There was a problem in making backup of API EN msg files"
        sudo cp $API_PATH"/translations/messages.es.po" $BACKUP_PATH"msgapi/messages.es.po_$deploTime" && logINFO "-- API ES msg files backed up" || logERROR "There was a problem in making backup of API ES msg files"
	

}

function restore_msg_file_html {

	for file in $BACKUP_PATH"msghtml/messages.en.po_$deploTime"; do 
               filnam="$(basename $file)"; 
               sudo cp $file "$FEW_PATH/app/translations/"${filnam%%_*}  && logINFO "-- FEW EN msg files restored" || logERROR "There was a problem in restoring FEW EN msg files";
               done
        for file in $BACKUP_PATH"msghtml/messages.es.po_$deploTime"; do 
               filnam2="$(basename $file)"; 
               sudo cp $file "$FEW_PATH/app/translations/"${filnam2%%_*} && logINFO "-- FEW Es msg files restored" || logERROR "There was a problem in restoring FEW Es msg files"; 
               done


}

function restore_msg_file_api {

        for file in $BACKUP_PATH"msgapi/messages.en.po_$deploTime"; do 
		filnam="$(basename $file)"; 
		sudo cp $file "$API_PATH/translations/"${filnam%%_*} && logINFO "-- API EN msg files restored" || logERROR "There was a problem in restoring API EN msg files"; 
		done 
        for file in $BACKUP_PATH"msgapi/messages.es.po_$deploTime"; do 
		filnam2="$(basename $file)"; 
		sudo cp $file "$API_PATH/translations/"${filnam2%%_*} && logINFO "-- API ES msg files restored" || logERROR "There was a problem in restoring API ES msg files"; 
		done 


}

function assets_phprestart {

	sudo /var/www/api/console assets:grab && logINFO "-- Assets grab done" || logERROR "There was an issue with grabbing assets"
	sudo /usr/bin/systemctl restart php-fpm && logINFO "-- php-fpm restarted" || logERROR "The was an issue in restarting php-fpm service"

}


#------------
# ACTION_FEW (html)
#---------------


action_few() {

        FEW_PATH="/var/www/$1"

		
                echo "START AT $(date)" | tee -a "${LOGFILE}"
                # backups applications to /home/appsupp/backup/
                sudo tar -zcf $BACKUP_PATH"FEW_backup_$(date +"%Y-%m-%d_%H-%M").tar.gz" -C $FEW_PATH . && logINFO "-- Backup of FEW package done" || logERROR "There was a problem with the backup"
		backup_msg_file_html
                shopt -s extglob
                # remove files (2 commands for FEW)
                sudo rm -rf '$FEW_PATH/app/!(logs)'  && logINFO "-- Removal oF app done" || logERROR "There was a problem with removing the app"
                sudo rm -rf '$FEW_PATH/!(logs|config|app)' && logINFO "--Removal of general files in $FEW_PATH done"
                # extract packages provided by PunchKick to correct folders
                #sudo tar -zxf $filename -C $FEW_PATH --strip=1 && echo "--Package extracted" >> $LOGGING

		sudo tar -zxf $filename -C $FEW_PATH && logINFO "-- Package extracted" || logERROR "There was a problem with the package extraction"
                # Compare config files
                cd $FEW_PATH/config
		restore_msg_file_html
                for string in $(grep -Eo '[a-Z].*:' $FEW_PATH/config/default.yml); do if ! grep -Fq "$string" $FEW_PATH/config/local.yml;then (logWARNING "\033[0;31m $string not found \033[0m \n" || logINFO "Default and local yml are equal");fi; done

                #echo "--Please double check manually comparing the default.yml (provided in the package) with the local.yml and see if any new configuration was added" >> $LOGGING
                sudo chown -R apache:apache $FEW_PATH/ && logINFO "-- Chown into apache done" || logERROR "There was a problem with change owner"
		assets_phprestart
                #sudo /var/www/api/console assets:grab && echo "-- Assets grab done" >> $LOGGING
                #sudo /usr/bin/systemctl restart php-fpm && echo "-- php-fpm restarted" >> $LOGGING
                sudo /usr/sbin/service httpd_web restart && logINFO "-- Service restarted" || logERROR "There was a problem with the restart"
                echo "END AT $(date)" | tee -a "${LOGFILE}"
                echo "--------------------------------------------------------" | tee -a "${LOGFILE}"




}


#--------------------
# Function: action_api
#--------------------

action_api() {

        API_PATH="/var/www/$1"
	
        	# backups applications to /home/appsupp/backup/
                
                echo "START AT $(date)" | tee -a "${LOGFILE}"
                sudo tar -zcf $BACKUP_PATH"API_backup_$(date +"%Y-%m-%d_%H-%M").tar.gz" -C $API_PATH . && logINFO "-- Backup of API package done" || logERROR "There was a problem with the backup"
		backup_msg_file_api
                shopt -s extglob
                # remove files (2 commands for FEW)
        	sudo rm -rf '$API_PATH/!(logs|config)' && logINFO "-- Removal of app done" || logERROR "There was a problem with removing the app"
                # extract packages provided by PunchKick to correct folders
                #sudo tar -zxf $filename -C $API_PATH --strip=1 && echo "-- Package extracted" || logINFO "There was a problem with the package extraction"

		sudo tar -zxf $filename -C $API_PATH && logINFO "-- Package extracted" || logERROR "There was a problem with the package extraction"
		restore_msg_file_api
                # Compare config files
                cd $API_PATH/config
                for string in $(grep -Eo '[a-Z].*:' $API_PATH/config/default.yml); do if ! grep -Fq "$string" $API_PATH/config/local.yml;then (logWARNING "$string not found in default.yml. Check if needs to be updated with some values" || logINFO "Default and local yml are equal");fi; done 
                #logINFO "Please double check manually comparing the default.yml (provided in the package) with the local.yml and see if any new configuration was added." 
                #sudo tar -zxfv $filename -C $API_PATH >> $LOGGING
                # Compare config files
                #cd $API_PATH/config
                #for string in $(grep -Eo '[a-Z].*: ' $API_PATH/config/default.yml); do if ! grep -Fq "$string" $API_PATH/config/local.yml;then printf "\033[0;31m $string not found \033[0m \n";fi; done >> $LOGGING
                #echo "Please double check manually comparing the default.yml (provided in the package) with the local.yml and see if any new configuration was added." >> $LOGGING
         	sudo chown -R apache:apache $API_PATH/  && logINFO "-- Chown into apache done" || logERROR "There was a problem with change owner"
		assets_phprestart
                #sudo $API_PATH/console assets:grab && echo "-- Assets grab done" >> $LOGGING
                #sudo /usr/bin/systemctl restart php-fpm && echo "-- php-fpm restarted" >> $LOGGING
         	sudo $API_PATH/console migration:migrate && logINFO "-- Migration done" || logERROR "There was a problem with the migration"
         	sudo /usr/sbin/service httpd_api restart && logINFO "-- Service restarted" || logERROR "There was a problem with the restart"
                echo "END AT $(date)" | tee -a "${LOGFILE}"
		echo "--------------------------------------------------------" | tee -a "${LOGFILE}"
	

}

#--------------------
# Function: action_admin
#--------------------


action_admin() {

                ADMIN_PATH="/var/www/$1"



        # backups applications to /home/appsupp/backup/
		
                echo "START AT $(date)"| tee -a "${LOGFILE}"
                sudo tar -zcf $BACKUP_PATH"ADMIN_backup_$(date +"%Y-%m-%d_%H-%M").tar.gz" -C $ADMIN_PATH . && logINFO "-- Backup of ADMIN package done" || logERROR "There was a problem with the backup"
                shopt -s extglob
                # remove files (2 commands for FEW)
                sudo rm -rf '$ADMIN_PATH/!(logs|config)'   && logINFO "-- Removal of app done" || logERROR "There was a problem with removing the app"
                # extract packages provided by PunchKick to correct folders
                #sudo tar -zxf $filename -C $ADMIN_PATH --strip=1 && echo "-- Package extracted" >> $LOGGING
                
		sudo tar -zxf $filename -C $ADMIN_PATH && logINFO "-- Package extracted" || logERROR "There was a problem with the package extraction"
		# Compare config files
                cd $ADMIN_PATH/config
                for string in $(grep -Eo '[a-Z].*:' $ADMIN_PATH/config/default.yml); do if ! grep -Fq "$string" $ADMIN_PATH/config/local.yml;then (logWARNING "\033[0;31m $string not found \033[0m \n" || logINFO "Default and local yml are equal");fi; done
                #echo "Please double check manually comparing the default.yml (provided in the package) with the local.yml and see if any new configuration was added."
                sudo chown -R apache:apache $ADMIN_PATH/  && logINFO "-- Chown into apache done" || logERROR "There was a problem with change owner"
		assets_phprestart
                #sudo /var/www/api/console assets:grab  && echo "-- Assets grab done" >> $LOGGING
                #sudo /usr/bin/systemctl restart php-fpm && echo "-- php-fpm restarted" >> $LOGGING
                sudo /usr/sbin/service httpd_admin restart  && logINFO "-- Admin service restarted" || logERROR "There was a problem with the restart"
		echo "END AT $(date)" | tee -a "${LOGFILE}"
                echo "--------------------------------------------------------" | tee -a "${LOGFILE}"

    


}

#-------------
# Function: Text User Interface
#-------------

function tui {
        echo "Which package do you want to deploy?"
        echo "1) FEW"
        echo "2) API"
        echo "3) ADMIN"
        read -p "Choose number:" OPT
        case $OPT in
                "1") echo "You chose FEw" ;;
                "2") echo "You chose API" ;;
                "3") echo "You chose ADMIN" ;;
        esac
        echo
        if [[ $OPT == '1' ]]; then
                action_few
        elif [[ $OPT == '2' ]]; then
		action_api 
        elif [[ $OPT == '3' ]]; then
                action_admin
        fi
}



BACKUP_PATH="/home/appsupp/backup/"



if [  "$1" != "" ]; then
         filename="$1"
fi


while [ "$2" != "" ]
do


        case $2 in
                few)   echo "-- you chose FEW package --" | tee -a "${LOGFILE}"
                        action_few "html"
                        shift 2
                        break
                        ;;
                api)   echo "-- you chose API package --" | tee -a "${LOGFILE}"
                        action_api "api"
                        shift 2
                        break
                        ;;
                admin) echo "-- you chose ADMIN package --" | tee -a "${LOGFILE}"
                        action_admin "admin"
                        shift 2
                        break
                        ;;
                *) echo "No parameters chosen" 2>&1
                 "$2" != ""#break
               ;;
        esac
done

