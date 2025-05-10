
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center birthday-gradient">
      <div className="text-center max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl">
        <h1 className="text-6xl font-display font-bold mb-6">404</h1>
        <p className="text-xl text-gray-700 mb-8">
          Oops! We couldn't find that page.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-birthday-purple hover:bg-birthday-purple/80 text-white"
        >
          Return to Celebration
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
