import React from "react";

// defines the prop that is used to gerenate the test stimuli from the imgBank
// the Prop is passed to the test stimuli generator
// onSelect is optional property (?), return nothing
interface DifficultySelectorProps {
  onSelect?: (difficulty: number) => void; // Callback prop for when a difficulty is selected
}

const DifficultySelectorComponent: React.FC<DifficultySelectorProps> = ({
  onSelect,
}) => {
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = Number(event.target.value);
    setSelectedDifficulty(newDifficulty);
    if (onSelect) {
      onSelect(newDifficulty);
    }
  };

  return (
    <div>
      <select value={selectedDifficulty} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {levels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      {selectedDifficulty !== "" && <p>You selected: {selectedDifficulty}</p>}
    </div>
  );
};

export default DifficultySelectorComponent;
