# Sinon

## Spies

Spies are functions that record information about their calls. 

They record number of times a function was called, the arguments they received, and the return values. 

"How many times was this called?" or "was this called with the correct number of arguments?".

```ts
const sinon = require('sinon');

function add(a, b) {
  return a + b;
}

const spy = sinon.spy(add);

const result = spy(1, 2);

console.log(spy.callCount); // 1
console.log(spy.calledWith(1, 2)); // true
console.log(spy.returnValues[0]); // 3
```

## Stubs

Stubs are functions that replace the original function with a custom implementation. 

They can control a function's behavior during testing, such as forcing it to throw an error or return a specific value.

Stubs are useful when you want to isolate a part of your code from its dependencies and focus on testing the behavior of that part in response to different inputs.

```ts
const sinon = require('sinon');

function fetchData(callback) {
  // Simulating an asynchronous API call
  setTimeout(() => {
    callback(null, { data: "Success" });
  }, 100);
}

const stub = sinon.stub();

// Make the stub return a specific value
stub.callsArgWith(0, null, { data: "Stubbed data" });

fetchData(stub);

setTimeout(() => {
  console.log(stub.callCount); // 1
  console.log(stub.args[0]); // [null, { data: 'Stubbed data' }]
}, 200);
```

## Mocks 

They're like spies because they record info about function calls.
They're like stubs because they let you replace an implementation.

In Sinon, they also let you state expectations UPFRONT about how they should be used.
This makes your test more brittle, because instead of asserting stuff after the fact (in a spy or stub),
they force things to be true upfront and they will fail if their conditions aren't met.
This usually means they have to know more implementation details in order to setup. 

So you should use mocks sparingly, and are often applied to the whole unit in a unit test.

```ts
const sinon = require('sinon');

const myApi = {
  fetchData: function (callback) {
    // Simulating an asynchronous API call
    setTimeout(() => {
      callback(null, { data: "Success" });
    }, 100);
  },
};

const mock = sinon.mock(myApi);

// Set expectations on how the function should be called
mock.expects('fetchData').once().callsArgWith(0, null, { data: "Mocked data" });

myApi.fetchData((err, data) => {
  console.log(data); // { data: 'Mocked data' }

  // Verify that the expectations were met
  mock.verify();
});
```