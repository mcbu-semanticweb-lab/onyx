export function showNeighborhoods(id,cy){
    ele = cy.getElementById(id);
    eles = ele.neighborhood();
    console.log(eles);
    cy.nodes().difference(eles).style("display","none");
    ele.style("display","element");
    cy.animation({
        fit : {
            eles : eles
        }
    }).play();
}

export function resetCanvas(cy){
    cy.nodes().style("display","element");
    cy.filter('.pitfall').forEach(function (node) {
        node.removeClass('pitfall');
    });
    cy.filter('.select').forEach(function (node) {
        node.removeClass('select');
    });

    cy.fit();
}

export function showPitfalls(cy,eles) {

    if(eles.length===undefined){
        cy.getElementById(eles["@value"]).addClass("pitfall");
    }
    else{
        eles.forEach(function (node) {
            cy.getElementById(node["@value"]).addClass("pitfall");
        });
    }
    let elements = cy.elements(".pitfall");
    cy.nodes().difference(elements).style("display","none");
    cy.animation({
        fit : {
            eles : elements
        }
    }).play();
}

export function selectNode(cy,id){
    console.log("select");
    cy.getElementById(id).addClass("select")
}


export function unselectNode(cy,id){
    console.log("unselect");
    cy.getElementById(id).removeClass("select")
}