package com.clinic.bookingsystem.EmailService;

import lombok.*;
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor

public class EmailDetails {
    private String recipient;
    private String msgBody;
    private String subject;

}
