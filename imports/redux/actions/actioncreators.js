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

export const showNeighborhood = function (boole) {
    return{
        type: "ShowNeighborhood",
        boole : boole,
        animation: "ShowNeighborhood"
    }
};

export const resetCanvas = function () {
    return{
        type: "ResetCanvas",
        boole : false,
        animation: "ResetCanvas"
    } //canvas reducer la birleşecek
};

export const pitfall = function (affected_elements) {
    return{
        type: "ShowPitfall",
        boole : true,
        animation : "ShowPitfalls",
        affected_elements : affected_elements,
    }
};

export const search = function (label) {
    return{
        type: "Search",
        boole : true,
        animation : "Search",
        label : label
    }
};

export const showrestriction = function (label) {
    return{
        type: "ShowRestriction",
        boole : true,
        animation : "ShowRestriction",
        label : label
    }
};

export const isLoggedIn = function (boole) {
    return{
        type: "Login",
        boole : boole
    }
};

