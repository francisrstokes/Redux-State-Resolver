import React from 'react';
import {connect} from 'react-redux';

class UnconnectedReduxStateResolver extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      shouldUpdate: () => true,
      isSet: false,
      component: props.component
    }
  }

  shouldComponentUpdate() {
    return (this.state.isSet)
      ? this.state.shouldUpdate(this.props.reduxState)
      : true;
  }

  onUpdateOrMount() {
    const {resolvers, reduxState, dispatch, component} = this.props;

    for (const resolver of resolvers) {
      if (!resolver.test(reduxState)) {
        dispatch(resolver.action(reduxState));
        this.setState({
          ...this.state,
          shouldUpdate: resolver.test,
          isSet: true,
          component: resolver.component
        });
        return;
      }
    }

    if (this.state.isSet) {
      this.setState({
        ...this.state,
        isSet: false,
        component
      });
    }
  }

  componentDidMount() {
    this.onUpdateOrMount();
  }

  componentDidUpdate() {
    this.onUpdateOrMount();
  }

  render() {
    const ReduxStateResolverResult = this.state.component;
    return <ReduxStateResolverResult />
  }
}

export const ReduxStateResolver = connect(
  reduxState => ({reduxState}),
  dispatch => ({dispatch})
)(UnconnectedReduxStateResolver);