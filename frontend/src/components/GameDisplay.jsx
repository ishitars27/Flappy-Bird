import { useState, useRef, useCallback, useEffect } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import Ground from './Ground';

// Game constants
const GRAVITY = 0.4;
const JUMP_FORCE = -7;
const PIPE_SPEED = 2;
const PIPE_GAP = 150;
const PIPE_WIDTH = 80;
const BIRD_SIZE = 40;
const GAME_AREA_HEIGHT = 600;
const GAME_AREA_WIDTH = 400;
const GROUND_HEIGHT = 100;

// Game states
const GAME_STATES = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  GAME_OVER: 'GAME_OVER',
};

function GameDisplay() {
  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState(GAME_AREA_HEIGHT / 2-100);
  const [pipes, setPipes] = useState([]);
  const gameAreaRef = useRef(null);
  const animationFrameId = useRef(null);
  const velocity = useRef(0);
  const lastPipeId = useRef(null);
  const groundPosition = useRef(0);

  // Generate a new pipe pair
  const generatePipe = useCallback(() => {
    const minGapFromTop = 100;
    const maxGapFromTop = GAME_AREA_HEIGHT - PIPE_GAP - GROUND_HEIGHT - 50;
    const gapPosition = Math.random() * (maxGapFromTop - minGapFromTop) + minGapFromTop;
    
    return {
      id: Date.now() + Math.random(),
      x: GAME_AREA_WIDTH,
      topHeight: gapPosition,
      bottomHeight: GAME_AREA_HEIGHT - gapPosition - PIPE_GAP - GROUND_HEIGHT,
      passed: false,
    };
  }, []);

  // Reset game state
  const resetGame = useCallback(() => {
    setBirdPosition(GAME_AREA_HEIGHT / 2 - BIRD_SIZE / 2);
    setPipes([]);
    setScore(0);
    velocity.current = 0;
    groundPosition.current = 0;
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    if (gameState === GAME_STATES.GAME_OVER) {
      resetGame();
    }
    setGameState(GAME_STATES.RUNNING);
  }, [gameState, resetGame]);

  // Handle bird jump
  const handleJump = useCallback(() => {
    if (gameState === GAME_STATES.GAME_OVER) return;
    
    if (gameState === GAME_STATES.IDLE) {
      startGame();
    }
    
    velocity.current = JUMP_FORCE;
  }, [gameState, startGame]);

  // Check for collisions
  const checkCollision = useCallback((pipes) => {
    // Check collision with ground
    if (birdPosition >= GAME_AREA_HEIGHT - BIRD_SIZE - GROUND_HEIGHT) {
      return true;
    }
    
    // Check collision with ceiling
    if (birdPosition <= 0) {
      velocity.current = 0;
      return false;
    }

    // Check collision with pipes
    return pipes.some(pipe => {
      const birdLeft = 100;
      const birdRight = birdLeft + BIRD_SIZE;
      const birdTop = birdPosition;
      const birdBottom = birdPosition + BIRD_SIZE;
      
      const pipeRight = pipe.x + PIPE_WIDTH;
      const pipeLeft = pipe.x;
      
      // Check if bird is in the same x-range as the pipe
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird is not in the gap
        if (birdTop <= pipe.topHeight || birdBottom >= (GAME_AREA_HEIGHT - pipe.bottomHeight - GROUND_HEIGHT)) {
          return true; // Collision detected
        }
      }
      return false;
    });
  }, [birdPosition]);

  // Check if bird passed a pipe
  const checkPipePassed = useCallback((pipes) => {
    const birdLeft = 100;
    let newPipes = [...pipes];
    let scoreIncrement = 0;
    
    newPipes = newPipes.map(pipe => {
      if (!pipe.passed && pipe.x + PIPE_WIDTH < birdLeft) {
        scoreIncrement++;
        return { ...pipe, passed: true };
      }
      return pipe;
    });
    
    if (scoreIncrement > 0) {
      setScore(prev => prev + scoreIncrement);
    }
    
    return newPipes;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== GAME_STATES.RUNNING) return;

    let lastTime = 0;
    const gameLoop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Update bird position
      setBirdPosition(prev => {
        velocity.current += GRAVITY;
        const newPosition = prev + velocity.current;
        return newPosition;
      });

      // Update pipes
      setPipes(prevPipes => {
        let newPipes = prevPipes
          .map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED,
          }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);
          
        // Add new pipe if needed
        const lastPipe = newPipes[newPipes.length - 1];
        if (!lastPipe || lastPipe.x < GAME_AREA_WIDTH - 300) {
          const newPipe = generatePipe();
          if (newPipe) {
            newPipes.push(newPipe);
          }
        }
        
        return newPipes;
      });

      // Update ground position for scrolling effect
      groundPosition.current = (groundPosition.current - PIPE_SPEED) % 16;

      // Check collisions and pipe passing
      setPipes(currentPipes => {
        const updatedPipes = checkPipePassed(currentPipes);
        if (checkCollision(updatedPipes)) {
          setGameState(GAME_STATES.GAME_OVER);
          setHighScore(prev => Math.max(prev, score + (updatedPipes.filter(p => p.passed).length - score)));
          return updatedPipes;
        }
        return updatedPipes;
      });

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, checkCollision, checkPipePassed, generatePipe, score]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div 
      ref={gameAreaRef}
      className="game-area"
      style={{
        width: `${GAME_AREA_WIDTH}px`,
        height: `${GAME_AREA_HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#87CEEB',
        border: '2px solid #333',
        borderRadius: '8px',
        fontFamily: "Jersey 20",
        fontWeight: 400,
        fontStyle: "normal",
        margin: '0 auto',
      }}
      onClick={gameState === GAME_STATES.IDLE ? startGame : handleJump}
      id='game-area'
      
    >
      {/* Score */}
      <div style={{
        position: 'absolute',
        top: '20px',
        width: '100%',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}>
        {score}
      </div>

      {/* Bird */}
      <Bird 
        position={birdPosition} 
        isGameOver={gameState === GAME_STATES.GAME_OVER}
      />

      {/* Pipes */}
      {pipes.map(pipe => (
        <Pipe 
          key={pipe.id}
          x={pipe.x}
          topHeight={pipe.topHeight}
          bottomHeight={pipe.bottomHeight}
          width={PIPE_WIDTH}
          gap={PIPE_GAP}
          gameHeight={GAME_AREA_HEIGHT}
          groundHeight={GROUND_HEIGHT}
        />
      ))}

      {/* Ground */}
      <Ground 
        position={groundPosition.current} 
        height={GROUND_HEIGHT} 
        width={GAME_AREA_WIDTH}
      />

      {/* Game Over Overlay */}
      {gameState === GAME_STATES.GAME_OVER && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 20,
          color: 'white',
          textAlign: 'center',
        }}>
          <h2 style={{fontSize: '10rem', fontFamily: 'Jersey 20'}}>Game Over!</h2>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button 
            onClick={startGame}
            style={{
              marginTop: '20px',
              padding: '10px 30px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
          
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Start Screen */}
      {gameState === GAME_STATES.IDLE && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 20,
          color: 'white',
          textAlign: 'center',
        }}>
          <h2>Flappy Bird</h2>
          <p>Click or press SPACE to start</p>
          <p>Press SPACE to jump</p>
        </div>
      )}
    </div>
  );
}

export default GameDisplay;