package ece750.backend.user.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Builder
@AllArgsConstructor
public class ResponseFormat {
    private Object res;
    private Integer sign;
    private String msg;

    public ResponseFormat(Object res, int sign, String msg){
        this.res = res;
        this.sign = sign;
        this.msg = msg;
    }
}
