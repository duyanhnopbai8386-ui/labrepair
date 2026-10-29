@echo off
chcp 65001 > nul
title [PORT 5173] LabRepair - Frontend Cổng Người Dùng (Sinh viên & Giảng viên)
color 0A
echo ========================================================
echo   HE THONG LABREPAIR - CỔNG NGƯỜI DÙNG FE (PORT 5173)
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [*] Nhiem vu: Giao dien xem so do phong may va gui bao hong su co.
echo [*] URL truy cap: http://localhost:5173
echo.

cd /d "D:\labrepair\labrepair\frontend"
npm run dev:fe

pause
