import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CompleteProfile: React.FC = () => {

    const navigate = useNavigate();
  useEffect(() => {
    const redirect = async () => {
      navigate('/profile')
    };

    redirect();
  }, []);

  return (
    <div>

    </div>
  );
};

export default CompleteProfile;
