import React, { Component } from 'react';

const Search = () => {
    return (
        <div className='row'>
            <div className='col'>
                <form className='form-group' onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-8'>
                            <input
                                className='form-control'
                                type='text'
                                id='firstName'
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                                required
                            />
                        </div>
                        <div className='col-4'>
                            <button className='btn btn-primary m-2'>Search</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Search;
