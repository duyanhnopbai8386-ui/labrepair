package com.labrepair.labrepair.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRepairCostResponse {
    private int year;
    private int month;
    private long incidentCount;
    private BigDecimal totalCost;
}
