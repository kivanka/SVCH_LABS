import React, { useState, useEffect } from 'react';
import CertificationequipmentCard from '../Card/EqCard';
import CardForm from '../CardForm/CardForm';
import { Container, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function EquipmentPage() {
    const [equipments, setEquipment] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEq, seteditingEq] = useState(null);

    useEffect(() => {
        fetch('/data/equipment.json')
            .then(response => response.json())
            .then(data => setEquipment(data))
            .catch(error => console.error("Ошибка при загрузке оборудования:", error));
    }, []);

    const addOrUpdateEquipment = (equipmentData, id) => {
        if (id) {
            setEquipment(prevEquipment =>
                prevEquipment.map(equipment => equipment.id === id ? { ...equipment, ...equipmentData } : equipment)
            );
        } else {
            setEquipment(prevEquipment => [...prevEquipment, { ...equipmentData, id: Date.now() }]);
        }
        setIsFormOpen(false);
        seteditingEq(null);
    };

    const handleAddClick = () => {
        seteditingEq(null);
        setIsFormOpen(true);
    };

    const handleEditClick = () => {
        const selectedIdArray = Array.from(selectedIds);
        if (selectedIdArray.length === 1) {
            const equipmentToEdit = equipments.find(equipment => equipment.id === selectedIdArray[0]);
            seteditingEq(equipmentToEdit);
            setIsFormOpen(true);
        } else {
            alert("Выберите одну карточку для редактирования");
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prevSelectedIds => {
            const newSelectedIds = new Set(prevSelectedIds);
            if (newSelectedIds.has(id)) {
                newSelectedIds.delete(id);
            } else {
                newSelectedIds.add(id);
            }
            return newSelectedIds;
        });
    };

    const removeSelectedEquipments = () => {
        setEquipment(prevEquipment => prevEquipment.filter(equipment => !selectedIds.has(equipment.id)));
        setSelectedIds(new Set());
    };

    return ( 
        <Container maxWidth="lg">
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
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
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={removeSelectedEquipments}>
                        Удалить
                    </Button>
                </Grid>
            </Grid>
            {isFormOpen && (
                <CardForm 
                    onSave={addOrUpdateEquipment} 
                    existingUquipment={editingEq} 
                    isFormOpen={isFormOpen} 
                    setIsFormOpen={setIsFormOpen}
                />
            )}
            <Grid container spacing={2}>
                {equipments.map(equipment => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={equipment.id}>
                        <CertificationequipmentCard 
                            equipment={equipment} 
                            isSelected={selectedIds.has(equipment.id)}
                            toggleSelect={toggleSelect} 
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default EquipmentPage;