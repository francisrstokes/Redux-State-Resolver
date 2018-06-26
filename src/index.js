import React from 'react';
import PropTypes from 'prop-types';

const isEmptyChildren = children => React.Children.count(children) === 0;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

export class ReduxStateResolver extends React.Component {
  constructor (props) {
    super(props);
    const {store} = this.props;

    this.wait = false;
    this.state = { resolver: null };

    this.unsubscribeStore = store.subscribe(() => {
      const shouldUpdate = !(this.wait && this.state.resolver) ||
        (this.state.resolver && this.state.resolver.select(store.getState()));

      if (shouldUpdate) this.update();
    });
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  componentWillMount() {
    this.update();
  }

  update() {
    const {resolvers} = this.props;
    const {dispatch} = this.props.store;
    const reduxState = this.props.store.getState();

    for (const resolver of resolvers) {
      if (!resolver.select(reduxState)) {
        const actionCreator = resolver.syncAction || resolver.action;
        assert(
          typeof actionCreator === 'function',
          'action or syncAction property of a resolver must be a function'
        );

        this.wait = true;
        dispatch(actionCreator(reduxState));

        this.setState(
          () => ({ resolver }),
          () => {
            this.wait = false;
            if (resolver.syncAction) this.update();
          }
        );
        return;
      }
    }

    if (this.state.resolver) {
      return this.setState(() => ({ resolver: null }));
    }
  }

  render() {
    const {resolver} = this.state;
    const {children, render, store} = this.props;

    if (resolver) {
      // Render prop
      if (resolver.render) return resolver.render(store.getState());

      // Specified component
      const component = resolver.intermediateComponent || resolver.component;
      if (component) return React.createElement(component);

      return null;
    }

    // Render prop
    if (render) return render(store.getState());

    // Children as render prop
    if (typeof children === 'function') return children(store.getState());

    // Specified component
    if (this.props.component) return React.createElement(this.props.component);

    // Just children
    if (children && !isEmptyChildren(children)) return React.Children.only(children);

    return null;
  }
}

ReduxStateResolver.propTypes = {
  resolvers: PropTypes.arrayOf(PropTypes.shape({
    select: PropTypes.func.isRequired,
    action: PropTypes.func,
    syncAction: PropTypes.func,
    render: PropTypes.func,
    component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    intermediateComponent: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
  })).isRequired,
  store: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  render: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
};