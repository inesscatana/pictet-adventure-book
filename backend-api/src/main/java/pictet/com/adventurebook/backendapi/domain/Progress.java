package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Reading progress information for an adventure book")
public class Progress {
    @Schema(description = "Identifier of the book being read", example = "pirates-jade-sea.json")
    private String book;

    @Schema(description = "Section ID where the reader left off", example = "20")
    private String sectionId;

    @Schema(description = "Current health points", example = "85")
    private int health;

    @Schema(description = "Timestamp when progress was saved (milliseconds since epoch)", example = "1704067200000")
    private long timestamp;
}
