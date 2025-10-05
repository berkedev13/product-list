package com.berke.product_api.service;

import com.berke.product_api.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

	private static final String GOLD_API_KEY = "goldapi-5m24msmge4vkcv-io";

	public List<Product> getAllProducts() {
		try {
			ObjectMapper mapper = new ObjectMapper();
			InputStream inputStream = getClass().getResourceAsStream("/products.json");
			List<Product> products = mapper.readValue(inputStream, new TypeReference<>() {});

			double goldPrice = fetchGoldPricePerGram();

			return products.stream().map(p -> {
				double price = (p.getPopularityScore() + 1) * p.getWeight() * goldPrice;
				p.setPrice(Math.round(price * 100.0) / 100.0);
				p.setPopularityRating(Math.round((p.getPopularityScore() / 20.0) * 10.0) / 10.0);
				return p;
			}).collect(Collectors.toList());

		} catch (Exception e) {
			throw new RuntimeException("Failed to read products.json", e);
		}
	}

	private double fetchGoldPricePerGram() {
		String url = "https://www.goldapi.io/api/XAU/USD";

		try {
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.set("x-access-token", GOLD_API_KEY);
			headers.set("Content-Type", "application/json");

			HttpEntity<String> entity = new HttpEntity<>(headers);
			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
			String result = response.getBody();

			ObjectMapper mapper = new ObjectMapper();
			Map<String, Object> jsonMap = mapper.readValue(result, Map.class);

			double pricePerOunce = Double.parseDouble(jsonMap.get("price_gram_24k").toString());
			return pricePerOunce;

		} catch (Exception e) {
			return 75.0;
		}
	}
}