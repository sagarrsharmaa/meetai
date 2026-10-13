"use client"
import { ErrorState } from "@/frontend/components/error-state"

 

const ErrorPage = () => {
    return (
        <ErrorState 
         title= "Error loading Agents"
         description="Something went wrong"
         />
    );
};
 
 export default ErrorPage;