package com.clinic.bookingsystem.EmailService;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    String sendSimpleMail(EmailDetails details);

}
