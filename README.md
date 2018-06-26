# Redux State Resolver

[![npm version](https://badge.fury.io/js/redux-state-resolver.svg)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![CircleCI](https://img.shields.io/circleci/project/github/francisrstokes/Redux-State-Resolver.svg)]()

💡 Cleanly resolve a sequence of dependencies -  write component logic that can assume the state has what it needs.

- [Description](#description)
- [Installation](#installation)
- [API](#api)
  - [Component](#component)
    - [Component Prop](#component-prop)
    - [Children](#children)
    - [Child Render Prop](#child-render-prop)
    - [Render Prop](#render-prop)
  - [Resolver Object](#resolver-object)

## Description

ReduxStateResolver is a component that uses resolver objects to separate the checking of state dependencies from the components that use them, resulting in cleaner views and better code organisation.

It takes a list of resolver objects as a prop, and only renders the target component when all the resolvers pass. Otherwise an intermediate component associated with the missing dependency is rendered.

It works great with the routing layer, ensuring that view components can be written without a bunch of if statements checking for every permuation of missing state.

```javascript
const loginResolver = {
  select: state => state.isLoggedIn,
  action: () => push('/login'),
  render: () => <div>Redirecting to login...</div>
};

const profileResolver = {
  select: state => state.user.profile,
  action: state => getProfile(state.user.id, state.authToken),
  render: () => <div>Loading profile...</div>
};

<ReduxStateResolver
  store={store}
  resolvers={[
    loginResolver,
    profileResolver
  ]}
>
  <ViewComponentUsingProfile/>
</ReduxStateResolver>
```

## Installation

```bash
# with yarn
yarn add redux-state-resolver

# or with npm
npm i redux-state-resolver
```

## API

### Component

The component that is rendered when all dependencies are resolved can be specified multiple ways. Depending on your use case you may want to use one way or another.

#### Component prop

```javascript
<ReduxStateResolver
  store={store}
  resolvers={resolverList}
  component={ViewComponentUsingProfile}
/>
```

#### Children

```javascript
<ReduxStateResolver
  store={store}
  resolvers={resolverList}
>
  <ViewComponentUsingProfile/>
</ReduxStateResolver>
```

#### Child render prop

```javascript
<ReduxStateResolver
  store={store}
  resolvers={resolverList}
>
  {(state) => {
    return <ViewComponentUsingProfile userProfile={state.profile} />
  }}
</ReduxStateResolver>
```

#### Render prop

```javascript
<ReduxStateResolver
  store={store}
  resolvers={resolverList}
  render={(state) => {
    return <ViewComponentUsingProfile userProfile={state.profile} />
  }}
/>
```

### Resolver object

A resolver is just a plain javascript object with a few properties:

```javascript
{
  // The select function recieves state, and returns
  // false if the dependency still needs to be resolved
  select: state => state.user.profile,

  // The action function is called if the test function returns false.
  // It is passed state, and should return an action, which is dispatched.
  action: state => actionCreator(state.aThing),

  // Action creators are assumed to be asyncronously resolving - they do not
  // immediately update state. This is most often the case when the action starts
  // a http request.
  // If this is not the case, use a 'syncAction' creator instead.
  syncAction: state => actionCreator(state.aThing),

  // The component is a React component that is rendered while waiting for
  // the dependency to be resolved in state.
  // 'component' is aliased as 'intermediateComponent' as well.
  component: LoadingComponent,

  // You can use a render prop instead. The render function is passed the store
  // state as an argument
  render: (state) => {
    return <LoadingComponent someProp={state.somePartOfState} />
  },
}
```
