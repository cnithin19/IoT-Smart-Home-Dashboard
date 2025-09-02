# IoT Smart Home Dashboard

A full-stack **IoT Smart Home Dashboard** built with **React (frontend)** and **.NET Core Web API (backend)**.  
This project allows users to register, log in, and manage smart devices (lights, AC, fans, thermostats, doors, and custom devices) with real-time sensor monitoring.

---

## 🚀 Features
- 🔐 User authentication with JWT
- 📱 Add, update, delete smart devices
- 💡 Control devices (on/off, toggle, thermostat & AC temperature/speed, door lock/unlock)
- 📊 Real-time sensor data (temperature & security) using SignalR
- 🎨 Beautiful modern UI with Tailwind + Material UI
- 🌐 Multi-user support (each user manages their own devices & sensors)

---

## 🛠️ Tech Stack
**Frontend**
- React.js  
- Redux Toolkit  
- Tailwind CSS + Material UI  
- Chart.js  

**Backend**
- ASP.NET Core Web API  
- Entity Framework Core (SQL Server)  
- SignalR for real-time updates  
- JWT Authentication  

---

## ⚙️ Setup Instructions

### Backend (.NET Core API)
```sh
cd backend
dotnet restore
dotnet ef database update   # apply migrations
dotnet run
