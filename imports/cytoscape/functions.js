export function showNeighborhoods(id,cy){
    ele = cy.getElementById(id);
    eles = ele.neighborhood();
    console.log(eles);
    cy.stop();
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
    cy.fit();
}
