import { useState } from "react";
import style from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Ellipse2 from "./../../assets/Ellipse2.png";
import Ellipse1 from "./../../assets/Ellipse1.png";
import GoogleIcon from "./../../assets/Google Icon.png";
import tringle from "./../../assets/tringle.png";
import toast from "react-hot-toast";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const toastId = toast.loading("Loading....");
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/register`,
          { name, email, password, confirmPassword },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const result = await res.data;
        if (res.status === 201) {
          navigate("/login");
          toast.success(result.msg, { id: toastId });
        } else {
          toast.error(result.msg, { id: toastId });
        }
      } catch (error) {
        toast.error(error.message, { id: toastId });
      }
    }
  };

  return (
    <div className={style.signUpFormContainer}>
      <IoMdArrowBack
        size={28}
        className={style.backIcon}
        onClick={() => navigate(-1)}
      />
      <img
        className={style.tringleImg}
        src={tringle}
        alt="Triangle decoration"
      />
      <img className={style.Ellipse1} src={Ellipse1} alt="Ellipse" />
      <img className={style.Ellipse2} src={Ellipse2} alt="Ellipse" />
      <form onSubmit={handleSubmit} className={style.signUpForm}>
        <div className={style.formGroup}>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            placeholder="Enter a name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${errors.name && style.borderError} ${
              style.formGroupBorder
            }`}
          />
          {errors.name && <p className={style.error}>{errors.name}</p>}
        </div>
        <div className={style.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${errors.email && style.borderError} ${
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
            className={`${errors.password && style.borderError} ${
              style.formGroupBorder
            }`}
          />
          {errors.password && <p className={style.error}>{errors.password}</p>}
        </div>
        <div className={style.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            placeholder="***********"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${errors.confirmPassword && style.borderError} ${
              style.formGroupBorder
            }`}
          />
          {errors.confirmPassword && (
            <p className={style.error}>{errors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" className={style.signUpButton}>
          Sign Up
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
          Already have an account? <Link to={"/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
