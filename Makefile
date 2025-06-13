.PHONY: git venv

all: venv db start

git:
	@echo "Configuring Git user email and name..."
	@read -p "Enter your Git email: " EMAIL_VAR
	@read -p "Enter your Git name: " NAME_VAR
	git config --global user.email "$$EMAIL_VAR"; \
	git config --global user.name "$$NAME_VAR"
	@echo "Olá, $$NAME_VAR: $$EMAIL_VAR"

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
