# install frontend and backend dependencies
install:
	cd ./frontend && npm i && cd - \
	cd backend && ./gradlew build && cd -