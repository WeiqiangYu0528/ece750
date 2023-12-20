package ece750.backend.user.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileBody {
    private String username;
    private Media avatar;
    private int loadingNumber;
}
