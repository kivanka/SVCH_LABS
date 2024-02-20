import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function HomePage() {
    return (
        <Container component={Paper} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h3" gutterBottom>
                Тут мы контролируем чтоб все работало
            </Typography>
            <Typography variant="body1">
                Здесь все станки буду работать!
            </Typography>
        </Container>
    );
}

export default HomePage;