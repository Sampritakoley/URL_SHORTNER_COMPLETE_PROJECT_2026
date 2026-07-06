# 🔗 LinkSnap - Advanced URL Shortener & Analytics Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-LinkSnap-blue?style=for-the-badge)](https://linksnapsam.netlify.app/)
[![Backend API](https://img.shields.io/badge/API-Railway-brightgreen?style=for-the-badge)](https://linksnapurl.up.railway.app/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

LinkSnap is a highly scalable, full-stack URL shortening service designed with performance and deep analytics in mind. Built with **Spring Boot** and **React**, it features an optimized redirection engine powered by **Redis Caching** and a robust analytics engine that tracks geographic location, device types, and browser metrics using **Asynchronous Processing**.


## ✨ Key Features

- **Lightning-Fast Redirects:** Utilizes **Redis** to cache shortened URLs, completely bypassing database queries during redirects to achieve sub-millisecond response times.
- **Collision-Free Shortening:** Employs a **Base62 Encoding** algorithm mapped to auto-incrementing database IDs, ensuring 100% mathematical guarantee against short-code collisions.
- **Deep Analytics:** Tracks and aggregates detailed metrics for every click:
  - Geographic Location (Country matching via IP)
  - Device Type (Mobile, Tablet, Desktop)
  - Operating System & Browser
  - UTM Parameters (Source, Medium, Campaign)
- **Asynchronous Event Processing:** Uses Spring's `@Async` to decouple analytics tracking from the redirect flow. Users are redirected instantly while click metadata is processed and saved in the background.
- **Graceful Fallbacks:** Implements custom `CacheErrorHandler` logic to automatically fall back to the PostgreSQL database if the Redis cache is ever unavailable, guaranteeing 100% uptime for redirects.
- **Secure Authentication:** JWT-based stateless authentication with Spring Security.

---

## 🛠️ Tech Stack & Architecture

### Backend
- **Framework:** Java 17, Spring Boot 3
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Database:** PostgreSQL (Hosted on Neon DB)
- **Caching:** Redis (Hosted on Railway)
- **ORM:** Spring Data JPA / Hibernate

### Frontend
- **Framework:** React.js, Vite
- **Deployment:** Netlify

---

## 🧠 System Architecture Highlights

### 1. The Redirection Engine (Redis + Fallback)
When a user visits a short URL (e.g., `linksnapurl.up.railway.app/2`), the request hits a highly optimized `@GetMapping`. 
- The system first attempts to fetch the original URL from the **Redis Cache** in memory.
- If Redis is unavailable or the key expires, the system gracefully falls back to the **PostgreSQL** database, caching the result for future requests.

### 2. Base62 Encoding
Instead of generating random strings and querying the database to check for duplicates, LinkSnap uses the Database's auto-incrementing ID. 
- Save URL -> Get ID (e.g., `10000`) -> Encode ID to Base62 -> Result (`2Bi`).
- This guarantees uniqueness and requires only a highly efficient single index lookup.

### 3. Background Analytics
When a short URL is clicked, the `RedirectController` triggers a `ClickEventMessage`. This message is handed off to a background thread (`ClickEventProcessor.java`). The main thread immediately returns a `302 Redirect` to the user, while the background thread calls an external IP-API to determine the user's location and parses the `User-Agent` string to record analytics.

---

## 👨‍💻 Developed By
Passionate about building scalable backend systems, robust APIs, and seamless user interfaces.

<br>
---
> *"Scientists study the world as it is; engineers create the world that has never been."*
> <br>&mdash; **Theodore von Kármán** *(Aerospace Engineer & Physicist)*
