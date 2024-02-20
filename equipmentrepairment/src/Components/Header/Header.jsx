import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Все ли станки работают?
                </Typography>
                <Drawer
                    anchor="right"
                    open={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                >
                    <List>
                        <ListItem button component={RouterLink} to="/" onClick={() => setIsMenuOpen(false)}>
                            <ListItemText primary="Главная" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/certification-services" onClick={() => setIsMenuOpen(false)}>
                            <ListItemText primary="Контроль" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/quality-control" onClick={() => setIsMenuOpen(false)}>
                            <ListItemText primary="О нас" />
                        </ListItem>
                    </List>
                </Drawer>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuToggle}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
