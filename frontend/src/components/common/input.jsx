import React, { Component } from 'react';

const Input = React.forwardRef(({ name, label, value, onChange, type, placeholder }, ref) => {
    return (
        <div className='form-outline mb-4'>
            <label className='form-label'>{label}</label>

            <input
                className='form-control'
                onChange={onChange}
                name={name}
                value={value}
                type={type}
                id={name}
                ref={ref}
                placeholder={placeholder}
            />
        </div>
    );
});

export default Input;
