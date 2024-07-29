# Food Delivery Platform for Home-Cooked Food

Welcome to the Food Delivery Platform for Home-Cooked Food! This platform enables individuals with Alberta health certification to cook and sell food from their home kitchens. It also provides delivery agents with the tools they need to deliver food to customers. The project is organized into three main applications and uses Firebase and Google Cloud Platform (GCP) for backend services.

## Project Structure

The project is organized as a monorepo with the following applications:

1. **anyone-can-cook-app**: A React Native app for customers to browse and order home-cooked food.
2. **anyone-can-deliver**: A React Native app for delivery agents to receive delivery requests and manage deliveries.
3. **anyone-can-kitchen-dashboard**: A React web app for home kitchen operators to manage their menu, view orders, and track sales.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Firebase CLI](https://firebase.google.com/docs/cli#install-cli)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (for GCP)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/food-delivery-platform.git
cd food-delivery-platform
```
### 2. Install dependencies

```bash
# For anyone-can-cook-app
cd anyone-can-cook-app
npm install

# For anyone-can-deliver
cd ../anyone-can-deliver
npm install

# For anyone-can-kitchen-dashboard
cd ../anyone-can-kitchen-dashboard
npm install
```

### 3. Run the Project
```bash
# For anyone-can-cook-app
cd anyone-can-cook-app
expo start

# For anyone-can-deliver
cd ../anyone-can-deliver
expo start

# For anyone-can-kitchen-dashboard
cd ../anyone-can-kitchen-dashboard
npm start
```

## Features
# anyone-can-cook-app
- Browse and search for home-cooked food options.
- View detailed information about dishes and home kitchens.
- Place orders and track delivery status.

# anyone-can-deliver
- Receive and manage delivery requests.
- Update delivery status and track deliveries.
- Communicate with home kitchens and customers.

# anyone-can-kitchen-dashboard
- Manage menu items and pricing.
- View incoming orders and update order statuses.

