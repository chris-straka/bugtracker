# Install frontend and backend dependencies
install:
	cd ./frontend && npm i && cd - \
	cd backend && ./gradlew build && cd -

### NERDCTL ### 

## BUILD
nerdctl-build-frontend:
	cd ./frontend && nerdctl build -t frontend . && cd - 

nerdctl-build-backend:
	cd ./backend && nerdctl build -t backend . && cd - \

nerdctl-build:
	docker-build-frontend && docker-build-backend

## RUN
nerdctl-run-frontend:
	nerdctl run -p 4200:80 frontend 

nerdctl-run-backend:
	nerdctl run backend 

nerdctl-run:
	nerdctl-run-frontend && nerdctl-run-backend

## SHELL
nerdctl-shell-frontend:
	nerdctl run -it frontend sh

nerdctl-shell-backend:
	nerdctl run -it backend sh