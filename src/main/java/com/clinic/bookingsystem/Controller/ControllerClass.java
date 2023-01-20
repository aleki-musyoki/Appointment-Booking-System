package com.clinic.bookingsystem.Controller;

import com.clinic.bookingsystem.Model.ModelClass;
import com.clinic.bookingsystem.Services.ServiceClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashSet;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/api/v1")
public class ControllerClass {
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("https://localhost:3000");
        corsConfiguration.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.HEAD.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name()));
        corsConfiguration.setMaxAge(1800L);
        source.registerCorsConfiguration("/**", corsConfiguration); // you restrict your path here
        return source;
    }

    @Autowired
    public ServiceClass serviceClass;
    public ControllerClass(ServiceClass serviceClass) {
        this.serviceClass = serviceClass;
    }

    @CrossOrigin("https://localhost:3000")
    @PostMapping("/createAppointment")
    public String createAppointment(@RequestBody ModelClass modelClass) throws InterruptedException, ExecutionException {
        return serviceClass.createAppointment(modelClass);
    }

    @GetMapping("/getAllAppointments")
    public HashSet<Object> getAllAppointments() throws InterruptedException, ExecutionException {
        return serviceClass.getAllAppointments();
    }

    @GetMapping("/getSpecificAppointment")
    public ModelClass getSpecificAppointment(@RequestParam String documentID) throws InterruptedException, ExecutionException {
        return serviceClass.getSpecificAppointment(documentID);
    }

    @PutMapping("/updateAppointment")
    public String updateCRUD(@RequestBody ModelClass modelClass) throws InterruptedException, ExecutionException {
        return serviceClass.updateAppointment(modelClass);
    }

    @PutMapping("/deleteAppointment")
    public String deleteAppointment(@RequestParam String documentID) throws InterruptedException, ExecutionException {
        return serviceClass.deleteAppointment(documentID);
    }

    //Unit Test to check whether controller is running
    @GetMapping("/testAppointment")
    public ResponseEntity<String> testGetEndpoint() {
        return ResponseEntity.ok("Test Get Endpoint is working");
    }

}
