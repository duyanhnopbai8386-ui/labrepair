@echo off
chcp 65001 > nul
title [CỔNG 5173] LabRepair - Frontend Web Application
color 0A
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG FRONTEND (PORT 5173)
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [*] Cổng Người Dùng (Báo hỏng):  http://localhost:5173/
echo [*] Cổng Quản Trị Backend CMS:   http://localhost:5173/admin
echo [*] Trang Đăng Nhập Quản Trị:     http://localhost:5173/login
echo.

cd /d "D:\labrepair\labrepair\frontend"
npm run dev

pause
