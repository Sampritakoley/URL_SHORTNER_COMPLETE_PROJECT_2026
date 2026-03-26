package url.example.urlShortner.Services;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import url.example.urlShortner.DTOs.Analytics.GlobalAnalyticsResponse;
import url.example.urlShortner.DTOs.Analytics.LinkAnalyticsResponse;
import url.example.urlShortner.DTOs.Analytics.LogsAnalyticsResponse;
import url.example.urlShortner.Model.ClickEvent;
import url.example.urlShortner.Model.UrlMapping;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Repository.ClickEventRepository;
import url.example.urlShortner.Repository.UrlMappingRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AnalyticsService {
    private ClickEventRepository clickEventRepository;
    private UrlMappingRepository urlMappingRepository;

    public GlobalAnalyticsResponse getGlobalAnalytics(User user, LocalDate startDate, LocalDate endDate, String filter) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> events = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());

        GlobalAnalyticsResponse response = new GlobalAnalyticsResponse();

        // Summary
        GlobalAnalyticsResponse.GlobalSummary summary = new GlobalAnalyticsResponse.GlobalSummary();
        summary.setTotalClicks(events.size());
        summary.setActiveLinks(urlMappings.size());
        summary.setAvgCtr(0); // placeholder without impressions
        summary.setConversion(0); // placeholder without goals
        response.setSummary(summary);

        // Trends
        GlobalAnalyticsResponse.GlobalTrends trends = new GlobalAnalyticsResponse.GlobalTrends();
        Map<String, Long> clicksByDate = events.stream()
                .collect(Collectors.groupingBy(e -> e.getClickDate().format(DateTimeFormatter.ofPattern("MMM dd")), Collectors.counting()));
        
        List<GlobalAnalyticsResponse.GlobalTrends.TrendData> trendDataList = clicksByDate.entrySet().stream()
                .map(entry -> {
                    GlobalAnalyticsResponse.GlobalTrends.TrendData td = new GlobalAnalyticsResponse.GlobalTrends.TrendData();
                    td.setDate(entry.getKey());
                    td.setClicks(entry.getValue());
                    td.setImpressions(0); // Placeholder
                    return td;
                })
                .sorted(Comparator.comparing(GlobalAnalyticsResponse.GlobalTrends.TrendData::getDate)) // basic sort
                .collect(Collectors.toList());
        trends.setClicksOverTime(trendDataList);
        response.setTrends(trends);

        // Recent Activity
        List<GlobalAnalyticsResponse.RecentActivity> recentActivities = events.stream()
                .sorted(Comparator.comparing(ClickEvent::getClickDate).reversed())
                .limit(10)
                .map(e -> {
                    GlobalAnalyticsResponse.RecentActivity ra = new GlobalAnalyticsResponse.RecentActivity();
                    ra.setShortUrl("/" + e.getUrlMapping().getShortUrl());
                    ra.setLocation(e.getLocation() + ", " + e.getCountryCode());
                    ra.setDevice(e.getDevice());
                    ra.setTime(e.getClickDate().toString());
                    ra.setBrowser(e.getBrowser());
                    return ra;
                })
                .collect(Collectors.toList());
        response.setRecentActivity(recentActivities);

        // Top Referrers
        Map<String, Long> referrers = events.stream()
                .filter(e -> e.getReferrer() != null)
                .collect(Collectors.groupingBy(ClickEvent::getReferrer, Collectors.counting()));
        
        long totalWithReferrer = referrers.values().stream().mapToLong(Long::longValue).sum();
        List<GlobalAnalyticsResponse.TopReferrer> topReferrers = referrers.entrySet().stream()
                .map(entry -> {
                    GlobalAnalyticsResponse.TopReferrer tr = new GlobalAnalyticsResponse.TopReferrer();
                    tr.setName(entry.getKey());
                    double pct = totalWithReferrer > 0 ? (entry.getValue() * 100.0) / totalWithReferrer : 0;
                    tr.setPercentage(Math.round(pct));
                    tr.setTrend("+0%"); // Placeholder
                    return tr;
                })
                .sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()))
                .limit(5)
                .collect(Collectors.toList());
        response.setTopReferrers(topReferrers);

        return response;
    }

    public LogsAnalyticsResponse getLogsAnalytics(User user, int page, int limit, String search, String device, String location) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        Pageable pageable = PageRequest.of(page - 1, limit);
        
        // Let's filter in memory for simplicity with full search capabilities if needed, 
        // Or fetch all matching URLs and then Page via Stream. 
        // For a true implementation we'd use Specifications. Here we Stream filter:
        List<ClickEvent> allEvents = clickEventRepository.findByUrlMappingIn(urlMappings);
        
        // Filter
        if (search != null && !search.isEmpty()) {
            allEvents = allEvents.stream()
                    .filter(e -> e.getUrlMapping().getShortUrl().contains(search) || e.getUrlMapping().getOriginalUrl().contains(search))
                    .collect(Collectors.toList());
        }
        if (device != null && !device.isEmpty()) {
            allEvents = allEvents.stream()
                    .filter(e -> device.equalsIgnoreCase(e.getDevice()))
                    .collect(Collectors.toList());
        }
        if (location != null && !location.isEmpty()) {
            allEvents = allEvents.stream()
                    .filter(e -> e.getCountryCode() != null && e.getCountryCode().equalsIgnoreCase(location))
                    .collect(Collectors.toList());
        }

        allEvents.sort(Comparator.comparing(ClickEvent::getClickDate).reversed());
        
        int totalEvents = allEvents.size();
        int fromIndex = (page - 1) * limit;
        int toIndex = Math.min(fromIndex + limit, totalEvents);
        List<ClickEvent> paginatedEvents = fromIndex <= totalEvents ? allEvents.subList(fromIndex, toIndex) : Collections.emptyList();

        LogsAnalyticsResponse response = new LogsAnalyticsResponse();

        LogsAnalyticsResponse.Pagination pagination = new LogsAnalyticsResponse.Pagination();
        pagination.setTotalEvents(totalEvents);
        pagination.setCurrentPage(page);
        pagination.setTotalPages((int) Math.ceil((double) totalEvents / limit));
        pagination.setLimit(limit);
        response.setPagination(pagination);

        LogsAnalyticsResponse.QuickInsights insights = new LogsAnalyticsResponse.QuickInsights();
        insights.setTotalEvents(totalEvents);
        long uniqueVisitors = allEvents.stream().map(ClickEvent::getLocation).distinct().count(); // Mocking unique visitors
        insights.setUniqueVisitors(uniqueVisitors);
        
        Map<String, Long> sources = allEvents.stream().filter(e -> e.getReferrer() != null)
                .collect(Collectors.groupingBy(ClickEvent::getReferrer, Collectors.counting()));
        String topSource = sources.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("Direct");
        insights.setTopSource(topSource);
        response.setQuickInsights(insights);

        List<LogsAnalyticsResponse.LogEntry> logEntries = paginatedEvents.stream()
                .map(e -> {
                    LogsAnalyticsResponse.LogEntry log = new LogsAnalyticsResponse.LogEntry();
                    log.setShortUrl("/" + e.getUrlMapping().getShortUrl());
                    log.setOriginalUrl(e.getUrlMapping().getOriginalUrl());
                    log.setLocation(e.getLocation() + ", " + e.getCountryCode());
                    log.setCountryCode(e.getCountryCode());
                    log.setDevice(e.getDevice());
                    log.setReferrer(e.getReferrer());
                    log.setTimestamp(e.getClickDate().toString());
                    return log;
                })
                .collect(Collectors.toList());
        response.setLogs(logEntries);

        return response;
    }

    public LinkAnalyticsResponse getLinkAnalytics(String shortId, LocalDate startDate, LocalDate endDate, String location, String device) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortId);
        if (urlMapping == null) return null;

        List<ClickEvent> events = clickEventRepository.findByUrlMapping(urlMapping);
        
        // Apply filters
        if (startDate != null && endDate != null) {
            events = events.stream()
                    .filter(e -> !e.getClickDate().toLocalDate().isBefore(startDate) && !e.getClickDate().toLocalDate().isAfter(endDate))
                    .collect(Collectors.toList());
        }
        if (device != null && !device.isEmpty()) {
            events = events.stream().filter(e -> device.equalsIgnoreCase(e.getDevice())).collect(Collectors.toList());
        }
        if (location != null && !location.isEmpty()) {
            events = events.stream().filter(e -> e.getCountryCode() != null && e.getCountryCode().equalsIgnoreCase(location)).collect(Collectors.toList());
        }

        LinkAnalyticsResponse response = new LinkAnalyticsResponse();

        // Details
        LinkAnalyticsResponse.LinkDetails details = new LinkAnalyticsResponse.LinkDetails();
        details.setShortUrl("/" + urlMapping.getShortUrl());
        details.setOriginalUrl(urlMapping.getOriginalUrl());
        response.setLinkDetails(details);

        // Summary
        LinkAnalyticsResponse.LinkSummary summary = new LinkAnalyticsResponse.LinkSummary();
        summary.setTotalClicks(events.size());
        summary.setClickThrough(events.size()); // simplified
        summary.setUniqueVisitors(events.stream().map(ClickEvent::getLocation).distinct().count()); // simplified mock
        summary.setBounceRate(0); // placeholder
        response.setSummary(summary);

        // Trends
        LinkAnalyticsResponse.LinkTrends trends = new LinkAnalyticsResponse.LinkTrends();
        Map<String, Long> clicksByTime = events.stream()
                .collect(Collectors.groupingBy(e -> e.getClickDate().format(DateTimeFormatter.ofPattern("HH:00")), Collectors.counting()));
        List<LinkAnalyticsResponse.LinkTrends.TrendData> trendDataList = clicksByTime.entrySet().stream()
                .map(entry -> {
                    LinkAnalyticsResponse.LinkTrends.TrendData td = new LinkAnalyticsResponse.LinkTrends.TrendData();
                    td.setTime(entry.getKey());
                    td.setClicks(entry.getValue());
                    return td;
                })
                .sorted(Comparator.comparing(LinkAnalyticsResponse.LinkTrends.TrendData::getTime))
                .collect(Collectors.toList());
        trends.setClicksOverTime(trendDataList);
        response.setTrends(trends);

        // Latest Events
        List<LinkAnalyticsResponse.LatestEvent> latest = events.stream()
                .sorted(Comparator.comparing(ClickEvent::getClickDate).reversed())
                .limit(5)
                .map(e -> {
                    LinkAnalyticsResponse.LatestEvent le = new LinkAnalyticsResponse.LatestEvent();
                    le.setTimestamp(e.getClickDate().toString());
                    le.setLocation(e.getLocation());
                    le.setCountryCode(e.getCountryCode());
                    le.setDevice(e.getDevice());
                    le.setReferrer(e.getReferrer());
                    le.setOs(e.getOs());
                    return le;
                })
                .collect(Collectors.toList());
        response.setLatestEvents(latest);

        // UTMs
        Map<String, Long> utmSources = events.stream().filter(e -> e.getUtmSource() != null).collect(Collectors.groupingBy(ClickEvent::getUtmSource, Collectors.counting()));
        List<LinkAnalyticsResponse.UtmBreakdown> utms = utmSources.entrySet().stream()
                .map(entry -> {
                    LinkAnalyticsResponse.UtmBreakdown ub = new LinkAnalyticsResponse.UtmBreakdown();
                    ub.setParam("utm_source");
                    ub.setValue(entry.getKey());
                    ub.setClicks(entry.getValue());
                    return ub;
                }).collect(Collectors.toList());
        response.setUtmBreakdown(utms);

        // Top Metrics
        LinkAnalyticsResponse.TopMetrics metrics = new LinkAnalyticsResponse.TopMetrics();
        
        long totalEvents = events.size();
        
        Map<String, Long> countries = events.stream().filter(e -> e.getCountryCode() != null).collect(Collectors.groupingBy(ClickEvent::getCountryCode, Collectors.counting()));
        metrics.setCountries(countries.entrySet().stream().map(entry -> {
            LinkAnalyticsResponse.TopMetrics.Metric m = new LinkAnalyticsResponse.TopMetrics.Metric();
            m.setName(entry.getKey());
            m.setCode(entry.getKey());
            m.setPercentage(totalEvents > 0 ? (entry.getValue() * 100.0) / totalEvents : 0);
            return m;
        }).sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage())).limit(5).collect(Collectors.toList()));

        Map<String, Long> refs = events.stream().filter(e -> e.getReferrer() != null).collect(Collectors.groupingBy(ClickEvent::getReferrer, Collectors.counting()));
        metrics.setReferrers(refs.entrySet().stream().map(entry -> {
            LinkAnalyticsResponse.TopMetrics.Metric m = new LinkAnalyticsResponse.TopMetrics.Metric();
            m.setName(entry.getKey());
            m.setPercentage(totalEvents > 0 ? (entry.getValue() * 100.0) / totalEvents : 0);
            return m;
        }).sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage())).limit(5).collect(Collectors.toList()));

        Map<String, Long> devs = events.stream().filter(e -> e.getDevice() != null).collect(Collectors.groupingBy(ClickEvent::getDevice, Collectors.counting()));
        metrics.setDevices(devs.entrySet().stream().map(entry -> {
            LinkAnalyticsResponse.TopMetrics.Metric m = new LinkAnalyticsResponse.TopMetrics.Metric();
            m.setName(entry.getKey());
            m.setPercentage(totalEvents > 0 ? (entry.getValue() * 100.0) / totalEvents : 0);
            return m;
        }).sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage())).limit(5).collect(Collectors.toList()));

        response.setTopMetrics(metrics);

        return response;
    }
}
