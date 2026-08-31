import { useEffect } from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import { useNavigate } from "react-router-dom";

export default function SuccessContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageTransition>
      <div>
        <h1
          style={{
            textAlign: "center",
            transform: "translateY(500%)",
          }}
          className="text-success"
        >
          Success <i className="fa-solid fa-circle-check"></i>
        </h1>

        <dotlottie-wc
          src="https://lottie.host/bb7f9d5d-f4ae-4d37-83f4-b8d6902cbf8e/YzQs5rtuyh.lottie"
          style={{
            width: "600px",
            height: "600px",
            margin: "auto",
          }}
          autoplay
          loop
        />
      </div>
    </PageTransition>
  );
}
