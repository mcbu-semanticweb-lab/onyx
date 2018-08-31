//User login control
export const isLoggedIn = function (boole) {
    return{
        type: "Login",
        boole : boole
    }
};


//Node select

export const select = function(id) {
    return {
        type : "SELECTED",
        id : id
    }
};

//Should canvas draw

export const draw = function (boole) {
    return{
        type: "CANVAS",
        boole : boole
    }
};


//Canvas animations

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

export const search = function () {
    return{
        type: "Search",
        boole : true,
        animation : "Search",
    }
};

export const showrestriction = function () {
    return{
        type: "ShowRestriction",
        boole : true,
        animation : "ShowRestriction",
    }
};

export const undo = function () {
    return{
        type: "Undo",
        boole : true,
        animation : "Undo",
    }
};

export const redo = function () {
    return{
        type: "Redo",
        boole : true,
        animation : "Redo",
    }
};

export const popup = function () {
    return{
        type: "Pop-up",
        boole : true,
        animation : "Pop-up",
    }
};


//UI animations

export const shownavigator = function () {
    return{
        type: "showNavigator"
    }
};

export const showsidebar = function () {
    return{
        type: "showSidebar"
    }
};

// Canvas history

export const addhistory = function (event) {
    return{
        type: "addHistory",
        event : event
    }
};




