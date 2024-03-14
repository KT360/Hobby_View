import { configureStore } from '@reduxjs/toolkit';
import windowReducer from './Components/Window/windowSlice';
import modalReducer from './Components/Uploading/modalSlice';
import pageReducer from './Components/Pages/pageSlice';
import modeReducer from './Components/Uploading/modeSlice';
import userReducer from './Components/userSlice';
import cardReducer from './Components/Applications/cardSlice';

//Storage element that helps the app acess configured states in 
//Slices
export default configureStore({
    reducer: {
        window: windowReducer,
        modal: modalReducer,
        update_page: pageReducer,
        loading: modeReducer,
        CurrentUser: userReducer,
        selected: cardReducer
    },
});