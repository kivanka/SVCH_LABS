import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tabs, Tab } from '@mui/material';
import EmployeeSection from './employeesAdminPage';
import MachineSection from './adminMachinesPage';
import { fetchEmployees } from '../redux/slices/employees';
import { fetchMachines } from '../redux/slices/machines';

const AdminPage = () => {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchMachines());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <div>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Сотрудники" />
                <Tab label="Оборудование" />
            </Tabs>
            {selectedTab === 0 && <EmployeeSection />}
            {selectedTab === 1 && <MachineSection />}
        </div>
    );
};

export default AdminPage;
