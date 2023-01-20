package com.clinic.bookingsystem;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Objects;

@SpringBootApplication
public class BookingSystemApplication {

	public static void main(String[] args) throws IOException {
		ClassLoader classLoader = BookingSystemApplication.class.getClassLoader();

		File file = new File(Objects.requireNonNull(classLoader.getResource("serviceAccounts.json")).getFile());
		FileInputStream serviceAccount = new FileInputStream(file.getAbsolutePath());

		FirebaseOptions options = new FirebaseOptions.Builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.setDatabaseUrl("https://console.firebase.google.com/u/1/project/clinic-appointment-syste-be3e3/firestore/data/~2F")
				.build();

		FirebaseApp.initializeApp(options);



		SpringApplication.run(BookingSystemApplication.class, args);
	}

}
