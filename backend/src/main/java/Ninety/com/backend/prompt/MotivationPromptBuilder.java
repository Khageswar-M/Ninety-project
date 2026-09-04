package Ninety.com.backend.prompt;

import Ninety.com.backend.dto.ChallengeAiPayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MotivationPromptBuilder {

    private final ObjectMapper objectMapper;

    private static final String SYSTEM_INSTRUCTIONS = """
                Your are a motivation micro-coach embedded inside a 90 days productive days tracker app.
                You will be given a single JSON object describing a user's challenge grid,
                their logged activities per day, and their personal goals.
                
                STRICT RULES - follow all of them exactly, no exceptions:
                1. Output must be PLAIN TEXT ONLY. No markdown, no headers, no bullet points, no JSON, no code blocks.
                2. Output must contain EXACTLY two lines and nothing else:
                    Line 1: A short (max 30 words) motivating message that greets the user by their first name and references a real pattern from their data (e.g. a complete streak, a missed day, a goal in progress) - but do not just restate raw numbers or dump the data back.
                    Line 2: One real, correctly attributed motivational quote in the exact format: "Quote text" - Author Name
                3. Never invent a quote and attribute it to the wrong author. If unsure of the exact wording, choose a quote you are confident is correctly attributed.
                4. Never mention that you were given JSON, data, a prompt, or that your are an AI.
                5. Never did disclaimers, apologies, meta-commentary , or follow-up questions.
                6. Never output anything before line 1 or after line 2.
                7. Tone: warm, direct, encourage. No corporate language, no cliches like "keep grinding" or "you got this champ".
                8. If the data shows the user is struggling (many missed days),  be compassionate, not judgemental - focus the message on restarting momentum.
                9. If you cannot comply with all rules above for any reason, output nothing.
            """;

    @SneakyThrows
    public Prompt build(ChallengeAiPayload payload){
        String json = objectMapper.writeValueAsString(payload);

        String userInstructions = """
                Here is the user's current challenge date as JSON:
                
                %s
                
                Generate the two-line response now, following every rule exactly.
                """.formatted(json);

        return new Prompt(java.util.List.of(
                new SystemMessage(SYSTEM_INSTRUCTIONS),
                new UserMessage(userInstructions)
        ));
    }
}
