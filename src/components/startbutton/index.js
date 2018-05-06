import React from 'react';
import './startbutton.css';
import {ButtonToolbar, MenuItem, DropdownButton} from 'react-bootstrap';

export default class StartButton extends React.Component{
    
    handleSelect = (evt) => {
        this.props.gridSize(evt);
    }

    render(){
        return(
            <div className="center">
                <ButtonToolbar>
                    <DropdownButton
                        title="Размер поля"
                        id="size-menu"
                        onSelect={this.handleSelect}
                    >
                        <MenuItem eventKey="1">1: 20x10</MenuItem>
                        <MenuItem eventKey="2">2: 30x15</MenuItem>
                        <MenuItem eventKey="3">2: 40x20</MenuItem>
                        <MenuItem eventKey="4">2: 50x25</MenuItem>
                        <MenuItem eventKey="5">3: 60x30</MenuItem>
                    </DropdownButton>
                </ButtonToolbar>
            </div>
        );
    }
}