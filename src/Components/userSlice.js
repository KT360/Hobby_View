import { createSlice } from '@reduxjs/toolkit';

//(React Redux)
//The "Window" component manages the current page state
//updates it and returns the updated value for use
export const userSlice = createSlice({
    name: 'CurrentUser',
    initialState: {
        value: {name: "", uid:""},
    },

    reducers: {
        set_user: (state, action) =>
        { 

            const newState =  {
                ...state,
                value:{
                    ...state.value,
                    ...action.payload
                } ,
            };
            
            return newState;
        }
               
    },

})

export const {set_user} = userSlice.actions;

export default userSlice.reducer