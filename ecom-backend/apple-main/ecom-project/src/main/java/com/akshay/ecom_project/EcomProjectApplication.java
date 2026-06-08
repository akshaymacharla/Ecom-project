package com.akshay.ecom_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class EcomProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcomProjectApplication.class, args);
	}

}
