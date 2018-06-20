import React from 'react';
import { shallow, mount} from 'enzyme';
import {Fail2Component, FailComponent, SuccessComponent} from './mock-components';
import {ReduxStateResolver} from '../src/lib';
import configureTests from './configure-tests';

const {mockStore} = configureTests();
const initialState = { fortyTwo: 42 };

let wrapper;
let store;
let storeWithMockedDispatch;

beforeEach(() => {
  store = mockStore(initialState);
  storeWithMockedDispatch = {
    ...store,
    dispatch: () => {}
  };
});

test('Render the main component when no resolvers are provided', () => {
  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={store}
      resolvers={[]}
      component={SuccessComponent}
    />
  );
  expect(reduxStateResolver.text()).toEqual('Success');
});

test('Call dispatch with the action creator function when a value is unresolved', () => {
  let dispatchCalled = false;
  let actionCalled = false;

  const storeWithSpyedDispatch = {
    ...store,
    dispatch: () => {
      dispatchCalled = true;
    }
  };

  const resolver = {
    select: ({fortyTwo}) => fortyTwo === 41,
    action: () => {
      actionCalled = true;
    },
    intermediateComponent: FailComponent
  };

  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={storeWithSpyedDispatch}
      resolvers={[
        resolver
      ]}
      component={SuccessComponent}
    />
  );

  expect(dispatchCalled).toEqual(true);
  expect(actionCalled).toEqual(true);
  expect(reduxStateResolver.text()).toEqual('Fail');
});

test('Renders as far into the resolver chain as possible', () => {
  const resolvers = [
    {
      select: ({fortyTwo}) => fortyTwo === 42,
      action: () => {},
      intermediateComponent: FailComponent
    },
    {
      select: ({fortyTwo}) => fortyTwo === 41,
      action: () => {},
      intermediateComponent: Fail2Component
    }
  ];

  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={storeWithMockedDispatch}
      resolvers={resolvers}
      component={SuccessComponent}
    />
  );

  expect(reduxStateResolver.text()).toEqual('Fail2');
});

test('Throw error when given a bad resolver (incorrect properties)', () => {
  // Supress expected errors in output
  spyOn(console, 'error');

  expect(() => {
    const reduxStateResolver = mount(
      <ReduxStateResolver
        store={storeWithMockedDispatch}
        resolvers={[
          {
            a: 'hello'
          }
        ]}
        component={SuccessComponent}
      />
    );
  }).toThrow();
});

test('Throw error when given a bad resolver (bad component)', () => {
  // Supress expected errors in output
  spyOn(console, 'error');
  const notComponent = () => /regex/;

  expect(() => {
    const reduxStateResolver = mount(
      <ReduxStateResolver
        store={storeWithMockedDispatch}
        resolvers={[
          {
            select: () => false,
            action: () => {},
            intermediateComponent: notComponent
          }
        ]}
        component={SuccessComponent}
      />
    );
  }).toThrow();
});
