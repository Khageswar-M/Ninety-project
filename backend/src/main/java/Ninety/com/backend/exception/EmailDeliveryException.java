package Ninety.com.backend.exception;

public class EmailDeliveryException extends RuntimeException{
    public EmailDeliveryException(String message, Exception ex){
        super(message);
    }
}
