import React, {Component} from 'react';
import { Nav, Navbar, Container} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Navigacion extends Component
{
    render(){
        let enlaces = [
            {name: 'Buscador', url: '/buscador', key: 'buscador'},
            {name: 'About', url: '/about', key: 'about'}
        ];

        return (
            <Navbar bg="dark" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand key="index">
                    <LinkContainer to="/" key="index">
                        <Nav.Link>
                            NOTI APP
                        </Nav.Link>
                    </LinkContainer>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    { enlaces.map((enlace) => 
                            <LinkContainer key={enlace.key} to={enlace.url}>
                                <Nav.Link>{enlace.name}</Nav.Link>
                            </LinkContainer>
                        ) }
                </Navbar.Collapse>
            </Container>
            </Navbar>
        );
    }
}
export default Navigacion;