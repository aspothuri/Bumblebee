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
  const [currentUserId] = useState(localStorage.getItem('currentUserId'));
  const [loading, setLoading] = useState(false);

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
      if (currentUserId) {
        try {
          const status = await colonyAPI.getUserColonyStatus(currentUserId);
          if (status) {
            const unlocked = {};
            status.unlockedColonies.forEach(colonyId => {
              unlocked[colonyId] = true;
            });
            setUnlockedColonies(unlocked);
            onHoneyChange(status.honey);
          }
        } catch (error) {
          console.error('Error loading colony status:', error);
        }
      }
    };

    loadColonyStatus();
  }, [currentUserId, onHoneyChange]);

  const handleColonyClick = async (colonyId) => {
    if (loading) return;

    const colony = colonies[colonyId];
    if (!isColonyAccessible(colonyId)) return;

    const path = findShortestPath(currentColony, colonyId);

    if (unlockedColonies[colonyId]) {
      if (colonyId !== currentColony && path) {
        setTravelingBee({ path, index: 0 });
      }
    } else if (honey >= colony.cost) {
      setLoading(true);
      try {
        const result = await colonyAPI.unlockColony(currentUserId, colonyId);
        if (result.success) {
          setUnlockedColonies((prev) => ({ ...prev, [colonyId]: true }));
          onHoneyChange(result.data.honey);
          if (path) setTravelingBee({ path, index: 0 });
        } else {
          alert(result.message);
        }
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
    const connections = mapLayout[colonyId].connections;
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
            <pattern id="hexPattern" patternUnits="userSpaceOnUse" width="6" height="6">
              <polygon
                points="3,0.5 5.5,1.5 5.5,4.5 3,5.5 0.5,4.5 0.5,1.5"
                fill="none"
                stroke="#f4d03f"
                strokeWidth="0.2"
                opacity="0.6"
              />
            </pattern>
            <pattern id="hexPatternDense" patternUnits="userSpaceOnUse" width="4" height="4">
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
                className={`road ${unlockedColonies[colonyId] && unlockedColonies[connectedId]
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
                  className={`colony ${isCurrent
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
