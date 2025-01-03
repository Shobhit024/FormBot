import { useState } from "react";
import style from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Ellipse2 from "./../../assets/Ellipse2.png";
import Ellipse1 from "./../../assets/Ellipse1.png";
import GoogleIcon from "./../../assets/Google Icon.png";
import tringle from "./../../assets/tringle.png";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { storeIsLoggedIn } from "/src/redux/isLoginSlice.js";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const toastId = toast.loading("Verifying...");
    const tokenId = Cookies.get("tokenId");
    try {
      const API_URL =
        import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

      const res = await axios.post(
        `${API_URL}/api/login`,
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${tokenId}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const result = res.data;

      if (res.status === 200) {
        Cookies.set("tokenId", result.tokenId, { expires: 1 });

        dispatch(storeIsLoggedIn(true));
        navigate("/");
        toast.success(result.msg, { id: toastId });
      } else {
        toast.error(result.msg, { id: toastId });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };
  return (
    <div className={style.signUpFormContainer}>
      <IoMdArrowBack
        size={28}
        className={style.backIcon}
        onClick={() => navigate("/")}
      />
      <img
        className={style.tringleImg}
        src={tringle}
        alt="Triangle decoration"
      />
      <img
        className={style.Ellipse1}
        src={Ellipse1}
        alt="Ellipse decoration 1"
      />
      <img
        className={style.Ellipse2}
        src={Ellipse2}
        alt="Ellipse decoration 2"
      />
      <form onSubmit={handleSubmit} className={style.signUpForm}>
        <div className={style.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${errors.email ? style.borderError : ""} ${
              style.formGroupBorder
            }`}
          />
          {errors.email && <p className={style.error}>{errors.email}</p>}
        </div>
        <div className={style.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="***********"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${errors.password ? style.borderError : ""} ${
              style.formGroupBorder
            }`}
          />
          {errors.password && <p className={style.error}>{errors.password}</p>}
        </div>
        <button type="submit" className={style.signUpButton}>
          Log In
        </button>
        <p className={style.or}>or</p>
        <button type="submit" className={style.signUpgoogle}>
          <img
            className={style.GoogleIcon}
            src={GoogleIcon}
            alt="Google Icon"
          />
          Sign In with Google
        </button>
        <p className={style.loginLink}>
          Don't have an account? <Link to={"/register"}>Register Now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
