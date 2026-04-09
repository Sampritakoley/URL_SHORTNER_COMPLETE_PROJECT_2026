# 🔗 URL Shortener with Analytics Dashboard
![MixCollage-09-Apr-2026-06-31-AM-1518](https://github.com/user-attachments/assets/c226b48c-5a7b-475c-974f-4c7d50482e72)

A **scalable full-stack URL Shortener platform** that allows users to generate short URLs and track detailed analytics such as **click count, location, device type, and browser information** through a modern dashboard.

This project demonstrates **backend architecture, scalable event tracking, and modern frontend development practices.**

---

## 🚀 Project Overview

The system allows users to:

- Convert **long URLs into short shareable links**
- Redirect users instantly when the short URL is accessed
- Track **user click analytics**
- View **real-time analytics dashboard**
- Analyze traffic by **device, browser, and location**

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- CSS
- Axios
- React Router

### Backend
- Java
- Spring Boot
- REST APIs
- Spring Data JPA

### Database
- MySQL

### Event Processing (Analytics)
- Event logging architecture for scalable click tracking

### DevOps / Deployment
- Docker
- Railway Cloud Deployment
- GitHub

---

## ⚙️ Features

### 🔗 URL Shortening
- Convert long URLs into short unique URLs
- Collision-safe short URL generation

### 🔁 Instant Redirection
- Fast HTTP redirection
- Optimized response handling

### 📊 Click Analytics
Tracks user information including:
- Click timestamp
- Device type
- Browser
- Location
- Referrer

### 📈 Analytics Dashboard
Visual overview of:
- Total clicks
- Device distribution
- Browser usage
- Traffic sources

### 🌍 Scalable Architecture
Designed to support:
- Queue-based event logging
- High traffic loads
- Microservice scaling
