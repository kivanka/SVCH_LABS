import React from 'react';
import '../styles/CharacterCard.css';

class CharacterCard extends React.Component {
  render() {
    const { character } = this.props;
    return (
      <div className="character-card">
        <img src={character.image} alt={character.name} />
        <p>{character.name}</p>
      </div>
    );
  }
}

export default CharacterCard;
