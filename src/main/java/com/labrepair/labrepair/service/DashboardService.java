package com.labrepair.labrepair.service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.dto.DashboardSummaryResponse;
import com.labrepair.labrepair.dto.EquipmentFailureReportResponse;
import com.labrepair.labrepair.dto.MonthlyRepairCostResponse;
import com.labrepair.labrepair.dto.RoomCostReportResponse;
import com.labrepair.labrepair.model.ComputerRoom;
import com.labrepair.labrepair.model.Equipment;
import com.labrepair.labrepair.model.IncidentReport;
import com.labrepair.labrepair.repository.ComputerRoomRepository;
import com.labrepair.labrepair.repository.EquipmentRepository;
import com.labrepair.labrepair.repository.IncidentReportRepository;
import com.labrepair.labrepair.repository.SparePartRepository;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final EquipmentRepository equipmentRepository;
    private final IncidentReportRepository incidentRepository;
    private final ComputerRoomRepository roomRepository;
    private final SparePartRepository sparePartRepository;
    private final SparePartService sparePartService;

    public DashboardService(
            EquipmentRepository equipmentRepository,
            IncidentReportRepository incidentRepository,
            ComputerRoomRepository roomRepository,
            SparePartRepository sparePartRepository,
            SparePartService sparePartService
    ) {
        this.equipmentRepository = equipmentRepository;
        this.incidentRepository = incidentRepository;
        this.roomRepository = roomRepository;
        this.sparePartRepository = sparePartRepository;
        this.sparePartService = sparePartService;
    }

    public DashboardSummaryResponse getSummary() {
        long totalRooms = roomRepository.findAll().size();
        long totalEquipment = equipmentRepository.count();
        long activeEquipment = equipmentRepository.countByStatus("HOAT_DONG");
        long brokenEquipment = equipmentRepository.countByStatusNot("HOAT_DONG");

        long totalIncidents = incidentRepository.count();
        long pendingIncidents = incidentRepository.countByStatusNot("HOAN_THANH");
        long completedIncidents = incidentRepository.countByStatus("HOAN_THANH");
        BigDecimal totalRepairCost = incidentRepository.sumTotalActualCost();

        long totalSparePartTypes = sparePartRepository.count();
        long lowStockSpareParts = sparePartService.findLowStock().size();

        return new DashboardSummaryResponse(
                totalRooms,
                totalEquipment,
                activeEquipment,
                brokenEquipment,
                totalIncidents,
                pendingIncidents,
                completedIncidents,
                totalRepairCost != null ? totalRepairCost : BigDecimal.ZERO,
                totalSparePartTypes,
                lowStockSpareParts
        );
    }

    public List<RoomCostReportResponse> getRoomCostReport() {
        List<ComputerRoom> rooms = roomRepository.findAll();
        List<Object[]> rawStats = incidentRepository.countAndCostByRoomCode();

        Map<String, Object[]> statsMap = new HashMap<>();
        for (Object[] row : rawStats) {
            String roomCode = (String) row[0];
            if (roomCode != null) {
                statsMap.put(roomCode, row);
            }
        }

        List<RoomCostReportResponse> result = new ArrayList<>();
        for (ComputerRoom room : rooms) {
            String code = room.getRoomCode();
            long eqCount = equipmentRepository.countByRoomCode(code);
            long incidentCount = 0;
            BigDecimal totalCost = BigDecimal.ZERO;

            if (statsMap.containsKey(code)) {
                Object[] row = statsMap.get(code);
                incidentCount = ((Number) row[1]).longValue();
                totalCost = (BigDecimal) row[2];
            }

            result.add(new RoomCostReportResponse(
                    code,
                    room.getRoomName(),
                    eqCount,
                    incidentCount,
                    totalCost != null ? totalCost : BigDecimal.ZERO
            ));
        }

        result.sort(Comparator.comparing(RoomCostReportResponse::getTotalRepairCost).reversed());
        return result;
    }

    public List<EquipmentFailureReportResponse> getTopFailureEquipment(int limit) {
        List<Object[]> topList = incidentRepository.findTopFailureEquipments();
        List<EquipmentFailureReportResponse> responses = new ArrayList<>();

        int count = 0;
        for (Object[] row : topList) {
            if (count >= limit) break;
            Integer eqId = (Integer) row[0];
            long failureCount = ((Number) row[1]).longValue();
            BigDecimal cost = (BigDecimal) row[2];

            equipmentRepository.findById(eqId).ifPresent(eq -> {
                responses.add(new EquipmentFailureReportResponse(
                        eq.getId(),
                        eq.getEquipmentCode(),
                        eq.getName(),
                        eq.getRoomCode(),
                        eq.getManufacturer(),
                        eq.getModel(),
                        failureCount,
                        cost != null ? cost : BigDecimal.ZERO,
                        eq.getStatus()
                ));
            });
            count++;
        }

        return responses;
    }

    public List<MonthlyRepairCostResponse> getMonthlyRepairCosts() {
        List<IncidentReport> allIncidents = incidentRepository.findAll();

        Map<String, List<IncidentReport>> grouped = allIncidents.stream()
                .filter(i -> i.getCreatedAt() != null)
                .collect(Collectors.groupingBy(i -> i.getCreatedAt().getYear() + "-" + String.format("%02d", i.getCreatedAt().getMonthValue())));

        List<MonthlyRepairCostResponse> result = new ArrayList<>();
        for (Map.Entry<String, List<IncidentReport>> entry : grouped.entrySet()) {
            String[] parts = entry.getKey().split("-");
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            long incidentCount = entry.getValue().size();
            BigDecimal cost = entry.getValue().stream()
                    .map(i -> i.getActualCost() != null ? i.getActualCost() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(new MonthlyRepairCostResponse(year, month, incidentCount, cost));
        }

        result.sort(Comparator.comparing(MonthlyRepairCostResponse::getYear)
                .thenComparing(MonthlyRepairCostResponse::getMonth));
        return result;
    }
}
