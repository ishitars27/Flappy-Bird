import React, { useState, useEffect } from 'react';
import "./pages/style/Leaderboard.css";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/leaderboard.json');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        // Sort scores in descending order and take top 10
        const sortedScores = data.scores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        setScores(sortedScores);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Top 10 Players 🏆</h2>
      <div className="leaderboard-header">
        <span className="rank"><img src="/bird.png" alt="bird " width={30} height={30} /></span>
        <span className="username">Player</span>
        <span className="score">Score</span>
        <span className="date">Date</span>
      </div>
      <div className="leaderboard-scores">
        {scores.map((entry, index) => (
          <div key={entry.id} className="leaderboard-entry">
            <span className="rank">{index + 1}</span>
            <span className="username">{entry.username}</span>
            <span className="score">{entry.score}</span>
            <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
      {/* <Footer/>  */}
  </div>
    // <Footer/>
  );
};

export default Leaderboard;
