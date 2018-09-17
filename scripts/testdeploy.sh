#!/bin/bash
#!/usr/bin/expect
echo $(date) 'prova deployment'
echo $(date) $1
echo $(date) $2
echo $(date) $package
#funziona ma chiede psw, has to be tested on pxy towards mob06
#scp -i /c/Users/Alex.Buaiscia/.ssh/id_rsa /c/users/alex.buaiscia/Documents/Developing/PKI_node/uploads/try.sql alex.buaiscia@appsupp@mob06-us32c9.us.infra@10.80.8.17:/home/appsupp/

cp -v /c/users/alex.buaiscia/Documents/Developing/PKI_node/uploads/$1 /c/users/alex.buaiscia/Documents/Developing/PKI_node/


