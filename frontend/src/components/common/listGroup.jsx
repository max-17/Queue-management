import React, { Component } from 'react';

const ListGroup = (props) => {
    const { items, valueProperty, textProperty, onItemSelect, selectedItem } = props;
    return (
        <div className='list-group' id='myList'>
            {items.map((item) => (
                <li
                    onClick={() => onItemSelect(item)}
                    key={item[valueProperty]}
                    className={item === selectedItem ? 'list-group-item active' : 'list-group-item'}
                >
                    {item[textProperty]}
                </li>
            ))}
        </div>
    );
};

ListGroup.defaultProps = {
    textProperty: 'name',
    valueProperty: 'id',
};

export default ListGroup;
