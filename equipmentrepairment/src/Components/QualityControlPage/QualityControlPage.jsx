import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function QualityControlPage() {
    return (
        <Container>
            <Typography variant="h3" component="h1" gutterBottom>
                Учет работоспособности станков
            </Typography>
            <Typography variant="body1">
                На нашем предприятии все будет как надо!
            </Typography>
            
            <Paper style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Станки должны работать!
                </Typography>
            </Paper>
            
            <Paper style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Слава труду!
                </Typography>
            </Paper>
            
        </Container>
    );
}

export default QualityControlPage;
