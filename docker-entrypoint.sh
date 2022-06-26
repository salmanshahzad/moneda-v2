chmod +x wait-for-it.sh
./wait-for-it.sh "db:5432"
exec "$@"
