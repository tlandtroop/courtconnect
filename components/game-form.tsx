'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { toast } from 'sonner'; 

const GameForm = () => {
  const [courtId, setCourtId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [gameType, setGameType] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('');
  const [playersNeeded, setPlayersNeeded] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!courtId || !date || !startTime || !gameType || !skillLevel || !playersNeeded) {
      setError('All fields except Additional Notes are required');
      return;
    }

    const gameData = {
      courtId,
      date,
      startTime,
      endTime,
      gameType,
      skillLevel,
      playersNeeded,
      notes,
      organizerId: 'some-organizer-id', // Replace with actual organizer ID (e.g., from session)
    };

    try {
      // Send data to API route to create a new game
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      else {
        toast("Game Created", {
          description: "A game has been created successfully"
        })
      }

      /* const data = await response.json(); // Parse JSON response
      if (data.game) {
        alert('Game created successfully');
      } else {
        alert('Failed to create game');
      } */
    } catch (error) {
      console.error('Error:', error);
      setError('Error creating game');
      toast("Error Creating Game", {
        description: "A game could not be created"
      })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a New Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Court Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Court</label>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((court) => (
                <div
                  key={court}
                  className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 ${courtId === court.toString() ? 'border-blue-500' : ''}`}
                  onClick={() => setCourtId(court.toString())}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="font-medium">Court Name #{court}</div>
                      <div className="text-sm text-gray-500">2.3 miles away</div>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Game Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Game Type</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
              >
                <option>Pickleball - Singles</option>
                <option>Pickleball - Doubles</option>
                <option>Basketball - 3v3</option>
                <option>Basketball - 5v5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Skill Level</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels Welcome</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Players Needed</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={playersNeeded}
                onChange={(e) => setPlayersNeeded(Number(e.target.value))}
                placeholder="Enter number of players"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information about the game..."
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Create Game
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameForm;
