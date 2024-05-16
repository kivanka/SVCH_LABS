import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Input, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

function CardForm({ onSave, existingEq, isEditing, isFormOpen, setIsFormOpen }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [image, setImage] = useState('');
    const [dates, setdates] = useState(['']);

    useEffect(() => {
        if (isEditing && existingEq) {
            setName(existingEq.name);
            setStatus(existingEq.status);
            setImage(existingEq.image);
            setdates(existingEq.dates || ['']);
        }
    }, [isEditing, existingEq]);

    const handleClose = () => {
        setIsFormOpen(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFeatureChange = (index, value) => {
        const updateddates = [...dates];
        updateddates[index] = value;
        setdates(updateddates);
    };

    const addFeature = () => {
        setdates([...dates, '']);
    };

    const removeFeature = (index) => {
        setdates(dates.filter((_, i) => i !== index));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            name,
            status,
            image,
            dates: dates.filter(f => f)
        }, existingEq ? existingEq.id : null);

        if (!isEditing) {
            setName('');
            setStatus('');
            setImage('');
            setdates(['']);
        }
    };

    return (
        <Dialog open={isFormOpen} onClose={handleClose}>
            <DialogTitle>
                {isEditing ? 'Редактировать' : 'Добавить'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Название оборудования"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Select
                        label="Статус"
                        fullWidth
                        margin="normal"
                        displayEmpty
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <MenuItem value="" disabled>Выберите статус</MenuItem>
                        <MenuItem value="Исправен">Исправен</MenuItem>
                        <MenuItem value="Нуждается в обслуживании">Нуждается в обслуживании</MenuItem>
                        <MenuItem value="В ремонте">В ремонте</MenuItem>
                    </Select>
                    <Input
                        type="file"
                        onChange={handleImageChange}
                        fullWidth
                        margin="normal"
                    />
                    <div>
                        {dates.map((feature, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                <TextField
                                    label={`Дата тех обслуживания ${index + 1}`}
                                    fullWidth
                                    margin="normal"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    required={dates.length === 1}
                                />
                                {dates.length > 1 && (
                                    <IconButton onClick={() => removeFeature(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                        <Button startIcon={<AddCircleOutlineIcon />} onClick={addFeature}>
                            Добавить дату тех обслуживания
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary">
                        {isEditing ? 'Обновить' : 'Добавить'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default CardForm;
