django_angularjs_bootstrap_layout
=================================

Functional and minimal layout with Django, AngularJS and Twitter Bootstrap

{{ project_name }}
=================

django-admin.py startproject --template=https://codeload.github.com/ericson-cepeda/django_angularjs_bootstrap_layout/zip/master --extension=py,md,gitignore,jade project_name

npm install cssmin stylus coffee-script
python manage.py syncdb
python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000