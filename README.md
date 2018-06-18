# Redux State Resolver

💡 Redux State Resolver cleanly resolves a sequence of dependencies, allowing you to write view logic that can assume the state has what it needs.

```javascript
const loginResolver = {
  test: state => state.isLoggedIn,
  action: () => push('/login'),
  component: () => null
};

const profileResolver = {
  test: state => state.user.profile,
  action: state => getProfile(state.user.id, state.authToken),
  component: () => <div>Loading profile...</div>
};

<ReduxStateResolver
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
  // The test function recieves state, and returns
  // false if the dependency still needs to be resolved
  test: state => state.user.profile,

  // The action function is called if the test function returns false.
  // It is passed state, and should return an action, which is dispatched.
  action: state => actionCreator(state.aThing),

  // The component is a React component that is rendered while waiting for
  // the dependency to be resolved in state.
  component: () => <div>Loading...</div>
}
```

