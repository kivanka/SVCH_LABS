import React from 'react';

class LoadMoreButton extends React.Component {
  render() {
    return <button onClick={this.props.onLoadMore}>Load More</button>;
  }
}

export default LoadMoreButton;
