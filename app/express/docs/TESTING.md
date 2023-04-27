# Testing

When you use a spy, stub or mock, make sure you're using them to test the behaviour/outcome of something else.

Best explanation for spy, stub and mock are on [sinon](https://sinonjs.org/releases/v15/)

## Libraries

node-mocks-http mocking req and res for middleware (particularly useful for headers, cookies or streams).
nock mocks HTTP calls (particularly good for microservices).
