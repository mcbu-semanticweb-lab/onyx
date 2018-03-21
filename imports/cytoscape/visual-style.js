export const DEF_VISUAL_STYLE = [
    {
        selector: 'node',
        style: {
            'label' : 'data(label)',
            'text-valign': 'center',
            'text-outline-width': 2,
            'background-color': '#999',
            'text-outline-color': 'white',
        }
    },

    {
        selector: 'node[group="class"]',
        style: {
            'shape' : 'ellipse',
            'label' : 'data(label)',
            'text-valign': 'center',
            'text-outline-width': 4,
            'background-color': '#999',
            'text-outline-color': 'white',
        }
    },

    {
        selector: 'node[group="literal"]',
        style: {
            'shape' : 'rectangle',
            'label' : 'data(label)',
            'text-valign': 'center',
            'text-outline-width': 4,
            'background-color': '#999',
            'text-outline-color': 'white',
        }
    },

    {
        selector: 'node[group="other"]',
        style: {
            'shape' : 'triangle',
            'label' : 'data(label)',
            'text-valign': 'center',
            'text-outline-width': 4,
            'background-color': '#999',
            'text-outline-color': 'white',
        }
    },

    {
        selector: 'edge',
        style: {
            'line-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-color': 'orange',
            'target-arrow-shape': 'triangle'
        }
    },

    {
        selector: '.selected',
        style: {
            'border-width' : '25px',
            'border-style' : 'solid',
            'border-color' : 'red'
        }
    },

    {
        selector: 'edge[group="domain"]',
        style: {
            'target-arrow-color': 'blue',
        }
    },

    {
        selector: 'edge[group="range"]',
        style: {
            'target-arrow-color': 'red',
        }
    }


];