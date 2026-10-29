@echo off
chcp 65001 > nul
title LabRepair - Khoi dong he thong
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG DONG THOI BACKEND & FRONTEND
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [1/2] Khoi dong Backend Spring Boot API tren cong 8080...
start "Backend API (8080)" cmd /k "D:\labrepair\CHAY_BACKEND.bat"
timeout /t 2 > nul

echo [2/2] Khoi dong Frontend Web tren cong 5173...
start "Frontend Web (5173)" cmd /k "D:\labrepair\CHAY_FRONTEND.bat"

echo.
echo ========================================================
echo   DA KHOI DONG THANH CONG!
echo   - Cổng Người Dùng (Client):  http://localhost:5173/
echo   - Cổng Quản Trị (Admin):     http://localhost:5173/admin
echo   - Backend REST API:          http://localhost:8080/api
echo ========================================================
echo.
pause
