#!/bin/bash

tmux new -s Session1 -n "console"\; new-window -n "cloud9" 'c9.sh' \; new-window -n "mysql" 'mysql -uroot -pmypassword -h mysqlName -P 3306' \; new-window -n "console" \; \
new-window -n 'Oraclize Bridge' \
"echo -e '\n \n ############### Oraclize Bridge ############### \n \n'  && \
cd /src/ethereum-bridge && node bridge -a 25" \
new-window -n 'api' \
"figlet Blockinfinity Karlsruhe && \
echo -e '\n \n ############### Deploy Contracts ############### \n \n'  && \
cd /src/truffle/ && truffle deploy --network container && \
echo -e '\n \n ############### Test Api ############### \n \n'  && \
cd /src/swagger && swagger project test && \
echo -e '\n \n ############### Run Api ############### \n \n'  && \
swagger project start" \;  