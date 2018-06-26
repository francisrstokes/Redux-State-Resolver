import React from 'react';
import { shallow, mount} from 'enzyme';
import {Fail2Component, FailComponent, SuccessComponent} from './mock-components';
import {ReduxStateResolver} from '../src';
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

test('Render the main component when no resolvers are provided (component)', () => {
  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={store}
      resolvers={[]}
      component={SuccessComponent}
    />
  );
  expect(reduxStateResolver.text()).toEqual('Success');
});

test('Render the main component when no resolvers are provided (render prop)', () => {
  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={store}
      resolvers={[]}
      render={() => <SuccessComponent/>}
    />
  );
  expect(reduxStateResolver.text()).toEqual('Success');
});

test('Render the main component when no resolvers are provided (children render prop)', () => {
  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={store}
      resolvers={[]}
    >
      {() => <SuccessComponent/>}
    </ReduxStateResolver>
  );
  expect(reduxStateResolver.text()).toEqual('Success');
});

test('Render the main component when no resolvers are provided (children)', () => {
  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={store}
      resolvers={[]}
    >
      <SuccessComponent/>
    </ReduxStateResolver>
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

test('Renders resolver component (component)', () => {
  const resolvers = [
    {
      select: ({fortyTwo}) => fortyTwo === 41,
      action: () => {},
      component: FailComponent
    }
  ];

  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={storeWithMockedDispatch}
      resolvers={resolvers}
      component={SuccessComponent}
    />
  );

  expect(reduxStateResolver.text()).toEqual('Fail');
});

test('Renders resolver component (intermediateComponent)', () => {
  const resolvers = [
    {
      select: ({fortyTwo}) => fortyTwo === 41,
      action: () => {},
      component: FailComponent
    }
  ];

  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={storeWithMockedDispatch}
      resolvers={resolvers}
      intermediateComponent={SuccessComponent}
    />
  );

  expect(reduxStateResolver.text()).toEqual('Fail');
});

test('Renders resolver component (render prop)', () => {
  const resolvers = [
    {
      select: ({fortyTwo}) => fortyTwo === 41,
      action: () => {},
      component: FailComponent
    }
  ];

  const reduxStateResolver = mount(
    <ReduxStateResolver
      store={storeWithMockedDispatch}
      resolvers={resolvers}
      render={() => <SuccessComponent/>}
    />
  );

  expect(reduxStateResolver.text()).toEqual('Fail');
});

test('Throw error when given a bad resolver (bad action creator)', () => {
  // Supress expected errors in output
  spyOn(console, 'error');

  expect(() => {
    const reduxStateResolver = mount(
      <ReduxStateResolver
        store={storeWithMockedDispatch}
        resolvers={[
          {
            select: () => false,
            action: { not: 'a function' },
            render: () => <FailComponent/>
          }
        ]}
        component={SuccessComponent}
      />
    );
  }).toThrow();

  expect(() => {
    const reduxStateResolver = mount(
      <ReduxStateResolver
        store={storeWithMockedDispatch}
        resolvers={[
          {
            select: () => false,
            syncAction: { not: 'a function' },
            render: () => <FailComponent/>
          }
        ]}
        component={SuccessComponent}
      />
    );
  }).toThrow();
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

  expect(() => {
    const reduxStateResolver = mount(
      <ReduxStateResolver
        store={storeWithMockedDispatch}
        resolvers={[
          {
            select: () => false,
            action: () => {},
            render: notComponent
          }
        ]}
        component={SuccessComponent}
      />
    );
  }).toThrow();
});
