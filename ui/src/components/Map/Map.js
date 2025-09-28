import React, { useState, useEffect } from 'react';
import { getUserColonies } from '../../services/api';
import './Map.css';

const Map = ({ currentColony, honey, onColonyChange, onHoneyChange }) => {
  const [hoveredColony, setHoveredColony] = useState(null);
  const [travelingBee, setTravelingBee] = useState(null);
  const [colonies, setColonies] = useState({});
  const [mapLayout, setMapLayout] = useState({});
  const [unlockedColonies, setUnlockedColonies] = useState({});
  const [rankedTags, setRankedTags] = useState([]);
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  // Load user's personalized colony system
  useEffect(() => {
    const loadUserColonies = async () => {
      if (!currentUserId) {
        console.log('Map: No user ID found');
        setLoading(false);
        return;
      }

      setMapLoading(true);
      try {
        console.log('Map: Loading personalized colonies for user:', currentUserId);
        const colonyData = await getUserColonies(currentUserId);

        if (colonyData) {
          setColonies(colonyData.colonies);
          setMapLayout(colonyData.mapLayout);
          setRankedTags(colonyData.rankedTags);

          // Initialize unlocked colonies - start with top colony and 3 nearest
          const initialUnlocked = {};
          const startingColony = colonyData.startingColony;
          initialUnlocked[startingColony] = true;

          // Unlock 3 closest colonies based on ranking
          const nearbyColonies = colonyData.rankedTags.slice(1, 4);
          nearbyColonies.forEach((colony) => {
            initialUnlocked[colony] = false; // Available to unlock
          });

          setUnlockedColonies(initialUnlocked);

          // Set starting colony if not already set
          if (!currentColony || !colonyData.colonies[currentColony]) {
            onColonyChange(startingColony);
          }

          console.log('Map: Loaded colonies:', Object.keys(colonyData.colonies).length);
          console.log('Map: Starting colony:', startingColony);
        }
      } catch (error) {
        console.error('Map: Error loading user colonies:', error);
      } finally {
        setMapLoading(false);
        setLoading(false);
      }
    };

    loadUserColonies();
  }, [currentUserId]);

  // Simple adjacency map for colonies
  const colonyConnections = {
    honeycomb: ['meadow', 'sunset'],
    meadow: ['honeycomb', 'crystal', 'forest'],
    sunset: ['honeycomb', 'crystal', 'ocean'],
    crystal: ['meadow', 'sunset', 'forest', 'ocean'],
    forest: ['meadow', 'crystal'],
    ocean: ['sunset', 'crystal'],
  };

  // 🔹 BFS shortest path finder
  const findShortestPath = (start, end) => {
    if (start === end) return [start];

    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      for (const neighbor of mapLayout[node].connections) {
        if (!visited.has(neighbor)) {
          const newPath = [...path, neighbor];
          if (neighbor === end) return newPath;
          queue.push(newPath);
          visited.add(neighbor);
        }
      }
    }
    return null;
  };

  const handleColonyClick = async (colonyId) => {
    if (loading || mapLoading) return;

    const colony = colonies[colonyId];
    if (!isColonyAccessible(colonyId)) {
      console.log('Map: Colony not accessible:', colonyId);
      return;
    }

    console.log('Map: Handling colony click:', colonyId, 'unlocked?', unlockedColonies[colonyId]);

    if (unlockedColonies[colonyId]) {
      // Already unlocked, just travel there
      if (colonyId !== currentColony) {
        console.log('Map: Traveling to unlocked colony:', colonyId);
        onColonyChange(colonyId);
      }
    } else if (honey >= colony.cost) {
      // Can afford to unlock
      setMapLoading(true);
      try {
        console.log('Map: Unlocking colony:', colonyId, 'for', colony.cost, 'honey');

        // Unlock the colony
        const newUnlocked = { ...unlockedColonies, [colonyId]: true };

        // Unlock next accessible colonies (next 3 in ranking after this one)
        const currentIndex = rankedTags.indexOf(colonyId);
        const nextColonies = rankedTags.slice(currentIndex + 1, currentIndex + 4);
        nextColonies.forEach((nextColony) => {
          if (!newUnlocked[nextColony]) {
            newUnlocked[nextColony] = false; // Make available to unlock
          }
        });

        setUnlockedColonies(newUnlocked);

        // Store in session storage
        sessionStorage.setItem('unlockedColonies', JSON.stringify(newUnlocked));

        // Deduct honey
        const newHoney = honey - colony.cost;
        onHoneyChange(newHoney);
        sessionStorage.setItem('userHoney', newHoney.toString());

        // Travel to the newly unlocked colony
        onColonyChange(colonyId);

        console.log('Map: Successfully unlocked and traveled to:', colonyId);
      } catch (error) {
        console.error('Error unlocking colony:', error);
        alert('Failed to unlock colony. Please try again.');
      } finally {
        setMapLoading(false);
      }
    } else {
      alert(`You need ${colony.cost} honey to unlock ${colony.name}. You have ${honey} honey.`);
    }
  };

  const isColonyAccessible = (colonyId) => {
    // Colony is accessible if it's unlocked or available to unlock
    return unlockedColonies.hasOwnProperty(colonyId);
  };

  // 🔹 Animate bee step by step along path
  useEffect(() => {
    if (!travelingBee) return;

    const { path, index } = travelingBee;
    if (index >= path.length - 1) {
      onColonyChange(path[path.length - 1]);
      setTravelingBee(null);
      return;
    }

    const timer = setTimeout(() => {
      setTravelingBee({ path, index: index + 1 });
    }, 800); // Slightly faster animation

    return () => clearTimeout(timer);
  }, [travelingBee, onColonyChange]);

  const getBeePosition = () => {
    if (!travelingBee) return null;

    const { path, index } = travelingBee;
    const currentPos = mapLayout[path[index]];
    const nextPos = mapLayout[path[index + 1]];

    if (!nextPos) {
      // At final destination
      return { x: currentPos.x, y: currentPos.y - 3 };
    }

    // Moving between positions
    return {
      x: (currentPos.x + nextPos.x) / 2,
      y: (currentPos.y + nextPos.y) / 2 - 3,
    };
  };

  const handleMouseEnter = (colonyId) => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    setHoveredColony(colonyId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredColony(null);
    }, 150);
    setTooltipTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  if (loading) {
    return (
      <div className="map-container">
        <div className="loading">
          <div className="loading-icon">🐝</div>
          <p>Generating your personalized colony map...</p>
        </div>
      </div>
    );
  }

  if (Object.keys(colonies).length === 0) {
    return (
      <div className="map-container">
        <div className="loading">
          <div className="loading-icon">❌</div>
          <p>Unable to load your personalized colonies. Please ensure you have completed your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">🗺️ Your Personal Colony Map</h2>
        <div className="honey-display">
          <span className="honey-icon">🍯</span>
          <span className="honey-amount">{honey}</span>
        </div>
      </div>

      <div className="map-world">
        <svg
          className="map-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background patterns */}
          <defs>
            <pattern
              id="hexPattern"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
            >
              <polygon
                points="3,0.5 5.5,1.5 5.5,4.5 3,5.5 0.5,4.5 0.5,1.5"
                fill="none"
                stroke="#f4d03f"
                strokeWidth="0.2"
                opacity="0.6"
              />
            </pattern>
          </defs>

          <rect width="100" height="100" fill="url(#hexPattern)" />

          {/* Roads between connected colonies */}
          {Object.entries(mapLayout).map(([colonyId, data]) =>
            data.connections?.map((connectedId) =>
              mapLayout[connectedId] && (
                <line
                  key={`${colonyId}-${connectedId}`}
                  x1={data.x}
                  y1={data.y}
                  x2={mapLayout[connectedId].x}
                  y2={mapLayout[connectedId].y}
                  className={`road ${
                    unlockedColonies[colonyId] && unlockedColonies[connectedId]
                      ? 'road-unlocked'
                      : 'road-locked'
                  }`}
                  strokeWidth="1.2"
                />
              )
            )
          )}

          {/* Colonies */}
          {Object.entries(colonies).map(([colonyId, colony]) => {
            const position = mapLayout[colonyId];
            if (!position) return null;

            const isUnlocked = unlockedColonies[colonyId] === true;
            const isCurrent = colonyId === currentColony;
            const isAccessible = isColonyAccessible(colonyId);

            return (
              <g key={colonyId}>
                <polygon
                  points={`${position.x},${position.y - 5} 
                           ${position.x + 4.5},${position.y - 2.5} 
                           ${position.x + 4.5},${position.y + 2.5} 
                           ${position.x},${position.y + 5} 
                           ${position.x - 4.5},${position.y + 2.5} 
                           ${position.x - 4.5},${position.y - 2.5}`}
                  className={`colony ${
                    isCurrent
                      ? 'colony-current'
                      : isUnlocked
                      ? 'colony-unlocked'
                      : isAccessible
                      ? 'colony-locked'
                      : 'colony-inaccessible'
                  }`}
                  onClick={() => isAccessible && handleColonyClick(colonyId)}
                  onMouseEnter={() => handleMouseEnter(colonyId)}
                  onMouseLeave={handleMouseLeave}
                  style={{ 
                    fill: isUnlocked ? colony.color : '#8b7355',
                    transition: 'all 0.3s ease'
                  }}
                />

                <text
                  x={position.x}
                  y={position.y - 7}
                  className="colony-label"
                  textAnchor="middle"
                  style={{ 
                    pointerEvents: 'none',
                    transition: 'transform 0.3s ease',
                    transform: hoveredColony === colonyId ? 'scale(1.2)' : 'scale(1)'
                  }}
                >
                  {colony.icon}
                </text>

                <text
                  x={position.x}
                  y={position.y - 2}
                  className="colony-name-small"
                  textAnchor="middle"
                >
                  {colony.name.split(' ')[0]}
                </text>

                {!isUnlocked && isAccessible && (
                  <text
                    x={position.x}
                    y={position.y + 8}
                    className="colony-cost"
                    textAnchor="middle"
                  >
                    🍯{colony.cost}
                  </text>
                )}
              </g>
            );
          })}

          {/* Traveling bee */}
          {travelingBee && getBeePosition() && (
            <text
              x={getBeePosition().x}
              y={getBeePosition().y}
              className="traveling-bee"
              textAnchor="middle"
            >
              🐝
            </text>
          )}
        </svg>

        {/* Tooltip */}
        {hoveredColony && colonies[hoveredColony] && (
          <div 
            className="colony-tooltip"
            style={{ pointerEvents: 'none' }}
            onMouseEnter={() => handleMouseEnter(hoveredColony)}
          >
            <h4>
              {colonies[hoveredColony].icon} {colonies[hoveredColony].name}
            </h4>
            {unlockedColonies[hoveredColony] === true ? (
              <p>Click to travel</p>
            ) : isColonyAccessible(hoveredColony) ? (
              <div>
                <p>Cost: 🍯{colonies[hoveredColony].cost}</p>
                <p>
                  {honey >= colonies[hoveredColony].cost
                    ? 'Click to unlock!'
                    : 'Not enough honey'}
                </p>
              </div>
            ) : (
              <p>Explore more colonies to unlock</p>
            )}
          </div>
        )}
      </div>

      <div className="current-colony-info">
        <h3>
          Currently in: {colonies[currentColony]?.icon} {colonies[currentColony]?.name}
        </h3>
        <p>Find people who share your interests in {colonies[currentColony]?.name}!</p>
        <div className="colony-rank">
          <p>
            Your affinity rank: #{(rankedTags.indexOf(currentColony) + 1) || '?'} of {rankedTags.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;
