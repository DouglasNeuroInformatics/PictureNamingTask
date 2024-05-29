// App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";
import experiment2 from "./experiment2.ts";
import DifficultySelectorComponent from "./DifficultySelector.tsx";

const App: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null,
  );

  const handleDifficultyChange = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    // Optionally, call experiment2 here if it needs to run synchronously
    // experiment2();
  };

  useEffect(() => {
    if (selectedDifficulty !== null) {
      // Call experiment2 after DifficultySelectorComponent has set the selected difficulty
      //experiment2(selectedDifficulty);
      experiment2();
    }
  }, [selectedDifficulty]);

  return (
    <div className="App">
      <DifficultySelectorComponent onSelect={handleDifficultyChange} />
    </div>
  );
};

export default App;
