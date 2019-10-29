#!/bin/bash
#echo $(date) 'prova deployment'
#echo $(date) $1
#echo $(date) $2
#echo $(date) $3
#funziona ma chiede psw, has to be tested on pxy towards mob06
#scp -i /c/Users/Alex.Buaiscia/.ssh/id_rsa /c/users/alex.buaiscia/Documents/Developing/PKI_node/uploads/try.sql alex.buaiscia@appsupp@mob06-us32c9.us.infra@10.80.8.17:/home/appsupp/
cp -v /var/www/html/newPKI/uploads/$1 /var/www/html/newPKI/$1
