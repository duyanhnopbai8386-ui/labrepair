@echo off
chcp 65001 > nul
title [CỔNG 8080] LabRepair - Backend Spring Boot REST API
color 0B
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG BACKEND API (PORT 8080)
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [!] Luu y: Hay dam bao ban da bat Start MySQL trong XAMPP hoac Laragon!
echo [*] URL API: http://localhost:8080/api
echo.

cd /d "D:\labrepair\labrepair"

if exist "target\labrepair-0.0.1-SNAPSHOT.jar" (
    echo [*] Dang chay file JAR dong goi tren cong 8080...
    java -jar target\labrepair-0.0.1-SNAPSHOT.jar
) else (
    echo [*] Dang chay qua Maven Wrapper tren cong 8080...
    call .\mvnw.cmd spring-boot:run
)

pause
