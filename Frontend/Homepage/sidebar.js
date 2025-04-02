//sidebar
const { useState } = React;

function Sidebar() {
    const [expanded, setExpanded] = useState(false);

    return React.createElement(
        'div',
        {
            className: `sidebar ${expanded ? 'expanded' : ''}`,
            onMouseEnter: () => setExpanded(true),
            onMouseLeave: () => setExpanded(false)
        },
        React.createElement(
            'ul',
            null,
            [
                createMenuItem('🏠', 'Home'),
                createMenuItem('📅', 'Calendar'),
                createMenuItem('💬', 'Messages'),
                createMenuItem('💰', 'Budget'),
                createMenuItem('📊', 'Stats'),
                createMenuItem('✅', 'Tasks')
            ]
        )
    );
}

function createMenuItem(icon, text) {
    return React.createElement(
        'li',
        null,
        React.createElement(
            'a',
            { href: '#'},
            [
                React.createElement('span', {className: 'icon'}, icon),
                React.createElement('span', {className: 'text'}, text)
            ]
        )
    );
}

ReactDOM.render(
    React.createElement(Sidebar),
    document.getElementById('sidebar-root')
);