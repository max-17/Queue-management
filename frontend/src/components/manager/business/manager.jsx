import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListBusinesses from './list';
import CreateBusiness from './create';
import BusinessEdit from './edit';
import ServiceList from '../../customer/service/serviceList';
import CreateService from '../service/create';

const Manager = () => {
    return (
        <Routes>
            {/* <Route path='/' element={<ListBusinesses />} /> */}
            {/* <Route path='/:businessId' element={<BusinessEdit />} /> */}
            <Route path='/new' element={<CreateBusiness />} />
            <Route path='/:businesId/services' element={<ServiceList />} />
            <Route path='/:businessId/services/new' element={<CreateService />} />
            <Route path='/:businessId/services/:serviceId' element={<CreateService />} />
        </Routes>
    );
};

export default Manager;
