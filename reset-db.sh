#!/bin/sh
# reset-db.sh

host="db"

mysql -h "$host" -u "root" -e "DROP DATABASE app; CREATE DATABASE app;"
mysql -h "$host" -u "root" < ./database/tshirtshop.sql

echo "DB has been reset."