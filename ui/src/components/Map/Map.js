import React, { useState, useEffect } from 'react';
import { colonies, mapLayout, colonyAPI } from '../../services/api';
import './Map.css';

const Map = ({ currentColony, honey, onColonyChange, onHoneyChange }) => {
  const [hoveredColony, setHoveredColony] = useState(null);
  const [travelingBee, setTravelingBee] = useState(null);
  const [unlockedColonies, setUnlockedColonies] = useState({
    honeycomb: true,
    meadow: false,
    sunset: false,
    crystal: false,
    forest: false,
    ocean: false,
  });
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));
  const [loading, setLoading] = useState(false);

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

  // Load user's colony status on component mount
  useEffect(() => {
    const loadColonyStatus = async () => {
      console.log('Map: Loading colony status for user:', currentUserId);

      // For now, use simple logic - just unlock adjacent colonies
      // You can enhance this to call your backend later
      const getUnlockedColonies = () => {
        const unlocked = { honeycomb: true }; // Always start with honeycomb

        // Check if we have stored unlocked colonies
        const stored = sessionStorage.getItem('unlockedColonies');
        if (stored) {
          try {
            const storedUnlocked = JSON.parse(stored);
            Object.assign(unlocked, storedUnlocked);
          } catch (e) {
            console.log('Error parsing stored colonies');
          }
        }

        return unlocked;
      };

      const unlocked = getUnlockedColonies();
      console.log('Map: Loaded unlocked colonies:', unlocked);
      setUnlockedColonies(unlocked);
    };

    loadColonyStatus();
  }, [currentUserId]);

  const handleColonyClick = async (colonyId) => {
    if (loading) return;

    const colony = colonies[colonyId];
    if (!isColonyAccessible(colonyId)) {
      console.log('Map: Colony not accessible:', colonyId);
      return;
    }

    console.log(
      'Map: Handling colony click:',
      colonyId,
      'unlocked?',
      unlockedColonies[colonyId]
    );

    if (unlockedColonies[colonyId]) {
      // Already unlocked, just travel there
      if (colonyId !== currentColony) {
        console.log('Map: Traveling to unlocked colony:', colonyId);
        onColonyChange(colonyId);
      }
    } else if (honey >= colony.cost) {
      // Can afford to unlock
      setLoading(true);
      try {
        console.log(
          'Map: Unlocking colony:',
          colonyId,
          'for',
          colony.cost,
          'honey'
        );

        // Unlock the colony
        const newUnlocked = { ...unlockedColonies, [colonyId]: true };
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
        setLoading(false);
      }
    } else {
      alert(
        `You need ${colony.cost} honey to unlock ${colony.name}. You have ${honey} honey.`
      );
    }
  };

  const isColonyAccessible = (colonyId) => {
    if (unlockedColonies[colonyId]) return true;

    // Check if any connected colony is unlocked
    const connections = colonyConnections[colonyId] || [];
    return connections.some((connectedId) => unlockedColonies[connectedId]);
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

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">🗺️ Colony Explorer</h2>
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
            <pattern
              id="hexPatternDense"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
            >
              <polygon
                points="2,0.3 3.3,1 3.3,3 2,3.7 0.7,3 0.7,1"
                fill="none"
                stroke="#f39c12"
                strokeWidth="0.15"
                opacity="0.4"
              />
            </pattern>
          </defs>

          <rect width="100" height="100" fill="url(#hexPattern)" />
          <rect width="100" height="100" fill="url(#hexPatternDense)" opacity="0.7" />

          {/* Roads */}
          {Object.entries(mapLayout).map(([colonyId, data]) =>
            data.connections.map((connectedId) => (
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
            ))
          )}

          {/* Colonies */}
          {Object.entries(colonies).map(([colonyId, colony]) => {
            const position = mapLayout[colonyId];
            const isUnlocked = unlockedColonies[colonyId];
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
                  onMouseEnter={() => setHoveredColony(colonyId)}
                  onMouseLeave={() => setHoveredColony(null)}
                  style={{ fill: isUnlocked ? colony.color : '#8b7355' }}
                />

                <text
                  x={position.x}
                  y={position.y - 7}
                  className="colony-label"
                  textAnchor="middle"
                >
                  {colony.name}
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
        {hoveredColony && (
          <div className="colony-tooltip">
            <h4>{colonies[hoveredColony].name}</h4>
            {unlockedColonies[hoveredColony] ? (
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
              <p>Unlock adjacent colonies first</p>
            )}
          </div>
        )}
      </div>

      <div className="current-colony-info">
        <h3>Currently in: {colonies[currentColony].name}</h3>
        <p>Explore this colony to meet new people!</p>
      </div>
    </div>
  );
};

export default Map;
