# Redux State Resolver

💡 Redux State Resolver is a react component that cleanly resolves a sequence of dependencies in state, so you can keep all that logic outside of your view component.

```javascript
<ReduxStateResolver
  resolvers={[
    {
      test: state => state.asyncItem !== null,
      action: () => asyncItemActionCreatorFunction,
      component: () => <div>Loading async item...</div>
    },
    {
      test: state => state.anotherAsyncItem !== null,
      action: state => anotherActionCreatorUsingState(state.userId),
      component: () => <div>Loading another item...</div>
    }
  ]}
  component={() => <div>All done!</div>}
>
```

