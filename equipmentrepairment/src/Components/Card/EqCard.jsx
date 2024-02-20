import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import Popout from '../PopoutWindow/Popout';

function EquipmentCard({ equipment, isSelected, toggleSelect }) {
    const [isPopoutOpen, setIsPopoutOpen] = useState(false);

    const handleCardClick = () => {
        if (!isPopoutOpen) {
            toggleSelect(equipment.id);
        }
    };

    const togglePopout = (e) => {
        e.stopPropagation();
        setIsPopoutOpen(!isPopoutOpen);
    };

    const cardStyle = {
        maxWidth: 345, // Ширина карточки
        height: '100%', // Высота карточки
        margin: 'auto',
        border: isSelected ? '2px solid blue' : 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
    };

    const cardMediaStyle = {
        height: 140, // Высота изображения в карточке
    };

    return (
        <>
            <Card 
                onClick={handleCardClick}
                style={cardStyle}
            >
                <CardMedia
                    component="img"
                    style={cardMediaStyle}
                    image={equipment.image}
                    alt={equipment.name}
                />
                <CardContent style={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {equipment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {equipment.status}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={togglePopout}>Подробнее</Button>
                </CardActions>
            </Card>
            {isPopoutOpen && <Popout equipment={equipment} closePopout={togglePopout} />}
        </>
    );
}

export default EquipmentCard;