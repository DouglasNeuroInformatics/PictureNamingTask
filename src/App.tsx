import React, { useEffect, useState } from "react";
import "./App.css";
import pictureNamingTask from "./pictureNamingTask.ts";
import DifficultySelectorComponent from "./DifficultySelector.tsx";

const App: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null,
  );

  const handleDifficultyChange = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
  };

  useEffect(() => {
    if (selectedDifficulty !== null) {
      // Call pictureNamingTask after DifficultySelectorComponent has set the selected difficulty
      pictureNamingTask(selectedDifficulty);
    }
  }, [selectedDifficulty]);

  return (
    <div className="App">
      <DifficultySelectorComponent onSelect={handleDifficultyChange} />
    </div>
  );
};

export default App;
