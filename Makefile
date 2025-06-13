.PHONY: git venv

all: venv db start

git:
	@git config --global user.email ""
	@git config --global user.name "hick-hpe"

venv:
	@python3 -m venv venv
	@. venv/bin/activate

bd:
	@cd professorhub && python manage.py makemigrations && python manage.py migrate

install:
	@cd professorhub && pip install -r requirements.txt

run:
	@cd professorhub && python manage.py runserver

start: bd install run
