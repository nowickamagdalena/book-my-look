package ztw.bookmylook.utils;

import java.time.LocalDate;

public class DateUtils {
    public static void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate))
            throw new IllegalArgumentException("Start date cannot be after end date");
    }
}
