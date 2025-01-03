import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import style from "./settings.module.css";
import { FaLock, FaEye, FaUser, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!oldPassword) newErrors.oldPassword = "Old password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const toastId = toast.loading("Updating...");
      const tokenId = Cookies.get("tokenId");
      console.log("Token from cookies:", tokenId);
      if (!tokenId) {
        toast.error("You are not authenticated.");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/update_settings`,
          { name, email, oldPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${tokenId}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const result = await res.data;
        if (res.status === 200) {
          toast.success(result.msg, { id: toastId });
        } else {
          toast.error(result.msg, { id: toastId });
        }
      } catch (error) {
        toast.error(error.message, { id: toastId });
      }
    }
  };
  // logout handler
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const logoutHandler = async () => {
    const tokenId = Cookies.get("tokenId");
    try {
      if (!tokenId) {
        toast.error("You are not authenticated.");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${apiUrl}/api/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenId}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status >= 200 && res.status < 300) {
        Cookies.remove("tokenId");
        toast.success(res.data.msg || "Logged out successfully", {
          duration: 100,
        });
        localStorage.removeItem("authState");
        sessionStorage.clear();
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Logout failed");
      console.log(error);
    }
  };

  return (
    <div className={style.settingsFormContainer}>
      <h2>Settings</h2>
      <form onSubmit={handleUpdate} className={style.settingsForm}>
        <div className={style.formGroup}>
          <label htmlFor="name">Name</label>
          <FaUser className={style.icon} />
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? style.errorInput : ""}
          />
          {errors.name && <p className={style.error}>{errors.name}</p>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="email">Updated Email</label>
          <FaLock className={style.icon} />
          <input
            type="email"
            id="email"
            placeholder="Updated Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? style.errorInput : ""}
          />
          <FaEye className={style.icon2} />

          {errors.email && <p className={style.error}>{errors.email}</p>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="oldPassword">Old Password</label>
          <FaLock className={style.icon} />
          <input
            type="password"
            id="oldPassword"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={errors.oldPassword ? style.errorInput : ""}
          />
          <FaEye className={style.icon2} />
          {errors.oldPassword && (
            <p className={style.error}>{errors.oldPassword}</p>
          )}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <FaLock className={style.icon} />
          <input
            type="password"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={errors.newPassword ? style.errorInput : ""}
          />
          <FaEye className={style.icon2} />
          {errors.newPassword && (
            <p className={style.error}>{errors.newPassword}</p>
          )}
        </div>

        <button type="submit" className={style.updateButton}>
          Update
        </button>
      </form>
      <div onClick={logoutHandler} className={style.logout}>
        <FaSignOutAlt /> Log Out
      </div>
    </div>
  );
};

export default SettingsPage;
