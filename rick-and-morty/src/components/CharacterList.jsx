import React from 'react';
import CharacterCard from './CharacterCard';
import '../styles/CharacterList.css';

class CharacterList extends React.Component {
    state = {
        characters: [],
        isLoading: true,
    };

    componentDidUpdate(prevProps) {
        if (this.props.gender !== prevProps.gender || this.props.page !== prevProps.page) {
            this.fetchCharacters();
        }
    }

    componentDidMount() {
        this.fetchCharacters();
    }

    fetchCharacters = () => {
        const { gender, page } = this.props;
        let url = 'https://rickandmortyapi.com/api/character/?page=' + page;
        if (gender !== 'all') {
            url += `&gender=${gender}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (page === 1) {
                    this.setState({ characters: data.results, isLoading: false });
                } else {
                    this.setState((prevState) => ({
                        characters: [...prevState.characters, ...data.results],
                        isLoading: false,
                    }));
                }
            });
    };

    render() {
        const { characters, isLoading } = this.state;
        return (
            <div className="character-list-container"> {/* Добавлен CSS-класс */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    characters.map((character) => <CharacterCard key={character.id} character={character} />)
                )}
            </div>
        );
    }
}

export default CharacterList;
