# Testing

When you use a spy, a stub or a mock, you have to make sure you're using them to test the behaviour/outcome of something.

I.e. you should use a stub to create a canned response, if doing so lets you test the behaviour of something else.

## Libraries

node-mocks-http makes you create more sophisticated req and res objects for your tests. They're useful for headers, cookies or streams.

nock lets you mock HTTP calls in isolation, which is particularly good for microservices.

## Jest

In Jest, the api makes it difficult to see what is a spy, stub and a mock.

```ts
const spy = jest.spyOn() // spy 

const stub = jest.spyOn() 
stub.mockReturnValue()
stub.mockImplementation()
```
