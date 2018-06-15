import React from 'react';
import {connect} from 'react-redux';

class UnconnectedReduxStateResolver extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      shouldUpdate: () => true,
      isSet: false,
      component: () => null
    }
  }

  shouldComponentUpdate() {
    return (this.state.isSet)
      ? this.state.shouldUpdate(this.props.store)
      : true;
  }

  static getDerivedStateFromProps(props, state) {
    const {resolvers, store, dispatch, component} = props;

    for (const resolver of resolvers) {
      if (!resolver.test(store)) {
        dispatch(resolver.action(store));
        return {
          ...state,
          shouldUpdate: resolver.test,
          isSet: true,
          component: resolver.component
        };
      }
    }

    return {
      ...state,
      isSet: false,
      component
    };
  }

  render() {
    const ReduxStateResolverResult = this.state.component;
    return <ReduxStateResolverResult />
  }
}

export const ReduxStateResolver = connect(
  store => ({store}),
  dispatch => ({dispatch})
)(UnconnectedReduxStateResolver);