import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Popout({ equipment, closePopout }) {
    return (
        <Dialog open={Boolean(equipment)} onClose={closePopout} aria-labelledby="popout-dialog-title">
            <DialogTitle id="popout-dialog-title">
                {/* {equipment?.name}  */}
                Даты тех обсуживания
                <IconButton
                    aria-label="close"
                    onClick={closePopout}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {equipment?.dates.map((feature, index) => (
                        <ListItem key={index}>{feature}</ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default Popout;