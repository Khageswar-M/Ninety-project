package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.AiChatRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiChatService {

    private final ChatClient chatClient;

    public AiChatService(ChatClient chatClient){
        this.chatClient = chatClient;
    }

    public String generateResponse(AiChatRequest request){
        return chatClient
                .prompt()
                .user(request.message())
                .call()
                .content();

    }

}
