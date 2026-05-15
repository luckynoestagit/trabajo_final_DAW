#!/bin/bash
echo "Directorio actual:"
pwd
echo "Ejecutando migrate..."
cd backend_temporada/backend_temporada && python manage.py migrate --verbosity 3 2>&1
echo "Collecting static..."
python manage.py collectstatic --noinput 2>&1
echo "Arrancando gunicorn..."
gunicorn config.wsgi:application