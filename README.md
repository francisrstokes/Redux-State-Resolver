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
