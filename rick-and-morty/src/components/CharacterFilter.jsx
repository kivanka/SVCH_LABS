import React from 'react';

class CharacterFilter extends React.Component {
  handleChange = (event) => {
    this.props.onFilterChange(event.target.value);
  };

  render() {
    return (
      <select value={this.props.gender} onChange={this.handleChange}>
        <option value="all">All</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="genderless">Genderless</option>
        <option value="unknown">Unknown</option>
      </select>
    );
  }
}

export default CharacterFilter;
