import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchEquipment,
    toggleSelect,
    setSearchTerm,
    setFilterStatus,
    setIsFormOpen,
    setEditingEq,
    addOrUpdateEquipment,
    removeSelectedEquipments,
} from '../../store/equipmentSlice';
import EquipmentCard from '../Card/EqCard';
import CardForm from '../CardForm/CardForm';
import { Container, Grid, Button, TextField, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function EquipmentPage() {
    const dispatch = useDispatch();
    const {
        equipments,
        selectedIds,
        searchTerm,
        filterStatus,
        isFormOpen,
        editingEq,
    } = useSelector(state => state.equipment);

    useEffect(() => {
        dispatch(fetchEquipment());
    }, [dispatch]);

    const handleAddClick = () => {
        dispatch(setEditingEq(null));
        dispatch(setIsFormOpen(true));
    };

    const handleEditClick = () => {
        const selectedIdArray = Array.from(selectedIds);
        if (selectedIdArray.length === 1) {
            const equipmentToEdit = equipments.find(equipment => equipment.id === selectedIdArray[0]);
            dispatch(setEditingEq(equipmentToEdit));
            dispatch(setIsFormOpen(true));
        } else {
            alert("Выберите одну карточку для редактирования");
        }
    };

    const handleSearchChange = (event) => {
        dispatch(setSearchTerm(event.target.value));
    };

    const handleFilterChange = (event) => {
        dispatch(setFilterStatus(event.target.value));
    };

    const filteredEquipments = equipments.filter(equipment =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus ? equipment.status === filterStatus : true)
    );

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <TextField
                        label="Поиск оборудования"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Grid>
                <Grid item>
                    <Select
                        label="Фильтр по статусу"
                        value={filterStatus}
                        onChange={handleFilterChange}
                        displayEmpty
                    >
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="Исправен">Исправен</MenuItem>
                        <MenuItem value="Нуждается в обслуживании">Нуждается в обслуживании</MenuItem>
                        <MenuItem value="В ремонте">В ремонте</MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                        Добавить
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" startIcon={<EditIcon />} onClick={handleEditClick} disabled={selectedIds.size !== 1}>
                        Редактировать
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => dispatch(removeSelectedEquipments())}>
                        Удалить
                    </Button>
                </Grid>
            </Grid>
            {isFormOpen && (
                <CardForm
                    onSave={(equipmentData, id) => dispatch(addOrUpdateEquipment({ equipmentData, id }))}
                    existingEq={editingEq}
                    isFormOpen={isFormOpen}
                    setIsFormOpen={(isOpen) => dispatch(setIsFormOpen(isOpen))}
                />
            )}
            <Grid container spacing={2}>
                {filteredEquipments.map(equipment => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={equipment.id}>
                        <EquipmentCard
                            equipment={equipment}
                            isSelected={selectedIds.has(equipment.id)}
                            toggleSelect={() => dispatch(toggleSelect(equipment.id))}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default EquipmentPage;