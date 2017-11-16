export const select = (state = {}, action) => {
    switch (action.type) {
        case 'SELECTED':
            return action.id;
        default:
            return state;
    }
};

export const draw = (state = false, action) => {
    switch (action.type) {
        case 'CANVAS':
            return action.boole;
        default:
            return state;
    }
};

