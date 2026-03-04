Django
Comando para crear un venv o .venv
[python o python3] -m venv NombreVenv [venv o .venv]
Windows:
.[venv o .venv]\Scripts\activate
Linux/IOS/Debian/...:
source ./[venv o .venv]/[bin o lib]/activate
Crear un proyecto de django
Primero comprobamos que [venv o .venv] que está activo en la terminal.
pip: Usamos esta herramienta para instalar dependencias
pip install django
Esto nos creará La carpeta de configuración y manage.py
Creamos assets/static, assets/media, templates, y .env.
Configuración del proyecto:
Lo primero es instalar la librería de lectura de variables del .env:
pip install python-decouple
pip install python-dotenv (Funciona importando os)
Comandos que se usan en un proyecto
django-admin startproject NombreProyecto (Recordad que para ejecutar esto hay que instalar django)

pip install django
pip install python-decouple (Librería para leer variables secretas en archivos .env)
python manage.py makemigrations

python manage.py migrate

python manage.py runserver

python manage.py runserver 0.0.0.0:8000 -> Este comando lo usaremos para que Django permita conexiones externas por API

python manage.py createsuperuser

python manage.py startapp NombreApp

Comandos para migrar/transportar un proyecto a otro PC
Para transportar este proyecto a otro PC, crearemos un archivo requirements.txt:

Nos posicionamos dentro de la carpeta raiz del proyecto.
Introducimos el comando para crear requirements: pip freeze > requirements.txt
Comprimimos todos los archivos y carpetas de django. Las únicas que no comprimiremos será venv o .venv y los del IDLE.
Comandos para instalar e iniciar un proyecto en un PC
Para iniciar este proyecto:

Creamos venv
Entramos en el venv.
Nos posicionamos en la carpeta Raíz, donde está .env, requirements.txt, etc
escribimos:
pip install -r requirements.txt
Comandos para trabajar con servicios REST API
pip install django-cors-headers (Esto es la forma de verificar en producción el servidor y la web)
pip install djangorestframework (Permite trabajar con Django como si fuera un servicio REST API)
pip install djangorestframework-simplejwt (Da un token el cual se usará para saber si un usuarioe está loggeado o no)
pip install pillow (Esto es para subir, descargar, actualizar, etc. imágenes y archivos).
Vamos a configuración para implementar lo instalado.