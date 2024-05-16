import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    equipments: [],
    selectedIds: new Set(),
    searchTerm: '',
    filterStatus: '',
    isFormOpen: false,
    editingEq: null,
};

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {
        setEquipment(state, action) {
            state.equipments = action.payload;
        },
        toggleSelect(state, action) {
            if (state.selectedIds.has(action.payload)) {
                state.selectedIds.delete(action.payload);
            } else {
                state.selectedIds.add(action.payload);
            }
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setFilterStatus(state, action) {
            state.filterStatus = action.payload;
        },
        setIsFormOpen(state, action) {
            state.isFormOpen = action.payload;
        },
        setEditingEq(state, action) {
            state.editingEq = action.payload;
        },
        addOrUpdateEquipment(state, action) {
            const { equipmentData, id } = action.payload;
            if (id) {
                state.equipments = state.equipments.map(equipment =>
                    equipment.id === id ? { ...equipment, ...equipmentData } : equipment
                );
            } else {
                state.equipments.push({ ...equipmentData, id: Date.now() });
            }
            state.isFormOpen = false;
            state.editingEq = null;
        },
        removeSelectedEquipments(state) {
            state.equipments = state.equipments.filter(
                equipment => !state.selectedIds.has(equipment.id)
            );
            state.selectedIds = new Set();
        },
    },
});

export const {
    setEquipment,
    toggleSelect,
    setSearchTerm,
    setFilterStatus,
    setIsFormOpen,
    setEditingEq,
    addOrUpdateEquipment,
    removeSelectedEquipments,
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
