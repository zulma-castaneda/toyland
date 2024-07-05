import React from "react";

interface ColorfulTextProps {
  text: string;
}

export const ColorfulText: React.FC<ColorfulTextProps> = ({ text }) => {
  return (
    <div className="colored-text">
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{
            animationDelay: `${index * 0.2}s`, // Delay each letter's animation for a staggered effect
            whiteSpace: "pre", // Preserve spaces and line breaks
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
