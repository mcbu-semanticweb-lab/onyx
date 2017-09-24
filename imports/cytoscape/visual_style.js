export const DEF_VISUAL_STYLE = [ // the stylesheet for the graph
    {
        selector: 'node',
        style: {
            'label' : 'data(id)',
            'text-valign': 'center',
            'text-outline-width': 2,
            'background-color': '#999',
            'text-outline-color': 'white',
            'width' : '50px',
            'height' : '50px'
        }
    },

    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-color': 'orange',
            'target-arrow-shape': 'triangle'
        }
    }
];