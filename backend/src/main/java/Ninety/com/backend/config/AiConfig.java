package Ninety.com.backend.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder){

        return builder
                .defaultSystem("""
                        You are a helpful AI assistant.
                        
                        Rules:
                        - Give accurate and concise answers.
                        - If the user asks a programming questions, provide practical examples.
                        - If you are unsure about something, clearly say so.
                        - Do not invent facts.
                        """)
                .build();
    }
}
