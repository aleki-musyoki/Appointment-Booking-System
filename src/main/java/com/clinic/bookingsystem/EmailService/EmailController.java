package com.clinic.bookingsystem.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {
    @Autowired private EmailService emailService;

    @PostMapping("/sendMail")
    public String sendEmail(@RequestBody EmailDetails details){
        String status = emailService.sendSimpleMail(details);
        return status;
    }
}
