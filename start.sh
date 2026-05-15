#!/bin/bash
echo "Directorio actual:"
pwd
echo "Ejecutando migrate..."
cd backend_temporada/backend_temporada && python manage.py migrate --verbosity 3 2>&1
echo "Creando superusuario..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@temporada.com', 'admin1234')
    print('Superusuario creado')
else:
    print('Superusuario ya existe')
" 2>&1
echo "Collecting static..."
python manage.py collectstatic --noinput 2>&1
echo "Arrancando gunicorn..."
gunicorn config.wsgi:application