package hu.eenugw.core.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class File {
    private String name;

    private String base64;

    private String extension;

    private byte[] content;
}
