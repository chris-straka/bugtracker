## Sinon

Spies are functions that record information about their calls. Namely the number of times they were called, the arguments they received, and their return values. They're useful when you want to ensure that a specific function is called with the correct arguments or a certain number of times.

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

Stubs are functions that replace the original function with a custom implementation. 
They can be used to control a function's behavior during testing, such as forcing it to throw an error or return a specific value.

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

Mocks are a combination of spies and stubs, providing both the ability to record information about function calls and replace their behavior. Mocks can be used when you have more complex testing requirements, such as setting expectations on how a function should be called and verifying that those expectations are met.

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