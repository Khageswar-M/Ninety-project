package Ninety.com.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Converter
public class GridConverter implements AttributeConverter<boolean[][], String> {
    private static ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(boolean[][] attribute) {
        if(attribute == null){
            return null;
        }

        try {
            return  MAPPER.writeValueAsString(attribute);
        }catch (Exception e){
            log.error("Failed to serialize challenge grid", e);
            throw new IllegalStateException("Could not serialize grid to JSON", e);
        }
    }

    @Override
    public boolean[][] convertToEntityAttribute(String dbData) {
        if(dbData == null || dbData.isBlank()){
            return null;
        }
        try {
            return MAPPER.readValue(dbData, boolean[][].class);
        }catch (Exception e){
            log.error("Failed to deserialize challenge grid", e);
            throw new IllegalStateException("Could not deserialize grid from JSON", e);
        }
    }
}
