package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labrepair.labrepair.dto.DashboardSummaryResponse;
import com.labrepair.labrepair.dto.EquipmentFailureReportResponse;
import com.labrepair.labrepair.dto.MonthlyRepairCostResponse;
import com.labrepair.labrepair.dto.RoomCostReportResponse;
import com.labrepair.labrepair.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/room-costs")
    public ResponseEntity<List<RoomCostReportResponse>> getRoomCosts() {
        return ResponseEntity.ok(dashboardService.getRoomCostReport());
    }

    @GetMapping("/top-failures")
    public ResponseEntity<List<EquipmentFailureReportResponse>> getTopFailures(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getTopFailureEquipment(limit));
    }

    @GetMapping("/monthly-costs")
    public ResponseEntity<List<MonthlyRepairCostResponse>> getMonthlyCosts() {
        return ResponseEntity.ok(dashboardService.getMonthlyRepairCosts());
    }
}
