# Project Name  

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).  

## Getting Started  

Follow these steps to set up and run the project locally:  

### 1. Set Up the Backend  

1. Create a backend using MongoDB (or your preferred database).  
2. Configure environment variables:  
   - Create a `.env` file in the root directory.  
   - Include the following variables:  
     ```env
     EMAIL=<your-email>
     PASSWORD=<your-password>
     NEXT_PUBLIC_API_URL=<your-nextjs-api-url>
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```  

### 2. Install Dependencies  

1. Install Node.js packages:  
   ```bash
   npm install crypto
   npm install python
   npm install @types/nodemailer
   npm install nodemailer mongodb dotenv
   npm install --save-dev @types/jsonwebtoken
   npm install --save-dev @types/formidable
   ```

2. Set up a Python virtual environment:
Note: Steps 2.1 and 2.2 may not be required depending on your environment setup. Check with your groupmates for consistency.
  - Create a virtual environment:
    ```python3 -m venv myenv
    ```
  - Activate the virtual environment:
    ```source myenv/bin/activate
    ```
  - Install Python dependencies:
    ```pip install flask flask-cors pymongo dnspython email-validator flask-mail python-dotenv beautifulsoup4 requests
    ```

### 3. Run the Backend Server

1. Navigate to the backend directory:
```cd backend
```
2. Start the backend server:
```python3 ./app.py
```

### 4. Run the Development Server

Start the development server using one of the following commands:
```npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. View the Project

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the website.
