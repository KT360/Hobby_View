import { createSlice } from '@reduxjs/toolkit';
import React from 'react';

//(React Redux)
//The "Window" component manages the current page state
//updates it and returns the updated value for use
export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        value: { imagePath:"random image path", name:"", title:"Dev/User", notes:"", index:0},
    },

    reducers: {
        update_form: (state, action) =>
        { 

            const newState =  {
                ...state,
                value:{
                    ...state.value,
                    ...action.payload
                } ,
            };

            console.log("New state: "+ JSON.stringify(newState));
            return newState;
        }
               
    },

})

export const {update_form} = modalSlice.actions;

export default modalSlice.reducer