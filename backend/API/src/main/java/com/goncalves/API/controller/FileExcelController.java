package com.goncalves.API.controller;

import com.goncalves.API.DTO.DadosListagemRequest;
import com.goncalves.API.entities.request.RequestRepository;
import com.goncalves.API.entities.user.Users;
import com.goncalves.API.infra.security.NotFoundException;
import com.goncalves.API.infra.security.UnauthorizedException;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/file")
public class FileExcelController {
    @Autowired
    private RequestRepository repository;

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadExcel() {
        try {
            Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (user == null) {
                throw new UnauthorizedException("Usuário não autenticado");
            }

            var request = repository.findByUser(user);

            List<DadosListagemRequest> mappedRequests = request.stream()
                    .map(DadosListagemRequest::new)
                    .collect(Collectors.toList());

            // Crie um workbook Excel
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Requests");

            // Adicione dados reais
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Problem");
            headerRow.createCell(2).setCellValue("Description");
            headerRow.createCell(3).setCellValue("CreationRequest");

            // Adicione linhas para cada elemento em mappedRequests
            int rowNum = 1;
            for (DadosListagemRequest requestItem : mappedRequests) {
                Row dataRow = sheet.createRow(rowNum++);
                dataRow.createCell(0).setCellValue(requestItem.id());
                dataRow.createCell(1).setCellValue(requestItem.problem());
                dataRow.createCell(2).setCellValue(requestItem.description());
                dataRow.createCell(3).setCellValue(requestItem.creationRequest().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));

            }

            // Salve o workbook em um ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Configure os cabeçalhos da resposta
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "requests.xlsx");

            // Retorne a resposta com o conteúdo do arquivo Excel
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
        } catch (UnauthorizedException e) {
            // Usuário não autenticado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            e.printStackTrace(); // ou utilize um logger para registrar a exceção
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download/all")
    public ResponseEntity<byte[]> downloadExcelAllUsers() {
        try {
            var request = repository.findAll();

            List<DadosListagemRequest> mappedRequests = request.stream()
                    .map(DadosListagemRequest::new)
                    .collect(Collectors.toList());

            // Crie um workbook Excel
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Requests");

            // Adicione dados reais
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Problem");
            headerRow.createCell(2).setCellValue("Description");
            headerRow.createCell(3).setCellValue("CreationRequest");
            headerRow.createCell(4).setCellValue("ID_USER");
            headerRow.createCell(5).setCellValue("Username");
            headerRow.createCell(6).setCellValue("Email");

            int rowNum = 1;
            for (DadosListagemRequest requestItem : mappedRequests) {
                Row dataRow = sheet.createRow(rowNum++);
                dataRow.createCell(0).setCellValue(requestItem.id());
                dataRow.createCell(1).setCellValue(requestItem.problem());
                dataRow.createCell(2).setCellValue(requestItem.description());
                dataRow.createCell(3).setCellValue(requestItem.creationRequest().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
                dataRow.createCell(4).setCellValue(requestItem.user().getIdUsers());
                dataRow.createCell(5).setCellValue(requestItem.user().getUsername());
                dataRow.createCell(6).setCellValue(requestItem.user().getEmail());
            }

            // Salve o workbook em um ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Configure os cabeçalhos da resposta
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "requests_all.xlsx");

            // Retorne a resposta com o conteúdo do arquivo Excel
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
        } catch (UnauthorizedException e) {
            // Usuário não autenticado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            e.printStackTrace(); // ou utilize um logger para registrar a exceção
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}