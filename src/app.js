import React from 'react';
import './app.css';
import Grid from './components/grid';
import Buttons from './components/buttons';
import StartButton from './components/startbutton';

export default class App extends React.Component{
    constructor(){
        super();
        this.speed = 1000;
        this.cols = 60;
        this.rows = 30;
        this.state = {
            startstatus: 0,
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
        this.g1 = arrayClone(this.state.gridFull);               
    }
    
    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull:gridCopy
        });
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.cols; j++){
                if (Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFull:gridCopy
        });
        this.g1 = arrayClone(gridCopy);
    }

    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play,this.speed);
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
    }

    slow = () => {
        this.speed = this.speed + 100;
        // console.log (this.speed);
        this.playButton();
    }

    fast = () => {
        if (this.speed) {
            this.speed = this.speed - 100;
        }
        //console.log (this.speed);
        this.playButton();
    }

    clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.setState({
            gridFull: grid,
            generation: 0,
            startstatus: 1,
        });
        this.g1 = arrayClone(grid);
    }

    gridSize = (size) => {
        switch (size) {
            case "1":
                this.cols = 20;
                this.rows = 10;
            break;
            case "2":
                this.cols = 30;
                this.rows = 15;
            break;
            case "3":
                this.cols = 40;
                this.rows = 20;
            break;
            case "4":
                this.cols = 50;
                this.rows = 25;
            break;
            default:
                this.cols = 60;
                this.rows = 30;
        }
        this.clear();
    }

    play = () => {
        let g1 = this.g1;
        let g2 = this.state.gridFull;
        let g3 = arrayClone(this.state.gridFull);
        
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.cols; j++){
                let count = 0;

                if (i > 0) if (g2[i-1][j]) count++;
                if (i > 0 && j > 0) if (g2[i-1][j-1]) count++;
                if (i > 0 && j < this.cols -1) if (g2[i-1][j+1]) count++;
                if (j < this.cols -1) if (g2[i][j+1]) count++;
                if (j > 0) if (g2[i][j-1]) count++;
                if (i < this.rows - 1) if (g2[i+1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (g2[i+1][j-1]) count++;
                if (i < this.rows - 1 && j < this.cols -1) if (g2[i+1][j+1]) count++;
                
                if (g2[i][j] && (count < 2 || count > 3)) g3[i][j] = false;
                if (!g2[i][j] && count === 3) g3[i][j] = true;
            }
        }

        if (predelEvalution(g1,g3,this.rows,this.cols)){
            this.pauseButton();
            console.log('Два стабильных поколения на шаге развития: ');
            console.log(this.state.generation);
        }

        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.cols; j++){
                this.g1[i][j] = g2[i][j];
            }
        }

        this.setState({
            gridFull: g3,
            generation: this.state.generation + 1
        });
    }

    render(){
        if (!this.state.startstatus){ 
            return[(
                <div>
                    <h1>Жизнь!</h1>
                    <h3>Выбрать размер поля:</h3>                
                    <StartButton
                        gridSize = {this.gridSize}                       
                    />
                </div>
            ),
            this.startGrid=1];
        };        
        return(
            <div>
                <h1>Жизнь!</h1>
                <h3>Поколение №: {this.state.generation}</h3>
                <Grid
                    gridFull = {this.state.gridFull}
                    rows = {this.rows}
                    cols = {this.cols}
                    selectBox = {this.selectBox}
                />                 
                <Buttons
                    playButton = {this.playButton}
                    pauseButton = {this.pauseButton}
                    slow = {this.slow}
                    fast = {this.fast}
                    clear = {this.clear}
                    seed = {this.seed}
                    gridSize = {this.gridSize}
                />               
            </div>
        );
    }
}

function predelEvalution(g1,g3,r,c){
    let countp=0;
    for (let i = 0; i < r; i++){
        for (let j = 0; j < c; j++){
            if (g1[i][j] !== g3[i][j]){countp++}
        }
    }
    if(countp) return false;
    return true;
}

function arrayClone(arr){
    return JSON.parse(JSON.stringify(arr));
}

