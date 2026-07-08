import React, { useEffect, useState } from "react";
import { Text } from "react-native";

const TypewriterText = ({
    text,
    speed = 100,
    style,
    onComplete,
    refreshKey
}) => {

    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        const words = text.split(" ");
        let index = 0;

        setDisplayText("");

        const interval = setInterval(() => {
            if (index < words.length) {
                setDisplayText(prev =>
                    prev
                        ? `${prev} ${words[index]}`
                        : words[index]
                );
                index++;
            } else {
                clearInterval(interval);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, refreshKey]);

    return (
        <Text style={style}>
            {displayText}
        </Text>
    );
};

export default TypewriterText;