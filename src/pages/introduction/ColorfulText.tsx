import React from "react";

interface ColorfulTextProps {
  text: string;
}

export const ColorfulText: React.FC<ColorfulTextProps> = ({ text }) => {
  const coloredWords = () => {
    const words = text.split(" ");
    let currentIndex = words.join("").length;

    return words.map((word, wordIndex) => (
      <span>
        {
          word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              style={{
                animationDelay: `${-(--currentIndex) * 0.2}s`, // Delay each letter's animation for a staggered effect
              }}
            >
              {char}
            </span>
          ))
        }
        {wordIndex < words.length - 1 ? "\u00A0" : ""}
      </span>
    ))
  }

  return (
    <div className="colored-text">
      {coloredWords()}
    </div>
  );
};
