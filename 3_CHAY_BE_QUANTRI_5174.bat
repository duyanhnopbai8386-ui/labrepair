@echo off
chcp 65001 > nul
title [PORT 5174] LabRepair - Cổng Quản Trị Backend CMS (Admin & Kỹ thuật viên)
color 0E
echo ========================================================
echo   HE THONG LABREPAIR - CỔNG QUẢN TRỊ BE (PORT 5174)
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [*] Nhiem vu: Quan tri CRUD phong may, thiet bi, tiep nhan sua chua, kho.
echo [*] Bao mat: Bat buoc dang nhap tai khoan Admin hoac Ky thuat vien!
echo [*] URL truy cap: http://localhost:5174
echo.

cd /d "D:\labrepair\labrepair\frontend"
npm run dev:be

pause
