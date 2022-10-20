import React, { useState, useContext} from 'react'
import { Menu} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function MenuBar() {
    const  { user, logout } = useContext(AuthContext)
    
    //const pathname = window.location.pathname;
    //const path = pathname === '/' ? 'accueil' : pathname.substring(1);
    const path = pathSwitch();
    function pathSwitch(){
        const pathname = window.location.pathname;
        switch(pathname){
            case '/':
                return 'accueil';
            case '/login':
                return 'connexion';
            case '/register':
                return 'inscription'
            default:
                return 'accueil';
        }
        
    }
    
    const [activeItem, setActiveItem] = useState(path);

    

    const handleItemClick = (e, { name }) => setActiveItem(name);

    const menuBar = user ? (
        <div>
            <Menu pointing secondary size="massive">
            <Menu.Item
                name={user.username}
                active
                as={Link}
                to='/'
            />
            <Menu.Menu position='right'>
                <Menu.Item
                name='Déconnexion'
                onClick={logout}
            /> 
                </Menu.Menu>
            </Menu>
        </div>
    ) : (
        <div>
            <Menu pointing secondary size="massive">
            <Menu.Item
                name='accueil'
                active={activeItem === 'accueil'}
                onClick={handleItemClick}
                as={Link}
                to='/'
            />
            
            <Menu.Menu position='right'>
                <Menu.Item
                name='connexion'
                active={activeItem === 'connexion'}
                onClick={handleItemClick}
                as={Link}
                to='/login'
            />
                <Menu.Item
                name='inscription'
                active={activeItem === 'inscription'}
                onClick={handleItemClick}
                as={Link}
                to='/register'
                />
            </Menu.Menu>
            </Menu>
        </div>
    )
    return menuBar;
        
        
    
}

export default MenuBar;