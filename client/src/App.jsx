import React from 'react';
import Game from './Game';
import './App.css';
import Footer from './components/footer';

function App() {
  return (
    <div className="app">
      <h1>Flappy Bird</h1>
      <Game />
      <Footer/>
    </div>
  );
}

export default App;
