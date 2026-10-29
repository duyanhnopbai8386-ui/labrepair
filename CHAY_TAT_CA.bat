@echo off
chcp 65001 > nul
title LabRepair - Khoi dong tat ca 3 phan he
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG TAT CA 3 CỔNG
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [1/3] Bat Backend Spring Boot API (Port 8080)...
start "Backend API 8080" cmd /k "D:\labrepair\1_CHAY_BACKEND_API_8080.bat"
timeout /t 2 > nul

echo [2/3] Bat Cổng Người Dùng FE (Port 5173)...
start "FE Nguoi Dung 5173" cmd /k "D:\labrepair\2_CHAY_FE_NGUOIDUNG_5173.bat"
timeout /t 1 > nul

echo [3/3] Bat Cổng Quản Trị BE Admin (Port 5174)...
start "BE Quan Tri 5174" cmd /k "D:\labrepair\3_CHAY_BE_QUANTRI_5174.bat"

echo.
echo ========================================================
echo   DA KHOI DONG THANH CONG!
echo   - Cổng Người Dùng (FE):      http://localhost:5173
echo   - Cổng Quản Trị Backend (BE): http://localhost:5174
echo   - Backend REST API:           http://localhost:8080/api
echo ========================================================
echo.
pause
