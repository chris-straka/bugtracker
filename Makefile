# install frontend and backend dependencies
install:
	cd ./frontend && npm i && cd - \
	cd backend && ./gradlew build && cd -

### NERDCTL ### 
nerdctl-build-frontend:
	cd ./frontend && nerdctl build -t frontend . && cd - 

nerdctl-build-backend:
	cd ./backend && nerdctl build -t backend . && cd - \

nerdctl-build:
	docker-build-frontend && docker-build-backend

# 4200 my computer, 80 container
nerdctl-run-frontend:
	cd ./frontend && nerdctl run -p 4200:80 frontend && cd - 

nerdctl-run-backend:
	cd ./backend && nerdctl run backend && cd -

nerdctl-run:
	nerdctl-run-frontend && nerdctl-run-backend