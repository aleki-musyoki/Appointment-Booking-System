package com.clinic.bookingsystem.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.Session;
import java.util.Properties;

@Service
public class EmailServiceImplementation implements EmailService{

    @Autowired
    private JavaMailSender javaMailSender;
    public String sendSimpleMail(EmailDetails details) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        try{
            mailMessage.setFrom("amusyoki.gm@gmail.com");
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(details.getMsgBody());
            mailMessage.setSubject(details.getSubject());

            javaMailSender.send(mailMessage);

            Properties props = new Properties();
            props.put("mail.mime.address.strict", "false");
            Session session = Session.getDefaultInstance(props);

            return mailMessage.getTo().toString();
        }catch (Exception err){
            return "Error! Mail not sent! " + err;
        }


    }
}
