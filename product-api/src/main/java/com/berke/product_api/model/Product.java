package com.berke.product_api.model;

import lombok.Data;
import java.util.Map;

@Data
public class Product {
	private String name;
	private double popularityScore;
	private double weight;
	private Map<String, String> images;

	private double price;
	private double popularityRating;
}