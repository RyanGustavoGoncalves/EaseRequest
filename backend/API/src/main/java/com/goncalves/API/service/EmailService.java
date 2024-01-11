package com.goncalves.API.service;

import com.goncalves.API.infra.security.EmailException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void enviarEmailRedefinirSenha(String destinatario, String token) {
        String assunto = "Redefinição de Senha";
        String corpo = "Utilize esse token para fazer a alteração da sua senha:\n" + token;

        logger.info("Enviando e-mail para: {}", destinatario);
        logger.debug("Assunto: {}", assunto);
        logger.trace("Corpo: {}", corpo);

        try {
            enviarEmail(destinatario, assunto, corpo);
            logger.info("E-mail enviado com sucesso.");
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail:", e);
            new EmailException("Erro ao enviar e-mail", e);
        }
    }

    public void enviarEmail(String destinatario, String assunto, String corpo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(fromMail);
        mensagem.setTo(destinatario);
        mensagem.setSubject(assunto);
        mensagem.setText(corpo);
        logger.trace("Mensagem: {}", mensagem);
        javaMailSender.send(mensagem);
    }
}