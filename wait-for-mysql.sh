#!/bin/sh
# wait-for-mysql.sh

set -e

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u "root" -e ";"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 2
done

mysql -h "$host" -u "root" -e "set global sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';"

>&2 echo "MySQL is up - executing command"
exec $cmd