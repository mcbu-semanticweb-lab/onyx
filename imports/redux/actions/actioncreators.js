import { push } from 'redux-little-router';

export const select = function(id) {
    return {
        type : "SELECTED",
        id : id
    }
};


export const draw = function (boole) {
    return{
        type: "CANVAS",
        boole : boole
    }
};
