# Redux State Resolver

💡 Redux State Resolver cleanly resolves a sequence of dependencies, allowing you to write view logic that can assume the state has what it needs.

```javascript
const loginResolver = {
  select: state => state.isLoggedIn,
  action: () => push('/login'),
  intermediateComponent: () => null
};

const profileResolver = {
  select: state => state.user.profile,
  action: state => getProfile(state.user.id, state.authToken),
  intermediateComponent: () => <div>Loading profile...</div>
};

<ReduxStateResolver
  store={store}
  resolvers={[
    loginResolver,
    profileResolver
  ]}
  component={ViewComponentUsingProfile}
>
```

## Installation

```bash
# with yarn
yarn add redux-state-resolver

# or with npm
npm i redux-state-resolver
```

## Resolve objects

A resolver is just a plain javascript object with 3 properties:

```javascript
{
  // The select function recieves state, and returns
  // false if the dependency still needs to be resolved
  select: state => state.user.profile,

  // The action function is called if the test function returns false.
  // It is passed state, and should return an action, which is dispatched.
  action: state => actionCreator(state.aThing),

  // The intermediateComponent is a React component that is rendered while waiting for
  // the dependency to be resolved in state.
  intermediateComponent: () => <div>Loading...</div>
}
```

