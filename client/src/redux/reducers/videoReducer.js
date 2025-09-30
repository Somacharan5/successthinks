import {
    PRODUCT_VIDEOS_LOADED,
    TRAINING_VIDEOS_LOADED
} from '../actions/types';


const initialState = {
    productVideos: [],
    trainingVideos: []
};

function videoReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case PRODUCT_VIDEOS_LOADED:
            return {
                ...state,
                productVideos: payload
            };
        case TRAINING_VIDEOS_LOADED:
            return {
                ...state,
                trainingVideos: payload
            };
        default:
            return state;
    }
}

export default videoReducer;
