import React from 'react';

export class ReduxStateResolver extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      stateSelector: () => true,
      resolveInProgress: false,
      component: props.component
    };

    this.wait = false;
    this.unsubscribeStore = () => null;
  }

  componentDidMount() {
    const {store} = this.props;
    this.unsubscribeStore = store.subscribe(() => {
      if (!this.wait && !this.state.resolveInProgress || (this.state.resolveInProgress && this.state.stateSelector(store.getState()))) {
        this.update();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  componentWillMount() {
    this.update();
  }

  update() {
    const {resolvers, store, component} = this.props;
    const {dispatch} = store;
    const reduxState = store.getState();

    for (const resolver of resolvers) {
      if (!resolver.select(reduxState)) {
        this.wait = true;
        dispatch(resolver.action(reduxState));

        this.setState({
          ...this.state,
          stateSelector: resolver.select,
          resolveInProgress: true,
          component: resolver.intermediateComponent
        }, () => {
          this.wait = false;
        });
        return;
      }
    }

    if (this.state.resolveInProgress) {
      return this.setState({
        ...this.state,
        resolveInProgress: false,
        component
      });
    }
  }


  render() {
    const ReduxStateResolverResult = this.state.component;
    return <ReduxStateResolverResult />
  }
}
