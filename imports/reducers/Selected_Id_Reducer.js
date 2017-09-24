export default function (state = {}, action) {
    if(action===undefined)
        return null;
    switch (action.type) {
        case 'SELECTED':
            return action.payload;
        default:
            return null;
    }
}